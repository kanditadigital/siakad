<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PencarianController extends Controller
{
    /**
     * Results per entity. Enough to recognise the record you meant without
     * turning the page into a second index screen — each block links to the
     * module's own list for the full result set.
     */
    private const BATAS = 5;

    /**
     * Global search behind the header search box, across the records staff look
     * up by name/number all day: mahasiswa, dosen, and mata kuliah.
     *
     * An admin prodi only ever sees their own program studi, matching the scope
     * enforced by every other admin-prodi screen.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $q = trim((string) ($validated['q'] ?? ''));
        $user = $request->user();
        $prodiId = $user->role?->value === 'admin_prodi' ? $user->program_studi_id : null;
        $prefix = $prodiId !== null ? '/admin-prodi' : '/admin';

        if ($q === '') {
            return Inertia::render('pencarian', [
                'q' => '',
                'hasil' => ['mahasiswa' => [], 'dosen' => [], 'mataKuliah' => []],
                'total' => 0,
            ]);
        }

        $suka = '%'.$q.'%';

        $mahasiswa = Mahasiswa::with('programStudi')
            ->when($prodiId, fn ($query) => $query->where('program_studi_id', $prodiId))
            ->where(fn ($query) => $query->where('nama', 'like', $suka)->orWhere('nim', 'like', $suka))
            ->orderBy('nama')
            ->take(self::BATAS)
            ->get()
            ->map(fn (Mahasiswa $m): array => [
                'judul' => $m->nama,
                'keterangan' => $m->nim.' · '.($m->programStudi?->nama_prodi ?? 'Tanpa prodi'),
                'href' => "{$prefix}/mahasiswa/{$m->uuid}",
            ])
            ->all();

        $dosen = Dosen::with('programStudi')
            ->when($prodiId, fn ($query) => $query->where('program_studi_id', $prodiId))
            ->where(fn ($query) => $query->where('nama', 'like', $suka)->orWhere('nidn', 'like', $suka))
            ->orderBy('nama')
            ->take(self::BATAS)
            ->get()
            ->map(fn (Dosen $d): array => [
                'judul' => $d->nama,
                'keterangan' => ($d->nidn ?? 'Tanpa NIDN').' · '.($d->programStudi?->nama_prodi ?? 'Tanpa prodi'),
                'href' => "{$prefix}/dosen/{$d->uuid}",
            ])
            ->all();

        $mataKuliah = MataKuliah::with('programStudi')
            ->when($prodiId, fn ($query) => $query->where('program_studi_id', $prodiId))
            ->where(fn ($query) => $query->where('nama_mk', 'like', $suka)->orWhere('kode_mk', 'like', $suka))
            ->orderBy('nama_mk')
            ->take(self::BATAS)
            ->get()
            ->map(fn (MataKuliah $mk): array => [
                'judul' => $mk->nama_mk,
                'keterangan' => $mk->kode_mk.' · '.$mk->sks.' SKS · Semester '.$mk->semester,
                'href' => "{$prefix}/mata-kuliah/{$mk->uuid}",
            ])
            ->all();

        return Inertia::render('pencarian', [
            'q' => $q,
            'hasil' => [
                'mahasiswa' => $mahasiswa,
                'dosen' => $dosen,
                'mataKuliah' => $mataKuliah,
            ],
            'total' => count($mahasiswa) + count($dosen) + count($mataKuliah),
        ]);
    }
}
