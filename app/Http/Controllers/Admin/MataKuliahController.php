<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MataKuliahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = MataKuliah::with('programStudi');

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('kode_mk', 'like', "%{$search}%")
                    ->orWhere('nama_mk', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('program_studi_id') && $request->program_studi_id !== '') {
            $query->where('program_studi_id', $request->program_studi_id);
        }

        if ($request->has('jenis') && $request->jenis !== '') {
            $query->where('jenis', $request->jenis);
        }

        if ($request->has('semester') && $request->semester !== '') {
            $query->where('semester', $request->semester);
        }

        $mataKuliahs = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('admin/mata-kuliah/index', [
            'mataKuliahs' => $mataKuliahs,
            'programStudis' => $programStudis,
            'filters' => $request->only(['search', 'status', 'program_studi_id', 'jenis', 'semester']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('admin/mata-kuliah/create', [
            'programStudis' => $programStudis,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_mk' => ['required', 'string', 'max:255', 'unique:mata_kuliah,kode_mk'],
            'nama_mk' => ['required', 'string', 'max:255'],
            'program_studi_id' => ['required', 'integer', 'exists:program_studi,id'],
            'jenis' => ['required', 'string', 'in:Wajib,Pilihan'],
            'sks' => ['required', 'integer', 'min:1', 'max:6'],
            'semester' => ['required', 'integer', 'min:1', 'max:8'],
            'status' => ['required', 'string', 'in:aktif,nonaktif'],
        ]);

        MataKuliah::create($validated);

        return redirect()->route('admin.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(MataKuliah $mataKuliah): Response
    {
        $mataKuliah->load('programStudi');

        return Inertia::render('admin/mata-kuliah/show', [
            'mataKuliah' => $mataKuliah,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MataKuliah $mataKuliah): Response
    {
        $mataKuliah->load('programStudi');
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('admin/mata-kuliah/edit', [
            'mataKuliah' => $mataKuliah,
            'programStudis' => $programStudis,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MataKuliah $mataKuliah): RedirectResponse
    {
        $validated = $request->validate([
            'kode_mk' => ['required', 'string', 'max:255', 'unique:mata_kuliah,kode_mk,'.$mataKuliah->id],
            'nama_mk' => ['required', 'string', 'max:255'],
            'program_studi_id' => ['required', 'integer', 'exists:program_studi,id'],
            'jenis' => ['required', 'string', 'in:Wajib,Pilihan'],
            'sks' => ['required', 'integer', 'min:1', 'max:6'],
            'semester' => ['required', 'integer', 'min:1', 'max:8'],
            'status' => ['required', 'string', 'in:aktif,nonaktif'],
        ]);

        $mataKuliah->update($validated);

        return redirect()->route('admin.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MataKuliah $mataKuliah): RedirectResponse
    {
        $mataKuliah->delete();

        return redirect()->route('admin.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil dihapus');
    }
}
