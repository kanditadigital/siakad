<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYearSemester;
use App\Models\Mahasiswa;
use App\Models\TagihanUkt;
use App\Models\UktScheme;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagihanUktController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = TagihanUkt::with(['mahasiswa.programStudi', 'academicYearSemester', 'uktScheme']);

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->whereHas('mahasiswa', function ($q) use ($search): void {
                $q->where('nim', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('academic_year_semester_id') && $request->academic_year_semester_id !== '') {
            $query->where('academic_year_semester_id', $request->academic_year_semester_id);
        }

        $tagihanUkts = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $academicYearSemesters = AcademicYearSemester::orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();

        $uktSchemes = UktScheme::where('aktif', true)->orderBy('nama')->get();

        return Inertia::render('admin/tagihan-ukt/index', [
            'tagihanUkts' => $tagihanUkts,
            'academicYearSemesters' => $academicYearSemesters,
            'uktSchemes' => $uktSchemes,
            'filters' => $request->only(['search', 'status', 'academic_year_semester_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $mahasiswas = Mahasiswa::with('programStudi')->orderBy('nama')->get();
        $academicYearSemesters = AcademicYearSemester::orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();
        $uktSchemes = UktScheme::where('aktif', true)->orderBy('nama')->get();

        return Inertia::render('admin/tagihan-ukt/create', [
            'mahasiswas' => $mahasiswas,
            'academicYearSemesters' => $academicYearSemesters,
            'uktSchemes' => $uktSchemes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mahasiswa_id' => ['required', 'integer', 'exists:mahasiswa,id'],
            'academic_year_semester_id' => ['required', 'integer', 'exists:academic_year_semesters,id'],
            'ukt_scheme_id' => ['nullable', 'integer', 'exists:ukt_schemes,id'],
            'jumlah_tagihan' => ['required', 'numeric', 'min:0'],
            'jumlah_bayar' => ['required', 'numeric', 'min:0'],
            'jatuh_tempo' => ['required', 'date'],
            'status' => ['required', 'string', 'in:belum,lunas,terlambat'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        TagihanUkt::create($validated);

        return redirect()->route('admin.tagihan-ukt.index')
            ->with('success', 'Tagihan UKT berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(TagihanUkt $tagihanUkt): Response
    {
        $tagihanUkt->load(['mahasiswa.programStudi', 'academicYearSemester', 'uktScheme']);

        return Inertia::render('admin/tagihan-ukt/show', [
            'tagihanUkt' => $tagihanUkt,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TagihanUkt $tagihanUkt): Response
    {
        $tagihanUkt->load(['mahasiswa', 'academicYearSemester', 'uktScheme']);
        $mahasiswas = Mahasiswa::with('programStudi')->orderBy('nama')->get();
        $academicYearSemesters = AcademicYearSemester::orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();
        $uktSchemes = UktScheme::where('aktif', true)->orderBy('nama')->get();

        return Inertia::render('admin/tagihan-ukt/edit', [
            'tagihanUkt' => $tagihanUkt,
            'mahasiswas' => $mahasiswas,
            'academicYearSemesters' => $academicYearSemesters,
            'uktSchemes' => $uktSchemes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TagihanUkt $tagihanUkt): RedirectResponse
    {
        $validated = $request->validate([
            'mahasiswa_id' => ['required', 'integer', 'exists:mahasiswa,id'],
            'academic_year_semester_id' => ['required', 'integer', 'exists:academic_year_semesters,id'],
            'ukt_scheme_id' => ['nullable', 'integer', 'exists:ukt_schemes,id'],
            'jumlah_tagihan' => ['required', 'numeric', 'min:0'],
            'jumlah_bayar' => ['required', 'numeric', 'min:0'],
            'jatuh_tempo' => ['required', 'date'],
            'status' => ['required', 'string', 'in:belum,lunas,terlambat'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        $tagihanUkt->update($validated);

        return redirect()->route('admin.tagihan-ukt.index')
            ->with('success', 'Tagihan UKT berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TagihanUkt $tagihanUkt): RedirectResponse
    {
        $tagihanUkt->delete();

        return redirect()->route('admin.tagihan-ukt.index')
            ->with('success', 'Tagihan UKT berhasil dihapus');
    }
}
