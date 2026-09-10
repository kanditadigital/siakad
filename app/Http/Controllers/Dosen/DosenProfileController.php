<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DosenProfileController extends Controller
{
    /**
     * Display the dosen profile.
     */
    public function show(Request $request): Response
    {
        $dosen = Dosen::with(['programStudi', 'kelas.mataKuliah', 'riwayatPendidikan'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('dosen/profil/show', [
            'dosen' => $dosen,
        ]);
    }

    /**
     * Show the form for editing the dosen profile.
     */
    public function edit(Request $request): Response
    {
        $dosen = Dosen::with(['programStudi'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return Inertia::render('dosen/profil/edit', [
            'dosen' => $dosen,
        ]);
    }

    /**
     * Update the dosen profile.
     *
     * Only personal/contact fields are self-editable. NIDN, NUPTK, program
     * studi, status kepegawaian, and pangkat/golongan are institutional
     * records — changing those stays an admin/admin-prodi action (see
     * Admin\DosenController::update) so a dosen can't, say, reassign their
     * own program studi or promote their own pangkat/golongan.
     */
    public function update(Request $request): RedirectResponse
    {
        $dosen = Dosen::where('user_id', $request->user()->id)->firstOrFail();

        // Required, matching the NOT NULL columns on `dosen` and the
        // validation admin/admin-prodi already apply when they edit these
        // same fields — a dosen clearing them here would otherwise crash
        // with a database-level constraint violation.
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'pendidikan_terakhir' => ['required', 'string', 'max:255'],
            'no_telepon' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
        ]);

        $dosen->update($validated);
        $dosen->user?->update(['name' => $validated['nama']]);

        return redirect()->route('dosen.profil.show')
            ->with('success', 'Profil berhasil diperbarui');
    }
}
