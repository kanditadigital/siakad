<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\BimbinganAkademik;
use App\Models\Dosen;
use App\Models\Krs;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KrsPaController extends Controller
{
    /**
     * Display pending KRS entries submitted by this dosen's mahasiswa asuh.
     *
     * A PA reviews independently of Admin Prodi — either approver can act on
     * a pending entry; whoever acts first finalizes it (see siakad.json's
     * "Disetujui Dosen PA/BAAK").
     */
    public function index(Request $request): Response
    {
        $dosen = $this->dosen($request);

        $krss = Krs::with(['mahasiswa', 'kelas.mataKuliah', 'academicYearSemester'])
            ->whereHas('mahasiswa', fn ($query) => $query->where('pa_dosen_id', $dosen->id))
            ->where('status', 'pending')
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->input('search');
                $query->whereHas('mahasiswa', function ($mq) use ($search): void {
                    $mq->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('dosen/krs-pa/index', [
            'krss' => $krss,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display a pending KRS entry with the checks a PA needs to decide:
     * total SKS, schedule clash, prerequisite, and the IPS-based SKS ceiling.
     */
    public function show(Request $request, Krs $krs): Response
    {
        $dosen = $this->dosenMilikMahasiswaAsuh($request, $krs);

        $krs->load(['mahasiswa.programStudi', 'kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester']);

        $mahasiswa = $krs->mahasiswa;
        $totalSksDisetujui = Krs::totalSksDisetujui($mahasiswa->id, $krs->academic_year_semester_id);
        $sksMataKuliah = $krs->kelas->mataKuliah->sks ?? 0;
        $ips = $mahasiswa->hitungIps();

        return Inertia::render('dosen/krs-pa/show', [
            'krs' => $krs,
            'dosen' => $dosen->only(['id', 'nama']),
            'pengecekan' => [
                'total_sks_disetujui' => $totalSksDisetujui,
                'total_sks_jika_disetujui' => $totalSksDisetujui + $sksMataKuliah,
                'batas_sks_flat' => Krs::maxSks(),
                'ips_terakhir' => $ips,
                'batas_sks_ips' => Krs::maxSksUntukIps($ips > 0 ? $ips : null),
                'ada_bentrok_jadwal' => $krs->kelas !== null
                    ? Krs::adaBentrokJadwal($mahasiswa->id, $krs->academic_year_semester_id, $krs->kelas)
                    : false,
                'prasyarat_terpenuhi' => $krs->kelas?->mataKuliah !== null
                    ? Krs::prasyaratTerpenuhi($mahasiswa->id, $krs->kelas->mataKuliah)
                    : true,
            ],
        ]);
    }

    /**
     * Approve a pending KRS entry, enforcing the same flat max-SKS limit
     * Admin Prodi enforces (see AdminProdi\KrsController::approve). The
     * IPS-based ceiling shown on the review page is advisory — it informs
     * the PA's decision rather than hard-blocking it, since a PA may have
     * good reason to allow slightly more (e.g. IPS improved this period).
     */
    public function approve(Request $request, Krs $krs): RedirectResponse
    {
        $this->dosenMilikMahasiswaAsuh($request, $krs);
        abort_unless($krs->status === 'pending', 422, 'KRS ini sudah diproses.');

        $krs->load('kelas.mataKuliah');
        $totalSks = Krs::totalSksDisetujui($krs->mahasiswa_id, $krs->academic_year_semester_id)
            + ($krs->kelas->mataKuliah->sks ?? 0);

        if ($totalSks > Krs::maxSks()) {
            return back()->withErrors([
                'krs' => "Total SKS akan menjadi {$totalSks}, melebihi batas maksimal ".Krs::maxSks().' SKS per semester.',
            ]);
        }

        $krs->update(['status' => 'disetujui', 'catatan' => null]);

        return back()->with('success', 'KRS berhasil disetujui');
    }

    /**
     * Reject a pending KRS entry. Requires a catatan explaining why, kept on
     * the KRS itself (shown to the mahasiswa) and logged to the bimbingan
     * akademik history.
     */
    public function reject(Request $request, Krs $krs): RedirectResponse
    {
        $dosen = $this->dosenMilikMahasiswaAsuh($request, $krs);
        abort_unless($krs->status === 'pending', 422, 'KRS ini sudah diproses.');

        $validated = $request->validate([
            'catatan' => ['required', 'string', 'max:1000'],
        ]);

        $krs->update(['status' => 'ditolak', 'catatan' => $validated['catatan']]);
        $this->catatBimbingan($dosen, $krs, $validated['catatan']);

        return back()->with('success', 'KRS berhasil ditolak');
    }

    /**
     * Ask the mahasiswa to revise their KRS — distinct from a flat reject
     * because the mahasiswa is expected to withdraw and resubmit
     * (Mahasiswa\KrsController::destroy only allows withdrawing
     * pending/revisi entries).
     */
    public function requestRevision(Request $request, Krs $krs): RedirectResponse
    {
        $dosen = $this->dosenMilikMahasiswaAsuh($request, $krs);
        abort_unless($krs->status === 'pending', 422, 'KRS ini sudah diproses.');

        $validated = $request->validate([
            'catatan' => ['required', 'string', 'max:1000'],
        ]);

        $krs->update(['status' => 'revisi', 'catatan' => $validated['catatan']]);
        $this->catatBimbingan($dosen, $krs, $validated['catatan']);

        return back()->with('success', 'Mahasiswa diminta merevisi KRS');
    }

    private function catatBimbingan(Dosen $dosen, Krs $krs, string $catatan): void
    {
        BimbinganAkademik::create([
            'dosen_id' => $dosen->id,
            'mahasiswa_id' => $krs->mahasiswa_id,
            'krs_id' => $krs->id,
            'topik' => 'Konsultasi KRS '.($krs->academicYearSemester->nama_tahun_akademik ?? ''),
            'catatan' => $catatan,
        ]);
    }

    private function dosen(Request $request): Dosen
    {
        $dosen = $request->user()->dosen;

        abort_if($dosen === null, 403);

        return $dosen;
    }

    private function dosenMilikMahasiswaAsuh(Request $request, Krs $krs): Dosen
    {
        $dosen = $this->dosen($request);

        abort_unless($krs->mahasiswa?->pa_dosen_id === $dosen->id, 403);

        return $dosen;
    }
}
