<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\Nilai;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NilaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Nilai::with(['krs.mahasiswa', 'krs.kelas.mataKuliah', 'krs.academicYearSemester']);

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->whereHas('krs.mahasiswa', function ($q) use ($search): void {
                $q->where('nim', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('grade') && $request->grade !== '') {
            $query->where('grade', $request->grade);
        }

        $nilais = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/nilai/index', [
            'nilais' => $nilais,
            'filters' => $request->only(['search', 'status', 'grade']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $krss = Krs::with(['mahasiswa', 'kelas.mataKuliah', 'academicYearSemester'])
            ->where('status', 'disetujui')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/nilai/create', [
            'krss' => $krss,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'krs_id' => ['required', 'integer', 'exists:krs,id', 'unique:nilai,krs_id'],
            'nilai' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grade' => ['nullable', 'string', 'in:A,B,C,D,E'],
            'status' => ['required', 'string', 'in:belum,tercatat'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        Nilai::create($validated);

        return redirect()->route('admin.nilai.index')
            ->with('success', 'Nilai berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Nilai $nilai): Response
    {
        $nilai->load(['krs.mahasiswa.programStudi', 'krs.kelas.mataKuliah', 'krs.kelas.dosen', 'krs.academicYearSemester']);

        return Inertia::render('admin/nilai/show', [
            'nilai' => $nilai,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Nilai $nilai): Response
    {
        $nilai->load(['krs.mahasiswa', 'krs.kelas.mataKuliah']);
        $krss = Krs::with(['mahasiswa', 'kelas.mataKuliah', 'academicYearSemester'])
            ->where('status', 'disetujui')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/nilai/edit', [
            'nilai' => $nilai,
            'krss' => $krss,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Nilai $nilai): RedirectResponse
    {
        $validated = $request->validate([
            'krs_id' => ['required', 'integer', 'exists:krs,id', 'unique:nilai,krs_id,'.$nilai->id],
            'nilai' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'grade' => ['nullable', 'string', 'in:A,B,C,D,E'],
            'status' => ['required', 'string', 'in:belum,tercatat'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        $nilai->update($validated);

        return redirect()->route('admin.nilai.index')
            ->with('success', 'Nilai berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Nilai $nilai): RedirectResponse
    {
        $nilai->delete();

        return redirect()->route('admin.nilai.index')
            ->with('success', 'Nilai berhasil dihapus');
    }
}
