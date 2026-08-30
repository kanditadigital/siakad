<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UktScheme;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UktSchemeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = UktScheme::query();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%");
        }

        if ($request->has('aktif') && $request->aktif !== '') {
            $query->where('aktif', $request->aktif === 'true');
        }

        $uktSchemes = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/ukt-scheme/index', [
            'uktSchemes' => $uktSchemes,
            'filters' => $request->only(['search', 'aktif']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/ukt-scheme/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255', 'unique:ukt_schemes,nama'],
            'jumlah' => ['required', 'numeric', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:255'],
            'aktif' => ['required', 'boolean'],
        ]);

        UktScheme::create($validated);

        return redirect()->route('admin.ukt-scheme.index')
            ->with('success', 'Skema UKT berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(UktScheme $uktScheme): Response
    {
        return Inertia::render('admin/ukt-scheme/show', [
            'uktScheme' => $uktScheme,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UktScheme $uktScheme): Response
    {
        return Inertia::render('admin/ukt-scheme/edit', [
            'uktScheme' => $uktScheme,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UktScheme $uktScheme): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255', 'unique:ukt_schemes,nama,'.$uktScheme->id],
            'jumlah' => ['required', 'numeric', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:255'],
            'aktif' => ['required', 'boolean'],
        ]);

        $uktScheme->update($validated);

        return redirect()->route('admin.ukt-scheme.index')
            ->with('success', 'Skema UKT berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UktScheme $uktScheme): RedirectResponse
    {
        $uktScheme->delete();

        return redirect()->route('admin.ukt-scheme.index')
            ->with('success', 'Skema UKT berhasil dihapus');
    }
}
