<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\BimbinganTugasAkhir;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BimbinganTugasAkhirController extends Controller
{
    /**
     * Display mahasiswa bimbingan tugas akhir for the logged-in dosen (as pembimbing 1 or 2).
     */
    public function index(Request $request): Response
    {
        $dosen = $request->user()->dosen;

        $bimbingans = BimbinganTugasAkhir::with(['mahasiswa.programStudi', 'pembimbing1', 'pembimbing2'])
            ->where('pembimbing_1_id', $dosen->id)
            ->orWhere('pembimbing_2_id', $dosen->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $mahasiswas = Mahasiswa::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('dosen/bimbingan-tugas-akhir/index', [
            'bimbingans' => $bimbingans,
            'mahasiswas' => $mahasiswas,
        ]);
    }

    /**
     * Store a new bimbingan, with the logged-in dosen as pembimbing 1.
     */
    public function store(Request $request): RedirectResponse
    {
        $dosen = $request->user()->dosen;

        $validated = $request->validate([
            'mahasiswa_id' => ['required', 'integer', 'exists:mahasiswa,id'],
            'judul' => ['required', 'string', 'max:255'],
            'pembimbing_2_id' => ['nullable', 'integer', 'exists:dosen,id', 'different:pembimbing_1_id'],
        ]);

        BimbinganTugasAkhir::create([
            'mahasiswa_id' => $validated['mahasiswa_id'],
            'judul' => $validated['judul'],
            'pembimbing_1_id' => $dosen->id,
            'pembimbing_2_id' => $validated['pembimbing_2_id'] ?? null,
        ]);

        return back()->with('success', 'Bimbingan tugas akhir berhasil ditambahkan');
    }

    /**
     * Update the status/catatan of a bimbingan owned by the logged-in dosen.
     */
    public function update(Request $request, BimbinganTugasAkhir $bimbinganTugasAkhir): RedirectResponse
    {
        $dosen = $request->user()->dosen;

        abort_unless(
            $bimbinganTugasAkhir->pembimbing_1_id === $dosen->id || $bimbinganTugasAkhir->pembimbing_2_id === $dosen->id,
            403
        );

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:aktif,revisi,lainnya'],
            'catatan' => ['nullable', 'string', 'max:1000'],
        ]);

        $bimbinganTugasAkhir->update($validated);

        return back()->with('success', 'Bimbingan tugas akhir berhasil diperbarui');
    }
}
