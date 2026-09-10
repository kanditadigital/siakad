<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanNilaiController extends Controller
{
    /**
     * Display the dosen's grading-component weights.
     */
    public function show(Request $request): Response
    {
        $dosen = Dosen::where('user_id', $request->user()->id)->firstOrFail();

        return Inertia::render('dosen/pengaturan-nilai', [
            'bobot' => $dosen->only([
                'bobot_tugas',
                'bobot_uts',
                'bobot_uas',
                'bobot_partisipasi',
                'bobot_kehadiran',
            ]),
        ]);
    }

    /**
     * Update the dosen's grading-component weights. Applies to every class
     * the dosen teaches — there is no per-class override.
     */
    public function update(Request $request): RedirectResponse
    {
        $dosen = Dosen::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'bobot_tugas' => ['required', 'integer', 'min:0', 'max:100'],
            'bobot_uts' => ['required', 'integer', 'min:0', 'max:100'],
            'bobot_uas' => ['required', 'integer', 'min:0', 'max:100'],
            'bobot_partisipasi' => ['required', 'integer', 'min:0', 'max:100'],
            'bobot_kehadiran' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $total = $validated['bobot_tugas']
            + $validated['bobot_uts']
            + $validated['bobot_uas']
            + $validated['bobot_partisipasi']
            + $validated['bobot_kehadiran'];

        if ($total !== 100) {
            return back()->withErrors([
                'bobot_tugas' => "Total bobot komponen nilai harus 100%, saat ini {$total}%.",
            ])->withInput();
        }

        $dosen->update($validated);

        return redirect()->route('dosen.pengaturan-nilai.show')
            ->with('success', 'Bobot penilaian berhasil diperbarui');
    }
}
