<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\ProgressTugasAkhir;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProgressTugasAkhirController extends Controller
{
    /**
     * Add a free-form catatan to the mahasiswa's own bimbingan tugas akhir
     * timeline. Mahasiswa can only comment — advancing tahap, formal revisi,
     * and ganti judul stay a pembimbing-only action (Dosen\BimbinganTugasAkhirController).
     */
    public function store(Request $request): RedirectResponse
    {
        $mahasiswa = $this->mahasiswa($request);

        $bimbingan = $mahasiswa->bimbinganTugasAkhir;

        abort_if($bimbingan === null, 404);

        $validated = $request->validate([
            'catatan' => ['required', 'string', 'max:1000'],
        ]);

        ProgressTugasAkhir::create([
            'bimbingan_tugas_akhir_id' => $bimbingan->id,
            'tahap' => null,
            'tipe' => 'catatan',
            'catatan' => $validated['catatan'],
            'dibuat_oleh_user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Catatan berhasil ditambahkan');
    }

    /**
     * The Mahasiswa record behind the logged-in user.
     */
    private function mahasiswa(Request $request): Mahasiswa
    {
        $mahasiswa = Mahasiswa::where('user_id', $request->user()->id)->first();

        abort_if($mahasiswa === null, 404);

        return $mahasiswa;
    }
}
