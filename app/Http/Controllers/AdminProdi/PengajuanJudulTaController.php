<?php

namespace App\Http\Controllers\AdminProdi;

use App\Concerns\AuthorizesProgramStudi;
use App\Http\Controllers\Controller;
use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\PengajuanJudulTa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanJudulTaController extends Controller
{
    use AuthorizesProgramStudi;

    /**
     * Display judul tugas akhir submissions for this program studi, grouped by mahasiswa.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $entryFilter = function ($query) use ($request): void {
            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }
        };

        $mahasiswaQuery = Mahasiswa::where('program_studi_id', $programStudiId)
            ->whereHas('pengajuanJudulTa', $entryFilter);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $mahasiswaQuery->where(function ($q) use ($search): void {
                $q->where('nim', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        $mahasiswas = $mahasiswaQuery->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        $mahasiswas->getCollection()->load([
            'pengajuanJudulTa' => function ($query) use ($entryFilter): void {
                $entryFilter($query);
                $query->latest();
            },
            'bimbinganTugasAkhir.pembimbing1',
            'bimbinganTugasAkhir.pembimbing2',
        ]);

        return Inertia::render('admin-prodi/pengajuan-judul-ta/index', [
            'mahasiswas' => $mahasiswas,
            'dosenOptions' => Dosen::where('program_studi_id', $programStudiId)
                ->orderBy('nama')
                ->get(['id', 'nama', 'nidn']),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Approve a pending judul proposal, assigning Pembimbing I (required) and
     * Pembimbing II (optional). This creates or updates the mahasiswa's
     * BimbinganTugasAkhir record — a mahasiswa has at most one active
     * bimbingan, so re-approving a different judul for the same mahasiswa
     * replaces the earlier one instead of duplicating it.
     */
    public function approve(Request $request, PengajuanJudulTa $pengajuanJudulTa): RedirectResponse
    {
        $this->authorizeSameProgramStudi($pengajuanJudulTa->mahasiswa?->program_studi_id, $request);
        abort_unless($pengajuanJudulTa->status === 'pending', 422, 'Pengajuan ini sudah diproses.');

        $programStudiId = $request->user()->program_studi_id;

        $validated = $request->validate([
            'pembimbing_1_id' => [
                'required',
                'integer',
                Rule::exists('dosen', 'id')->where('program_studi_id', $programStudiId),
            ],
            'pembimbing_2_id' => [
                'nullable',
                'integer',
                Rule::exists('dosen', 'id')->where('program_studi_id', $programStudiId),
                Rule::notIn([$request->input('pembimbing_1_id')]),
            ],
        ], [
            'pembimbing_2_id.not_in' => 'Pembimbing II tidak boleh sama dengan Pembimbing I.',
        ]);

        DB::transaction(function () use ($pengajuanJudulTa, $validated): void {
            $pengajuanJudulTa->update(['status' => 'disetujui']);

            BimbinganTugasAkhir::updateOrCreate(
                ['mahasiswa_id' => $pengajuanJudulTa->mahasiswa_id],
                [
                    'judul' => $pengajuanJudulTa->judul,
                    'pembimbing_1_id' => $validated['pembimbing_1_id'],
                    'pembimbing_2_id' => $validated['pembimbing_2_id'] ?? null,
                ],
            );
        });

        return back()->with('success', 'Judul tugas akhir berhasil disetujui dan pembimbing ditetapkan');
    }

    /**
     * Reject a pending judul proposal.
     */
    public function reject(Request $request, PengajuanJudulTa $pengajuanJudulTa): RedirectResponse
    {
        $this->authorizeSameProgramStudi($pengajuanJudulTa->mahasiswa?->program_studi_id, $request);
        abort_unless($pengajuanJudulTa->status === 'pending', 422, 'Pengajuan ini sudah diproses.');

        $pengajuanJudulTa->update([
            'status' => 'ditolak',
            'catatan' => $request->input('catatan'),
        ]);

        return back()->with('success', 'Judul tugas akhir berhasil ditolak');
    }
}
