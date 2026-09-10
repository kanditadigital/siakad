<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Yudisium;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class YudisiumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Yudisium::with('mahasiswa.programStudi');

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

        if ($request->has('predikat') && $request->predikat !== '') {
            $query->where('predikat', $request->predikat);
        }

        $yudisiums = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/yudisium/index', [
            'yudisiums' => $yudisiums,
            'filters' => $request->only(['search', 'status', 'predikat']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $mahasiswas = Mahasiswa::with('programStudi')->orderBy('nama')->get();

        return Inertia::render('admin/yudisium/create', [
            'mahasiswas' => $mahasiswas,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'mahasiswa_id' => ['required', 'integer', 'exists:mahasiswa,id', 'unique:yudisiums,mahasiswa_id'],
            'tanggal_yudisium' => ['required', 'date'],
            'ipk' => ['required', 'numeric', 'min:0', 'max:4'],
            'total_sks' => ['required', 'integer', 'min:1'],
            'judul_skripsi' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:lulus,tidak lulus'],
            'predikat' => ['nullable', 'string', 'in:Cum Laude,Sangat Memuaskan,Memuaskan,Cukup'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        Yudisium::create($validated);

        return redirect()->route('admin.yudisium.index')
            ->with('success', 'Yudisium berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Yudisium $yudisium): Response
    {
        $yudisium->load('mahasiswa.programStudi');

        return Inertia::render('admin/yudisium/show', [
            'yudisium' => $yudisium,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Yudisium $yudisium): Response
    {
        $yudisium->load('mahasiswa');
        $mahasiswas = Mahasiswa::with('programStudi')->orderBy('nama')->get();

        return Inertia::render('admin/yudisium/edit', [
            'yudisium' => $yudisium,
            'mahasiswas' => $mahasiswas,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Yudisium $yudisium): RedirectResponse
    {
        $validated = $request->validate([
            'mahasiswa_id' => ['required', 'integer', 'exists:mahasiswa,id', 'unique:yudisiums,mahasiswa_id,'.$yudisium->id],
            'tanggal_yudisium' => ['required', 'date'],
            'ipk' => ['required', 'numeric', 'min:0', 'max:4'],
            'total_sks' => ['required', 'integer', 'min:1'],
            'judul_skripsi' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:lulus,tidak lulus'],
            'predikat' => ['nullable', 'string', 'in:Cum Laude,Sangat Memuaskan,Memuaskan,Cukup'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        $yudisium->update($validated);

        return redirect()->route('admin.yudisium.index')
            ->with('success', 'Yudisium berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Yudisium $yudisium): RedirectResponse
    {
        $yudisium->delete();

        return redirect()->route('admin.yudisium.index')
            ->with('success', 'Yudisium berhasil dihapus');
    }

    /**
     * Export berita acara yudisium (PDF), only for status "lulus".
     */
    public function exportBeritaAcara(Yudisium $yudisium)
    {
        abort_unless($yudisium->status === 'lulus', 422);

        $yudisium->load('mahasiswa.programStudi');

        $pdf = Pdf::loadView('pdf.berita-acara-yudisium', ['yudisium' => $yudisium]);

        return $pdf->download("berita-acara-yudisium-{$yudisium->mahasiswa->nim}.pdf");
    }

    /**
     * Export SK (surat keputusan) yudisium (PDF), only for status "lulus".
     */
    public function exportSk(Yudisium $yudisium)
    {
        abort_unless($yudisium->status === 'lulus', 422);

        $yudisium->load('mahasiswa.programStudi');

        $pdf = Pdf::loadView('pdf.sk-yudisium', ['yudisium' => $yudisium]);

        return $pdf->download("sk-yudisium-{$yudisium->mahasiswa->nim}.pdf");
    }
}
