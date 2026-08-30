<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\ProgramStudi;
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
        $dosen = Dosen::with(['programStudi', 'kelas.mataKuliah', 'kelas.academicYearSemester'])
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

        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('dosen/profil/edit', [
            'dosen' => $dosen,
            'programStudis' => $programStudis,
        ]);
    }

    /**
     * Update the dosen profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $dosen = Dosen::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'no_telepon' => ['nullable', 'string', 'max:20'],
            'alamat' => ['nullable', 'string', 'max:500'],
        ]);

        $dosen->update($validated);

        return redirect()->route('dosen.profil.show')
            ->with('success', 'Profil berhasil diperbarui');
    }
}
