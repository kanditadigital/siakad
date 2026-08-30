<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ruang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RuangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Ruang::query();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('kode_ruang', 'like', "%{$search}%")
                    ->orWhere('nama_ruang', 'like', "%{$search}%")
                    ->orWhere('gedung', 'like', "%{$search}%");
            });
        }

        if ($request->has('gedung') && $request->gedung !== '') {
            $query->where('gedung', $request->gedung);
        }

        if ($request->has('lantai') && $request->lantai !== '') {
            $query->where('lantai', $request->lantai);
        }

        $ruangs = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/ruang/index', [
            'ruangs' => $ruangs,
            'filters' => $request->only(['search', 'gedung', 'lantai']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/ruang/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode_ruang' => ['required', 'string', 'max:255', 'unique:ruang,kode_ruang'],
            'nama_ruang' => ['required', 'string', 'max:255'],
            'kapasitas' => ['required', 'integer', 'min:1', 'max:500'],
            'lantai' => ['required', 'string', 'max:255'],
            'gedung' => ['required', 'string', 'max:255'],
        ]);

        Ruang::create($validated);

        return redirect()->route('admin.ruang.index')
            ->with('success', 'Ruang berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ruang $ruang): Response
    {
        return Inertia::render('admin/ruang/show', [
            'ruang' => $ruang,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ruang $ruang): Response
    {
        return Inertia::render('admin/ruang/edit', [
            'ruang' => $ruang,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ruang $ruang): RedirectResponse
    {
        $validated = $request->validate([
            'kode_ruang' => ['required', 'string', 'max:255', 'unique:ruang,kode_ruang,'.$ruang->id],
            'nama_ruang' => ['required', 'string', 'max:255'],
            'kapasitas' => ['required', 'integer', 'min:1', 'max:500'],
            'lantai' => ['required', 'string', 'max:255'],
            'gedung' => ['required', 'string', 'max:255'],
        ]);

        $ruang->update($validated);

        return redirect()->route('admin.ruang.index')
            ->with('success', 'Ruang berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ruang $ruang): RedirectResponse
    {
        $ruang->delete();

        return redirect()->route('admin.ruang.index')
            ->with('success', 'Ruang berhasil dihapus');
    }
}
