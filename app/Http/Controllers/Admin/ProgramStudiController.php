<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgramStudi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramStudiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = ProgramStudi::query();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('kode_prodi', 'like', "%{$search}%")
                    ->orWhere('nama_prodi', 'like', "%{$search}%")
                    ->orWhere('fakultas', 'like', "%{$search}%")
                    ->orWhere('jenis_prodi', 'like', "%{$search}%");
            });
        }

        if ($request->has('fakultas') && $request->fakultas !== '') {
            $query->where('fakultas', $request->fakultas);
        }

        $programStudis = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $fakultas = ProgramStudi::distinct()->pluck('fakultas')->filter();

        return Inertia::render('admin/program-studi/index', [
            'programStudis' => $programStudis,
            'fakultas' => $fakultas,
            'filters' => $request->only(['search', 'fakultas']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/program-studi/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_prodi' => ['required', 'string', 'max:255', 'unique:program_studi,kode_prodi'],
            'nama_prodi' => ['required', 'string', 'max:255'],
            'fakultas' => ['required', 'string', 'max:255'],
            'lama_studi' => ['required', 'integer', 'min:1', 'max:10'],
            'jenis_prodi' => ['required', 'string', 'max:255'],
            'nim_prefix' => ['required', 'string', 'max:10', 'unique:program_studi,nim_prefix'],
            'nim_digit_count' => ['required', 'integer', 'min:2', 'max:6'],
            'nim_year_digits' => ['required', 'integer', 'in:2,3'],
        ]);

        ProgramStudi::create($validated);

        return redirect()->route('admin.program-studi.index')
            ->with('success', 'Program studi berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProgramStudi $programStudi): Response
    {
        return Inertia::render('admin/program-studi/show', [
            'programStudi' => $programStudi,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProgramStudi $programStudi): Response
    {
        return Inertia::render('admin/program-studi/edit', [
            'programStudi' => $programStudi,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProgramStudi $programStudi): RedirectResponse
    {
        $validated = $request->validate([
            'kode_prodi' => ['required', 'string', 'max:255', 'unique:program_studi,kode_prodi,'.$programStudi->id],
            'nama_prodi' => ['required', 'string', 'max:255'],
            'fakultas' => ['required', 'string', 'max:255'],
            'lama_studi' => ['required', 'integer', 'min:1', 'max:10'],
            'jenis_prodi' => ['required', 'string', 'max:255'],
            'nim_prefix' => ['required', 'string', 'max:10', 'unique:program_studi,nim_prefix,'.$programStudi->id],
            'nim_digit_count' => ['required', 'integer', 'min:2', 'max:6'],
            'nim_year_digits' => ['required', 'integer', 'in:2,3'],
        ]);

        $programStudi->update($validated);

        return redirect()->route('admin.program-studi.index')
            ->with('success', 'Program studi berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProgramStudi $programStudi): RedirectResponse
    {
        $programStudi->delete();

        return redirect()->route('admin.program-studi.index')
            ->with('success', 'Program studi berhasil dihapus');
    }
}
