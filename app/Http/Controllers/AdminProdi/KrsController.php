<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\AcademicYearSemester;
use App\Models\Krs;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KrsController extends Controller
{
    /**
     * Display KRS for this program studi, grouped by mahasiswa.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $entryFilter = function ($query) use ($request): void {
            if ($request->filled('status')) {
                $query->where('status', $request->input('status'));
            }
            if ($request->filled('academic_year_semester_id')) {
                $query->where('academic_year_semester_id', $request->input('academic_year_semester_id'));
            }
        };

        $mahasiswaQuery = Mahasiswa::where('program_studi_id', $programStudiId)
            ->whereHas('krs', $entryFilter);

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

        $mahasiswas->getCollection()->load(['krs' => function ($query) use ($entryFilter): void {
            $entryFilter($query);
            $query->with(['kelas.mataKuliah', 'kelas.dosen', 'academicYearSemester'])->latest();
        }]);

        return Inertia::render('admin-prodi/krs/index', [
            'mahasiswas' => $mahasiswas,
            'academicYearSemesters' => AcademicYearSemester::orderByDesc('nama_tahun_akademik')
                ->orderBy('semester')
                ->get(),
            'filters' => $request->only(['search', 'status', 'academic_year_semester_id']),
        ]);
    }

    /**
     * Display the specified KRS.
     */
    public function show(Request $request, Krs $krs): Response
    {
        $krs->load(['mahasiswa.programStudi', 'kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester']);

        abort_unless($krs->mahasiswa?->program_studi_id === $request->user()->program_studi_id, 403);

        return Inertia::render('admin-prodi/krs/show', [
            'krs' => $krs,
        ]);
    }

    /**
     * Approve a pending KRS entry, enforcing the max-SKS limit.
     */
    public function approve(Request $request, Krs $krs): RedirectResponse
    {
        abort_unless($krs->mahasiswa?->program_studi_id === $request->user()->program_studi_id, 403);
        abort_unless($krs->status === 'pending', 422, 'KRS ini sudah diproses.');

        $krs->load('kelas.mataKuliah');
        $totalSks = Krs::totalSksDisetujui($krs->mahasiswa_id, $krs->academic_year_semester_id)
            + ($krs->kelas?->mataKuliah?->sks ?? 0);

        if ($totalSks > Krs::maxSks()) {
            return back()->withErrors([
                'krs' => "Total SKS akan menjadi {$totalSks}, melebihi batas maksimal ".Krs::maxSks().' SKS per semester.',
            ]);
        }

        $krs->update(['status' => 'disetujui']);

        return back()->with('success', 'KRS berhasil disetujui');
    }

    /**
     * Reject a pending KRS entry.
     */
    public function reject(Request $request, Krs $krs): RedirectResponse
    {
        abort_unless($krs->mahasiswa?->program_studi_id === $request->user()->program_studi_id, 403);
        abort_unless($krs->status === 'pending', 422, 'KRS ini sudah diproses.');

        $krs->update(['status' => 'ditolak']);

        return back()->with('success', 'KRS berhasil ditolak');
    }
}
