<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\BimbinganAkademik;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BimbinganAkademikController extends Controller
{
    /**
     * Record a standalone academic-guidance note for a mahasiswa asuh — the
     * same log KRS review notes are appended to (see
     * KrsPaController::catatBimbingan), so bimbingan is tracked in SIAKAD
     * instead of only happening over chat.
     */
    public function store(Request $request, Mahasiswa $mahasiswa): RedirectResponse
    {
        $dosen = $request->user()->dosen;

        abort_if($dosen === null, 403);
        abort_unless($mahasiswa->pa_dosen_id === $dosen->id, 403);

        $validated = $request->validate([
            'topik' => ['required', 'string', 'max:255'],
            'catatan' => ['required', 'string', 'max:1000'],
        ]);

        BimbinganAkademik::create([
            'dosen_id' => $dosen->id,
            'mahasiswa_id' => $mahasiswa->id,
            'topik' => $validated['topik'],
            'catatan' => $validated['catatan'],
        ]);

        return back()->with('success', 'Catatan bimbingan berhasil disimpan');
    }
}
