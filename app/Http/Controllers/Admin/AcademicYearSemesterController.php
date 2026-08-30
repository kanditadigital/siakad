<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYearSemester;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearSemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = AcademicYearSemester::query();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('nama_tahun_akademik', 'like', "%{$search}%")
                    ->orWhere('semester', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $academicYears = $query->latest('nama_tahun_akademik')
            ->latest('semester')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/data-akademik/index', [
            'academicYears' => $academicYears,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/data-akademik/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_tahun_akademik' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'in:Ganjil,Genap,Summer'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'status' => ['required', 'in:aktif,nonaktif,arsip'],
            'periode_krs' => ['nullable', 'string', 'max:255'],
            'periode_input_nilai' => ['nullable', 'string', 'max:255'],
        ]);

        AcademicYearSemester::create($validated);

        return redirect()->route('admin.data-akademik.index')
            ->with('success', 'Tahun akademik berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(AcademicYearSemester $academicYearSemester): Response
    {
        return Inertia::render('admin/data-akademik/show', [
            'academicYear' => $academicYearSemester,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AcademicYearSemester $academicYearSemester): Response
    {
        return Inertia::render('admin/data-akademik/edit', [
            'academicYear' => $academicYearSemester,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AcademicYearSemester $academicYearSemester): RedirectResponse
    {
        $validated = $request->validate([
            'nama_tahun_akademik' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'in:Ganjil,Genap,Summer'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'status' => ['required', 'in:aktif,nonaktif,arsip'],
            'periode_krs' => ['nullable', 'string', 'max:255'],
            'periode_input_nilai' => ['nullable', 'string', 'max:255'],
        ]);

        $academicYearSemester->update($validated);

        return redirect()->route('admin.data-akademik.index')
            ->with('success', 'Tahun akademik berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicYearSemester $academicYearSemester): RedirectResponse
    {
        $academicYearSemester->delete();

        return redirect()->route('admin.data-akademik.index')
            ->with('success', 'Tahun akademik berhasil dihapus');
    }

    /**
     * Update the status of the specified resource.
     */
    public function updateStatus(Request $request, AcademicYearSemester $academicYearSemester): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:aktif,nonaktif,arsip'],
        ]);

        $academicYearSemester->update($validated);

        return redirect()->back()
            ->with('success', 'Status tahun akademik berhasil diperbarui');
    }
}
