<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\AcademicYearSemester;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\MataKuliah;
use App\Models\Ruang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PenjadwalanController extends Controller
{
    /**
     * Display a listing of penjadwalan for this program studi.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = Kelas::with(['mataKuliah', 'dosen', 'ruang'])
            ->whereHas('mataKuliah', function ($q) use ($programStudiId): void {
                $q->where('program_studi_id', $programStudiId);
            });

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('nama_kelas', 'like', "%{$search}%")
                    ->orWhere('kode_kelas', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $kelases = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $mataKuliahs = MataKuliah::where('program_studi_id', $programStudiId)->orderBy('nama_mk')->get();

        return Inertia::render('admin-prodi/penjadwalan/index', [
            'kelases' => $kelases,
            'mataKuliahs' => $mataKuliahs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new kelas in this program studi.
     */
    public function create(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $activeAcademicYearSemester = AcademicYearSemester::aktif()
            ->orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->first();

        return Inertia::render('admin-prodi/penjadwalan/create', [
            'mataKuliahs' => MataKuliah::where('program_studi_id', $programStudiId)->orderBy('nama_mk')->get(),
            'dosens' => Dosen::where('program_studi_id', $programStudiId)->orderBy('nama')->get(),
            'ruangs' => Ruang::orderBy('kode_ruang')->get(),
            'academicYearSemesters' => AcademicYearSemester::orderByDesc('nama_tahun_akademik')
                ->orderBy('semester')
                ->get(),
            'activeAcademicYearSemesterId' => $activeAcademicYearSemester?->id,
        ]);
    }

    /**
     * Store a newly created kelas, scoped to this admin's program studi.
     */
    public function store(Request $request): RedirectResponse
    {
        $programStudiId = $request->user()->program_studi_id;

        $validated = $request->validate([
            'kode_kelas' => ['required', 'string', 'max:255', 'unique:kelas,kode_kelas'],
            'nama_kelas' => ['required', 'string', 'max:255'],
            'mata_kuliah_id' => [
                'required', 'integer',
                Rule::exists('mata_kuliah', 'id')->where('program_studi_id', $programStudiId),
            ],
            'dosen_id' => [
                'nullable', 'integer',
                Rule::exists('dosen', 'id')->where('program_studi_id', $programStudiId),
            ],
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

        return redirect()->route('admin-prodi.penjadwalan.index')
            ->with('success', 'Kelas berhasil ditambahkan');
    }

    /**
     * Display the specified kelas.
     */
    public function show(Request $request, Kelas $kelas): Response
    {
        $kelas->load(['mataKuliah', 'dosen', 'ruang']);

        abort_unless($kelas->mataKuliah?->program_studi_id === $request->user()->program_studi_id, 403);

        return Inertia::render('admin-prodi/penjadwalan/show', [
            'kelas' => $kelas,
        ]);
    }

    /**
     * Show the form for editing the specified kelas.
     */
    public function edit(Request $request, Kelas $kelas): Response
    {
        $kelas->load(['mataKuliah', 'dosen', 'ruang']);

        $programStudiId = $request->user()->program_studi_id;

        abort_unless($kelas->mataKuliah?->program_studi_id === $programStudiId, 403);

        return Inertia::render('admin-prodi/penjadwalan/edit', [
            'kelas' => $kelas,
            'mataKuliahs' => MataKuliah::where('program_studi_id', $programStudiId)->orderBy('nama_mk')->get(),
            'dosens' => Dosen::where('program_studi_id', $programStudiId)->orderBy('nama')->get(),
            'ruangs' => Ruang::orderBy('kode_ruang')->get(),
            'academicYearSemesters' => AcademicYearSemester::orderByDesc('nama_tahun_akademik')
                ->orderBy('semester')
                ->get(),
        ]);
    }

    /**
     * Update the specified kelas.
     */
    public function update(Request $request, Kelas $kelas): RedirectResponse
    {
        $programStudiId = $request->user()->program_studi_id;

        abort_unless($kelas->mataKuliah?->program_studi_id === $programStudiId, 403);

        $validated = $request->validate([
            'kode_kelas' => ['required', 'string', 'max:255', 'unique:kelas,kode_kelas,'.$kelas->id],
            'nama_kelas' => ['required', 'string', 'max:255'],
            'mata_kuliah_id' => [
                'required', 'integer',
                Rule::exists('mata_kuliah', 'id')->where('program_studi_id', $programStudiId),
            ],
            'dosen_id' => [
                'nullable', 'integer',
                Rule::exists('dosen', 'id')->where('program_studi_id', $programStudiId),
            ],
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

        return redirect()->route('admin-prodi.penjadwalan.index')
            ->with('success', 'Kelas berhasil diperbarui');
    }

    /**
     * Remove the specified kelas.
     */
    public function destroy(Request $request, Kelas $kelas): RedirectResponse
    {
        abort_unless($kelas->mataKuliah?->program_studi_id === $request->user()->program_studi_id, 403);

        $kelas->delete();

        return redirect()->route('admin-prodi.penjadwalan.index')
            ->with('success', 'Kelas berhasil dihapus');
    }
}
