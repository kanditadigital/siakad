<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaAsuhController extends Controller
{
    /**
     * Display mahasiswa asuh (PA) for the logged-in dosen.
     */
    public function index(Request $request): Response
    {
        $dosen = $request->user()->dosen;

        $mahasiswas = Mahasiswa::with(['programStudi', 'user'])
            ->where('pa_dosen_id', $dosen->id)
            ->orderBy('nama')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('dosen/mahasiswa-asuh/index', [
            'mahasiswas' => $mahasiswas,
        ]);
    }

    /**
     * Update PA dosen for a mahasiswa.
     */
    public function update(Request $request, Mahasiswa $mahasiswa): RedirectResponse
    {
        $dosen = $request->user()->dosen;

        $mahasiswa->update([
            'pa_dosen_id' => $dosen->id,
        ]);

        return back()->with('success', 'Mahasiswa berhasil ditambahkan sebagai mahasiswa asuh');
    }

    /**
     * Remove PA dosen from a mahasiswa.
     */
    public function destroy(Mahasiswa $mahasiswa): RedirectResponse
    {
        $mahasiswa->update([
            'pa_dosen_id' => null,
        ]);

        return back()->with('success', 'Mahasiswa berhasil dihapus dari mahasiswa asuh');
    }
}
