<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KrsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Krs::with(['mahasiswa', 'kelas.mataKuliah', 'academicYearSemester']);

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->whereHas('mahasiswa', function ($mq) use ($search): void {
                    $mq->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama', 'like', "%{$search}%");
                });
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('academic_year_semester_id') && $request->academic_year_semester_id !== '') {
            $query->where('academic_year_semester_id', $request->academic_year_semester_id);
        }

        $krss = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $academicYearSemesters = AcademicYearSemester::orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();

        return Inertia::render('admin/krs/index', [
            'krss' => $krss,
            'academicYearSemesters' => $academicYearSemesters,
            'filters' => $request->only(['search', 'status', 'academic_year_semester_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $mahasiswas = Mahasiswa::with('programStudi:id,nama_prodi')
            ->orderBy('nama')
            ->get();
        $kelases = Kelas::with(['mataKuliah.programStudi:id,nama_prodi', 'dosen'])
            ->where('status', 'Aktif')
            ->orderBy('nama_kelas')
            ->get();
        $academicYearSemesters = AcademicYearSemester::orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get(['id', 'nama_prodi']);

        return Inertia::render('admin/krs/create', [
            'mahasiswas' => $mahasiswas,
            'kelases' => $kelases,
            'academicYearSemesters' => $academicYearSemesters,
            'programStudis' => $programStudis,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mahasiswa_id' => ['required', 'integer', 'exists:mahasiswa,id'],
            'kelas_id' => ['required', 'integer', 'exists:kelas,id'],
            'academic_year_semester_id' => ['required', 'integer', 'exists:academic_year_semesters,id'],
            'status' => ['required', 'string', 'in:pending,disetujui,ditolak,revisi'],
        ]);

        if ($validated['status'] === 'disetujui') {
            $kelas = Kelas::with('mataKuliah')->findOrFail($validated['kelas_id']);
            $totalSks = Krs::totalSksDisetujui($validated['mahasiswa_id'], $validated['academic_year_semester_id'])
                + ($kelas->mataKuliah->sks ?? 0);

            if ($totalSks > Krs::maxSks()) {
                return back()->withErrors([
                    'kelas_id' => "Total SKS akan menjadi {$totalSks}, melebihi batas maksimal ".Krs::maxSks().' SKS per semester.',
                ])->withInput();
            }
        }

        Krs::create($validated);

        return redirect()->route('admin.krs.index')
            ->with('success', 'KRS berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Krs $krs): Response
    {
        $krs->load(['mahasiswa.programStudi', 'kelas.mataKuliah', 'kelas.dosen', 'academicYearSemester']);

        return Inertia::render('admin/krs/show', [
            'krs' => $krs,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Krs $krs): Response
    {
        $krs->load(['mahasiswa', 'kelas', 'academicYearSemester']);
        $mahasiswas = Mahasiswa::with('programStudi:id,nama_prodi')
            ->orderBy('nama')
            ->get();
        $kelases = Kelas::with(['mataKuliah.programStudi:id,nama_prodi', 'dosen'])
            ->where('status', 'Aktif')
            ->orderBy('nama_kelas')
            ->get();
        $academicYearSemesters = AcademicYearSemester::orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get(['id', 'nama_prodi']);

        return Inertia::render('admin/krs/edit', [
            'krs' => $krs,
            'mahasiswas' => $mahasiswas,
            'kelases' => $kelases,
            'academicYearSemesters' => $academicYearSemesters,
            'programStudis' => $programStudis,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Krs $krs): RedirectResponse
    {
        $validated = $request->validate([
            'mahasiswa_id' => ['required', 'integer', 'exists:mahasiswa,id'],
            'kelas_id' => ['required', 'integer', 'exists:kelas,id'],
            'academic_year_semester_id' => ['required', 'integer', 'exists:academic_year_semesters,id'],
            'status' => ['required', 'string', 'in:pending,disetujui,ditolak,revisi'],
        ]);

        if ($validated['status'] === 'disetujui') {
            $kelas = Kelas::with('mataKuliah')->findOrFail($validated['kelas_id']);
            $totalSks = Krs::totalSksDisetujui($validated['mahasiswa_id'], $validated['academic_year_semester_id'], $krs->id)
                + ($kelas->mataKuliah->sks ?? 0);

            if ($totalSks > Krs::maxSks()) {
                return back()->withErrors([
                    'kelas_id' => "Total SKS akan menjadi {$totalSks}, melebihi batas maksimal ".Krs::maxSks().' SKS per semester.',
                ])->withInput();
            }
        }

        $krs->update($validated);

        return redirect()->route('admin.krs.index')
            ->with('success', 'KRS berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Krs $krs): RedirectResponse
    {
        $krs->delete();

        return redirect()->route('admin.krs.index')
            ->with('success', 'KRS berhasil dihapus');
    }
}
