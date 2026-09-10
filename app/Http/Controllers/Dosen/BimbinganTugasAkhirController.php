<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\BabTugasAkhir;
use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\ProgressTugasAkhir;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'tahapan' => BimbinganTugasAkhir::tahapanList(),
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
     * Display the full progress detail (tahapan stepper + timeline) for a
     * bimbingan owned by the logged-in dosen (as pembimbing 1 or 2).
     */
    public function show(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir): Response
    {
        $this->authorizePembimbing($request, $bimbinganTugasAkhir);
        $dosen = $this->dosen($request);

        $bimbinganTugasAkhir->load([
            'mahasiswa.programStudi',
            'pembimbing1',
            'pembimbing2',
            'progress' => fn ($query) => $query->with('dibuatOleh')->latest(),
            'babTugasAkhir',
        ]);

        return Inertia::render('dosen/bimbingan-tugas-akhir/show', [
            'bimbingan' => $bimbinganTugasAkhir,
            'tahapan' => BimbinganTugasAkhir::tahapanList(),
            'viewerPembimbingSlot' => $bimbinganTugasAkhir->pembimbing_1_id === $dosen->id ? 1 : 2,
        ]);
    }

    /**
     * Record the logged-in pembimbing's approval of the current tahap
     * (toggling it off again if they already approved). A bimbingan with
     * only Pembimbing I needs just that one approval; with both assigned,
     * the tahap only actually advances once both have approved — marking
     * the last tahap (sidang) complete sets `selesai_pada` instead of
     * advancing further, since there is nothing beyond sidang.
     */
    public function setujuiTahap(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir): RedirectResponse
    {
        $this->authorizePembimbing($request, $bimbinganTugasAkhir);
        abort_if($bimbinganTugasAkhir->selesai_pada !== null, 422, 'Tugas akhir ini sudah selesai.');

        $dosen = $this->dosen($request);
        $kolom = $bimbinganTugasAkhir->pembimbing_1_id === $dosen->id
            ? 'acc_pembimbing_1_pada'
            : 'acc_pembimbing_2_pada';

        if ($bimbinganTugasAkhir->{$kolom} !== null) {
            $bimbinganTugasAkhir->update([$kolom => null]);

            return back()->with('success', 'Persetujuan Anda untuk tahap ini dibatalkan');
        }

        $bimbinganTugasAkhir->update([$kolom => now()]);

        $sudahLengkap = $bimbinganTugasAkhir->acc_pembimbing_1_pada !== null
            && ($bimbinganTugasAkhir->pembimbing_2_id === null || $bimbinganTugasAkhir->acc_pembimbing_2_pada !== null);

        if (! $sudahLengkap) {
            return back()->with('success', 'Persetujuan Anda untuk tahap ini tercatat');
        }

        DB::transaction(function () use ($bimbinganTugasAkhir, $request): void {
            ProgressTugasAkhir::create([
                'bimbingan_tugas_akhir_id' => $bimbinganTugasAkhir->id,
                'tahap' => $bimbinganTugasAkhir->tahap_saat_ini,
                'tipe' => 'selesai',
                'catatan' => null,
                'dibuat_oleh_user_id' => $request->user()->id,
            ]);

            $tahapKeys = array_keys(BimbinganTugasAkhir::TAHAPAN);
            $currentIndex = array_search($bimbinganTugasAkhir->tahap_saat_ini, $tahapKeys, true);

            if ($currentIndex === count($tahapKeys) - 1) {
                $bimbinganTugasAkhir->update([
                    'selesai_pada' => now(),
                    'acc_pembimbing_1_pada' => null,
                    'acc_pembimbing_2_pada' => null,
                ]);

                return;
            }

            $tahapBerikutnya = $tahapKeys[$currentIndex + 1];
            $bimbinganTugasAkhir->update([
                'tahap_saat_ini' => $tahapBerikutnya,
                'acc_pembimbing_1_pada' => null,
                'acc_pembimbing_2_pada' => null,
            ]);

            if ($tahapBerikutnya === 'penyusunan_bab' && $bimbinganTugasAkhir->babTugasAkhir()->doesntExist()) {
                foreach (BimbinganTugasAkhir::DEFAULT_BAB as $urutan => $nama) {
                    BabTugasAkhir::create([
                        'bimbingan_tugas_akhir_id' => $bimbinganTugasAkhir->id,
                        'nama' => $nama,
                        'urutan' => $urutan,
                    ]);
                }
            }
        });

        return back()->with('success', 'Kedua pembimbing sudah menyetujui, tahap berhasil ditandai selesai');
    }

    /**
     * Record a formal revision note against the current tahap. Does not
     * advance `tahap_saat_ini`.
     */
    public function tambahRevisi(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir): RedirectResponse
    {
        $this->authorizePembimbing($request, $bimbinganTugasAkhir);

        $validated = $request->validate([
            'catatan' => ['required', 'string', 'max:1000'],
        ]);

        ProgressTugasAkhir::create([
            'bimbingan_tugas_akhir_id' => $bimbinganTugasAkhir->id,
            'tahap' => $bimbinganTugasAkhir->tahap_saat_ini,
            'tipe' => 'revisi',
            'catatan' => $validated['catatan'],
            'dibuat_oleh_user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Catatan revisi berhasil ditambahkan');
    }

    /**
     * Change the official judul, logging the old and new title in the timeline.
     */
    public function gantiJudul(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir): RedirectResponse
    {
        $this->authorizePembimbing($request, $bimbinganTugasAkhir);

        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
        ]);

        $judulLama = $bimbinganTugasAkhir->judul;

        DB::transaction(function () use ($bimbinganTugasAkhir, $validated, $judulLama, $request): void {
            $bimbinganTugasAkhir->update(['judul' => $validated['judul']]);

            ProgressTugasAkhir::create([
                'bimbingan_tugas_akhir_id' => $bimbinganTugasAkhir->id,
                'tahap' => null,
                'tipe' => 'ganti_judul',
                'catatan' => "Judul diubah dari \"{$judulLama}\" menjadi \"{$validated['judul']}\"",
                'dibuat_oleh_user_id' => $request->user()->id,
            ]);
        });

        return back()->with('success', 'Judul berhasil diperbarui');
    }

    /**
     * Add a bab checklist item — beyond the 5 seeded automatically when the
     * bimbingan reaches `penyusunan_bab`, a pembimbing can add more (e.g. a
     * 6th bab, "Lampiran") or, for a bimbingan that skipped the auto-seed
     * somehow, build the checklist from scratch.
     */
    public function storeBab(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir): RedirectResponse
    {
        $this->authorizePembimbing($request, $bimbinganTugasAkhir);

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
        ]);

        $urutan = ($bimbinganTugasAkhir->babTugasAkhir()->max('urutan') ?? -1) + 1;

        BabTugasAkhir::create([
            'bimbingan_tugas_akhir_id' => $bimbinganTugasAkhir->id,
            'nama' => $validated['nama'],
            'urutan' => $urutan,
        ]);

        return back()->with('success', 'Item bab berhasil ditambahkan');
    }

    /**
     * Toggle a bab checklist item between selesai and belum selesai.
     */
    public function toggleBab(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir, BabTugasAkhir $bab): RedirectResponse
    {
        $this->authorizePembimbing($request, $bimbinganTugasAkhir);
        abort_unless($bab->bimbingan_tugas_akhir_id === $bimbinganTugasAkhir->id, 404);

        $bab->update([
            'selesai' => ! $bab->selesai,
            'selesai_pada' => $bab->selesai ? null : now(),
        ]);

        return back()->with('success', 'Item bab berhasil diperbarui');
    }

    /**
     * Remove a bab checklist item.
     */
    public function destroyBab(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir, BabTugasAkhir $bab): RedirectResponse
    {
        $this->authorizePembimbing($request, $bimbinganTugasAkhir);
        abort_unless($bab->bimbingan_tugas_akhir_id === $bimbinganTugasAkhir->id, 404);

        $bab->delete();

        return back()->with('success', 'Item bab berhasil dihapus');
    }

    /**
     * Only the pembimbing 1 or 2 of this bimbingan may manage its progress.
     */
    private function authorizePembimbing(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir): void
    {
        $dosen = $this->dosen($request);

        abort_unless(
            $bimbinganTugasAkhir->pembimbing_1_id === $dosen->id || $bimbinganTugasAkhir->pembimbing_2_id === $dosen->id,
            403
        );
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
