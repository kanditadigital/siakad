<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\RiwayatPendidikanDosen;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RiwayatPendidikanController extends Controller
{
    /**
     * Allowed jenjang values, ordered from lowest to highest.
     *
     * @var list<string>
     */
    private const JENJANG = ['SMA/SMK', 'D3', 'D4', 'S1', 'S2', 'S3'];

    /**
     * Add a riwayat pendidikan entry for the logged-in dosen.
     */
    public function store(Request $request): RedirectResponse
    {
        $dosen = $this->dosen($request);

        $validated = $this->validated($request);

        $dosen->riwayatPendidikan()->create($validated);

        return back()->with('success', 'Riwayat pendidikan berhasil ditambahkan');
    }

    /**
     * Update a riwayat pendidikan entry owned by the logged-in dosen.
     */
    public function update(Request $request, RiwayatPendidikanDosen $riwayatPendidikan): RedirectResponse
    {
        $dosen = $this->dosen($request);

        abort_unless($riwayatPendidikan->dosen_id === $dosen->id, 403);

        $riwayatPendidikan->update($this->validated($request));

        return back()->with('success', 'Riwayat pendidikan berhasil diperbarui');
    }

    /**
     * Remove a riwayat pendidikan entry owned by the logged-in dosen.
     */
    public function destroy(Request $request, RiwayatPendidikanDosen $riwayatPendidikan): RedirectResponse
    {
        $dosen = $this->dosen($request);

        abort_unless($riwayatPendidikan->dosen_id === $dosen->id, 403);

        $riwayatPendidikan->delete();

        return back()->with('success', 'Riwayat pendidikan berhasil dihapus');
    }

    /**
     * @return array{jenjang: string, nama_institusi: string, fakultas_prodi: string|null}
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'jenjang' => ['required', 'string', 'in:'.implode(',', self::JENJANG)],
            'nama_institusi' => ['required', 'string', 'max:255'],
            'fakultas_prodi' => ['nullable', 'string', 'max:255'],
        ]);
    }

    /**
     * The Dosen record behind the logged-in user.
     */
    private function dosen(Request $request): Dosen
    {
        $dosen = Dosen::where('user_id', $request->user()->id)->first();

        abort_if($dosen === null, 404);

        return $dosen;
    }
}
