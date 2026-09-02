<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BimbinganTugasAkhirController extends Controller
{
    /**
     * How many mahasiswa the picker returns at once. The dosen narrows the list
     * with the search box rather than scrolling a whole cohort.
     */
    private const MAX_MAHASISWA_OPTIONS = 25;

    /**
     * Display mahasiswa bimbingan tugas akhir for the logged-in dosen (as pembimbing 1 or 2).
     */
    public function index(Request $request): Response
    {
        $dosen = $this->dosen($request);

        $bimbingans = BimbinganTugasAkhir::with(['mahasiswa.programStudi', 'pembimbing1', 'pembimbing2'])
            ->where(function ($query) use ($dosen): void {
                $query->where('pembimbing_1_id', $dosen->id)
                    ->orWhere('pembimbing_2_id', $dosen->id);
            })
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('dosen/bimbingan-tugas-akhir/index', [
            'bimbingans' => $bimbingans,
            // Only resolved on the partial reload the dialog fires, so opening
            // the page never ships a cohort's worth of mahasiswa.
            'mahasiswaOptions' => Inertia::optional(fn () => $this->mahasiswaOptions($request, $dosen)),
            'dosenOptions' => Inertia::optional(fn () => $this->dosenOptions($dosen)),
            'filters' => ['mahasiswa_search' => (string) $request->input('mahasiswa_search', '')],
        ]);
    }

    /**
     * Store a new bimbingan, with the logged-in dosen as pembimbing 1.
     */
    public function store(Request $request): RedirectResponse
    {
        $dosen = $this->dosen($request);

        $validated = $request->validate([
            'mahasiswa_id' => [
                'required',
                'integer',
                // A mahasiswa may only be supervised within their own program
                // studi, and only while still active.
                Rule::exists('mahasiswa', 'id')
                    ->where('program_studi_id', $dosen->program_studi_id)
                    ->where('status', 'aktif'),
                Rule::unique('bimbingan_tugas_akhir', 'mahasiswa_id'),
            ],
            'judul' => ['required', 'string', 'max:255'],
            'pembimbing_2_id' => [
                'nullable',
                'integer',
                Rule::exists('dosen', 'id')->where('program_studi_id', $dosen->program_studi_id),
                Rule::notIn([$dosen->id]),
            ],
        ], [
            'mahasiswa_id.unique' => 'Mahasiswa ini sudah memiliki bimbingan tugas akhir.',
            'pembimbing_2_id.not_in' => 'Pembimbing II tidak boleh sama dengan Anda sebagai Pembimbing I.',
        ]);

        BimbinganTugasAkhir::create([
            'mahasiswa_id' => $validated['mahasiswa_id'],
            'judul' => $validated['judul'],
            'pembimbing_1_id' => $dosen->id,
            'pembimbing_2_id' => $validated['pembimbing_2_id'] ?? null,
        ]);

        return back()->with('success', 'Bimbingan tugas akhir berhasil ditambahkan');
    }

    /**
     * Update the status/catatan of a bimbingan owned by the logged-in dosen.
     */
    public function update(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir): RedirectResponse
    {
        $dosen = $this->dosen($request);

        abort_unless(
            $bimbinganTugasAkhir->pembimbing_1_id === $dosen->id || $bimbinganTugasAkhir->pembimbing_2_id === $dosen->id,
            403
        );

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:aktif,revisi,lainnya'],
            'catatan' => ['nullable', 'string', 'max:1000'],
        ]);

        $bimbinganTugasAkhir->update($validated);

        return back()->with('success', 'Bimbingan tugas akhir berhasil diperbarui');
    }

    /**
     * Mahasiswa this dosen may still take on, narrowed by the picker's search.
     *
     * Excludes anyone who already has a bimbingan — a mahasiswa has at most one
     * tugas akhir, so showing them would only lead to a rejected submission.
     *
     * @return array{items: array<int, Mahasiswa>, total: int, limit: int}
     */
    private function mahasiswaOptions(Request $request, Dosen $dosen): array
    {
        $search = trim((string) $request->input('mahasiswa_search', ''));

        $query = Mahasiswa::query()
            ->where('program_studi_id', $dosen->program_studi_id)
            ->where('status', 'aktif')
            ->whereDoesntHave('bimbinganTugasAkhir')
            ->when($search !== '', function ($q) use ($search): void {
                $q->where(function ($inner) use ($search): void {
                    $inner->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama', 'like', "%{$search}%");
                });
            });

        return [
            'total' => (clone $query)->count(),
            'limit' => self::MAX_MAHASISWA_OPTIONS,
            'items' => $query->orderBy('nama')
                ->limit(self::MAX_MAHASISWA_OPTIONS)
                ->get(['id', 'nim', 'nama'])
                ->all(),
        ];
    }

    /**
     * Colleagues in the same program studi who can act as Pembimbing II.
     *
     * @return array<int, Dosen>
     */
    private function dosenOptions(Dosen $dosen): array
    {
        return Dosen::query()
            ->where('program_studi_id', $dosen->program_studi_id)
            ->whereKeyNot($dosen->id)
            ->orderBy('nama')
            ->get(['id', 'nama', 'nidn'])
            ->all();
    }

    /**
     * The Dosen record behind the logged-in user.
     */
    private function dosen(Request $request): Dosen
    {
        $dosen = $request->user()->dosen;

        abort_if($dosen === null, 403);

        return $dosen;
    }
}
