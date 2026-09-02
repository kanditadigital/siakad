<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYearSemester;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\MataKuliah;
use App\Models\Ruang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PenjadwalanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Kelas::with(['mataKuliah', 'dosen', 'ruang']);

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('kode_kelas', 'like', "%{$search}%")
                    ->orWhere('nama_kelas', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('semester') && $request->semester !== '') {
            $query->where('semester', $request->semester);
        }

        if ($request->has('mata_kuliah_id') && $request->mata_kuliah_id !== '') {
            $query->where('mata_kuliah_id', $request->mata_kuliah_id);
        }

        if ($request->has('dosen_id') && $request->dosen_id !== '') {
            $query->where('dosen_id', $request->dosen_id);
        }

        $kelases = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $mataKuliahs = MataKuliah::orderBy('nama_mk')->get();
        $dosens = Dosen::orderBy('nama')->get();
        $ruangs = Ruang::orderBy('kode_ruang')->get();

        return Inertia::render('admin/penjadwalan/index', [
            'kelases' => $kelases,
            'mataKuliahs' => $mataKuliahs,
            'dosens' => $dosens,
            'ruangs' => $ruangs,
            'filters' => $request->only(['search', 'status', 'semester', 'mata_kuliah_id', 'dosen_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $mataKuliahs = MataKuliah::orderBy('nama_mk')->get();
        $dosens = Dosen::orderBy('nama')->get();
        $ruangs = Ruang::orderBy('kode_ruang')->get();
        $academicYearSemesters = AcademicYearSemester::orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();

        return Inertia::render('admin/penjadwalan/create', [
            'mataKuliahs' => $mataKuliahs,
            'dosens' => $dosens,
            'ruangs' => $ruangs,
            'academicYearSemesters' => $academicYearSemesters,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kelas' => ['required', 'string', 'max:255', 'unique:kelas,kode_kelas'],
            'nama_kelas' => ['required', 'string', 'max:255'],
            'mata_kuliah_id' => ['required', 'integer', 'exists:mata_kuliah,id'],
            'dosen_id' => ['nullable', 'integer', 'exists:dosen,id'],
            'ruang_id' => ['nullable', 'integer', 'exists:ruang,id'],
            'hari' => ['nullable', 'string', 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu'],
            'jam_mulai' => ['nullable', 'date_format:H:i'],
            'jam_selesai' => ['nullable', 'date_format:H:i', 'after:jam_mulai'],
            'kapasitas' => ['required', 'integer', 'min:1', 'max:200'],
            'semester' => ['required', 'string', 'in:1,2,3,4,5,6,7,8'],
            'academic_year_semester_id' => ['required', 'integer', 'exists:academic_year_semesters,id'],
            'status' => ['required', 'string', 'in:Aktif,Tidak Aktif,Selesai'],
        ]);

        $academicYearSemester = AcademicYearSemester::findOrFail($validated['academic_year_semester_id']);
        $validated['tahun_akademik'] = $academicYearSemester->nama_tahun_akademik;
        unset($validated['academic_year_semester_id']);

        Kelas::create($validated);

        return redirect()->route('admin.penjadwalan.index')
            ->with('success', 'Kelas berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Kelas $kelas): Response
    {
        $kelas->load(['mataKuliah', 'dosen', 'ruang']);

        return Inertia::render('admin/penjadwalan/show', [
            'kelas' => $kelas,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kelas $kelas): Response
    {
        $kelas->load(['mataKuliah', 'dosen', 'ruang']);
        $mataKuliahs = MataKuliah::orderBy('nama_mk')->get();
        $dosens = Dosen::orderBy('nama')->get();
        $ruangs = Ruang::orderBy('kode_ruang')->get();
        $academicYearSemesters = AcademicYearSemester::orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();

        return Inertia::render('admin/penjadwalan/edit', [
            'kelas' => $kelas,
            'mataKuliahs' => $mataKuliahs,
            'dosens' => $dosens,
            'ruangs' => $ruangs,
            'academicYearSemesters' => $academicYearSemesters,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kelas $kelas): RedirectResponse
    {
        $validated = $request->validate([
            'kode_kelas' => ['required', 'string', 'max:255', 'unique:kelas,kode_kelas,'.$kelas->id],
            'nama_kelas' => ['required', 'string', 'max:255'],
            'mata_kuliah_id' => ['required', 'integer', 'exists:mata_kuliah,id'],
            'dosen_id' => ['nullable', 'integer', 'exists:dosen,id'],
            'ruang_id' => ['nullable', 'integer', 'exists:ruang,id'],
            'hari' => ['nullable', 'string', 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu'],
            'jam_mulai' => ['nullable', 'date_format:H:i'],
            'jam_selesai' => ['nullable', 'date_format:H:i', 'after:jam_mulai'],
            'kapasitas' => ['required', 'integer', 'min:1', 'max:200'],
            'semester' => ['required', 'string', 'in:1,2,3,4,5,6,7,8'],
            'academic_year_semester_id' => ['required', 'integer', 'exists:academic_year_semesters,id'],
            'status' => ['required', 'string', 'in:Aktif,Tidak Aktif,Selesai'],
        ]);

        $academicYearSemester = AcademicYearSemester::findOrFail($validated['academic_year_semester_id']);
        $validated['tahun_akademik'] = $academicYearSemester->nama_tahun_akademik;
        unset($validated['academic_year_semester_id']);

        $kelas->update($validated);

        return redirect()->route('admin.penjadwalan.index')
            ->with('success', 'Kelas berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kelas $kelas): RedirectResponse
    {
        $kelas->delete();

        return redirect()->route('admin.penjadwalan.index')
            ->with('success', 'Kelas berhasil dihapus');
    }
}
