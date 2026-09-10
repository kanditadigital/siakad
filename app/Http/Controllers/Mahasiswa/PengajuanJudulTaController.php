<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\BimbinganTugasAkhir;
use App\Models\Mahasiswa;
use App\Models\PengajuanJudulTa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanJudulTaController extends Controller
{
    /**
     * A mahasiswa may have at most this many judul awaiting a decision or
     * already approved at once. A rejected judul frees up its slot so the
     * mahasiswa can propose a replacement.
     */
    private const BATAS_AKTIF = 3;

    /**
     * Display the mahasiswa's own judul tugas akhir submissions.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $this->mahasiswa($request);

        $pengajuan = $mahasiswa->pengajuanJudulTa()->latest()->get();

        $bimbingan = $mahasiswa->bimbinganTugasAkhir()->with([
            'pembimbing1',
            'pembimbing2',
            'progress' => fn ($query) => $query->with('dibuatOleh')->latest(),
            'babTugasAkhir',
        ])->first();

        return Inertia::render('mahasiswa/pengajuan-judul-ta', [
            'pengajuan' => $pengajuan,
            'sisaSlot' => max(0, self::BATAS_AKTIF - $this->jumlahAktif($mahasiswa)),
            'batasAktif' => self::BATAS_AKTIF,
            'bimbingan' => $bimbingan,
            'tahapan' => BimbinganTugasAkhir::tahapanList(),
        ]);
    }

    /**
     * Submit a new judul proposal, up to the active-slot limit.
     */
    public function store(Request $request): RedirectResponse
    {
        $mahasiswa = $this->mahasiswa($request);

        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
        ]);

        if ($this->jumlahAktif($mahasiswa) >= self::BATAS_AKTIF) {
            return back()->withErrors([
                'judul' => 'Anda sudah mengajukan '.self::BATAS_AKTIF.' judul yang masih aktif (pending/disetujui). Tunggu keputusan atau hapus pengajuan yang masih pending.',
            ]);
        }

        $mahasiswa->pengajuanJudulTa()->create($validated);

        return back()->with('success', 'Judul tugas akhir berhasil diajukan');
    }

    /**
     * Withdraw a pending judul so the mahasiswa can submit a replacement.
     */
    public function destroy(Request $request, PengajuanJudulTa $pengajuanJudulTa): RedirectResponse
    {
        $mahasiswa = $this->mahasiswa($request);

        abort_unless($pengajuanJudulTa->mahasiswa_id === $mahasiswa->id, 403);
        abort_unless($pengajuanJudulTa->status === 'pending', 422, 'Judul yang sudah diproses tidak dapat dihapus.');

        $pengajuanJudulTa->delete();

        return back()->with('success', 'Pengajuan judul berhasil dihapus');
    }

    /**
     * Judul currently occupying a slot: pending (awaiting decision) or
     * already disetujui (approved judul stays reserved).
     */
    private function jumlahAktif(Mahasiswa $mahasiswa): int
    {
        return $mahasiswa->pengajuanJudulTa()->whereIn('status', ['pending', 'disetujui'])->count();
    }

    /**
     * The Mahasiswa record behind the logged-in user.
     */
    private function mahasiswa(Request $request): Mahasiswa
    {
        $mahasiswa = Mahasiswa::where('user_id', $request->user()->id)->first();

        abort_if($mahasiswa === null, 404);

        return $mahasiswa;
    }
}
