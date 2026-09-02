<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\MataKuliah;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MataKuliahController extends Controller
{
    /**
     * Display a listing of mata kuliah for this program studi.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = MataKuliah::where('program_studi_id', $programStudiId);

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

        if ($request->has('jenis') && $request->jenis !== '') {
            $query->where('jenis', $request->jenis);
        }

        if ($request->has('semester') && $request->semester !== '') {
            $query->where('semester', $request->semester);
        }

        $mataKuliahs = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin-prodi/mata-kuliah/index', [
            'mataKuliahs' => $mataKuliahs,
            'filters' => $request->only(['search', 'status', 'jenis', 'semester']),
        ]);
    }

    /**
     * Show the form for creating a new mata kuliah in this program studi.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('admin-prodi/mata-kuliah/create', [
            'programStudi' => $request->user()->programStudi,
            'mataKuliahs' => MataKuliah::aktif()
                ->where('program_studi_id', $request->user()->program_studi_id)
                ->orderBy('nama_mk')
                ->get(['id', 'kode_mk', 'nama_mk']),
        ]);
    }

    /**
     * Store a newly created mata kuliah, scoped to this admin's program studi.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_mk' => ['required', 'string', 'max:255', 'unique:mata_kuliah,kode_mk'],
            'nama_mk' => ['required', 'string', 'max:255'],
            'jenis' => ['required', 'string', 'in:Wajib,Pilihan'],
            'sks' => ['required', 'integer', 'min:1', 'max:6'],
            'semester' => ['required', 'integer', 'min:1', 'max:8'],
            'prasyarat_mata_kuliah_id' => [
                'nullable', 'integer',
                Rule::exists('mata_kuliah', 'id')->where('program_studi_id', $request->user()->program_studi_id),
            ],
            'status' => ['required', 'string', 'in:aktif,nonaktif'],
        ]);

        $validated['program_studi_id'] = $request->user()->program_studi_id;

        MataKuliah::create($validated);

        return redirect()->route('admin-prodi.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil ditambahkan');
    }

    /**
     * Display the specified mata kuliah.
     */
    public function show(Request $request, MataKuliah $mataKuliah): Response
    {
        abort_unless($mataKuliah->program_studi_id === $request->user()->program_studi_id, 403);

        $mataKuliah->load('programStudi');

        return Inertia::render('admin-prodi/mata-kuliah/show', [
            'mataKuliah' => $mataKuliah,
        ]);
    }

    /**
     * Show the form for editing the specified mata kuliah.
     */
    public function edit(Request $request, MataKuliah $mataKuliah): Response
    {
        abort_unless($mataKuliah->program_studi_id === $request->user()->program_studi_id, 403);

        $mataKuliah->load('programStudi');

        return Inertia::render('admin-prodi/mata-kuliah/edit', [
            'mataKuliah' => $mataKuliah,
            'mataKuliahs' => MataKuliah::aktif()
                ->where('program_studi_id', $mataKuliah->program_studi_id)
                ->whereKeyNot($mataKuliah->id)
                ->orderBy('nama_mk')
                ->get(['id', 'kode_mk', 'nama_mk']),
        ]);
    }

    /**
     * Update the specified mata kuliah.
     */
    public function update(Request $request, MataKuliah $mataKuliah): RedirectResponse
    {
        abort_unless($mataKuliah->program_studi_id === $request->user()->program_studi_id, 403);

        $validated = $request->validate([
            'kode_mk' => ['required', 'string', 'max:255', Rule::unique('mata_kuliah', 'kode_mk')->ignore($mataKuliah->id)],
            'nama_mk' => ['required', 'string', 'max:255'],
            'jenis' => ['required', 'string', 'in:Wajib,Pilihan'],
            'sks' => ['required', 'integer', 'min:1', 'max:6'],
            'semester' => ['required', 'integer', 'min:1', 'max:8'],
            'prasyarat_mata_kuliah_id' => [
                'nullable', 'integer',
                Rule::exists('mata_kuliah', 'id')->where('program_studi_id', $mataKuliah->program_studi_id),
                Rule::notIn([$mataKuliah->id]),
            ],
            'status' => ['required', 'string', 'in:aktif,nonaktif'],
        ]);

        $mataKuliah->update($validated);

        return redirect()->route('admin-prodi.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil diperbarui');
    }

    /**
     * Remove the specified mata kuliah.
     */
    public function destroy(Request $request, MataKuliah $mataKuliah): RedirectResponse
    {
        abort_unless($mataKuliah->program_studi_id === $request->user()->program_studi_id, 403);

        $mataKuliah->delete();

        return redirect()->route('admin-prodi.mata-kuliah.index')
            ->with('success', 'Mata kuliah berhasil dihapus');
    }
}
