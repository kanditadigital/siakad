<?php

namespace App\Http\Controllers\Dosen;

use App\Http\Controllers\Controller;
use App\Models\BimbinganAkademik;
use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
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

        $maxSemester = ProgramStudi::whereKey($dosen->program_studi_id)->value('lama_studi') * 2;

        $mahasiswas = Mahasiswa::with(['programStudi', 'user'])
            ->where('pa_dosen_id', $dosen->id)
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = $request->input('search');
                $query->where(function ($q) use ($search): void {
                    $q->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('semester'), function ($query) use ($request, $maxSemester): void {
                $semester = $request->input('semester');

                if ($semester === 'over') {
                    $query->where('semester_saat_ini', '>', $maxSemester);
                } else {
                    $query->where('semester_saat_ini', (int) $semester);
                }
            })
            ->orderBy('nama')
            ->paginate(20)
            ->withQueryString();

        // A PA supervises a handful of mahasiswa (5 per siakad.json's spec),
        // so a few extra queries per row here stays cheap — no need for a
        // single aggregate query.
        $mahasiswas->getCollection()->each(function (Mahasiswa $mahasiswa): void {
            $mahasiswa->setAttribute('angkatan', $mahasiswa->angkatan());
            $mahasiswa->setAttribute('ipk', $mahasiswa->hitungIpk());
            $mahasiswa->setAttribute('total_sks_lulus', $mahasiswa->totalSksLulus());
        });

        return Inertia::render('dosen/mahasiswa-asuh/index', [
            'mahasiswas' => $mahasiswas,
            'maxSemester' => $maxSemester,
            'filters' => $request->only(['search', 'status', 'semester']),
        ]);
    }

    /**
     * Display the full academic picture of one mahasiswa asuh — everything a
     * PA needs to decide on guidance, but strictly read-only: nothing here
     * writes to nilai, tagihan, jadwal, or yudisium.
     */
    public function show(Request $request, Mahasiswa $mahasiswa): Response
    {
        $dosen = $request->user()->dosen;

        abort_if($dosen === null, 403);
        abort_unless($mahasiswa->pa_dosen_id === $dosen->id, 403);

        $mahasiswa->load('programStudi', 'user');

        return Inertia::render('dosen/mahasiswa-asuh/show', [
            'mahasiswa' => [
                ...$mahasiswa->toArray(),
                'angkatan' => $mahasiswa->angkatan(),
                'ipk' => $mahasiswa->hitungIpk(),
                'total_sks_lulus' => $mahasiswa->totalSksLulus(),
            ],
            'perkembanganAkademik' => $mahasiswa->perkembanganAkademik(),
            'mataKuliahBermasalah' => $mahasiswa->mataKuliahBermasalah(),
            'ringkasanPresensi' => $mahasiswa->ringkasanPresensi(),
            'riwayatBimbingan' => BimbinganAkademik::where('mahasiswa_id', $mahasiswa->id)
                ->with('dosen')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Claim a mahasiswa as mahasiswa asuh of the logged-in dosen.
     *
     * Only unassigned mahasiswa within the dosen's own program studi may be
     * claimed — reassigning someone else's mahasiswa is an admin prodi action.
     */
    public function update(Request $request, Mahasiswa $mahasiswa): RedirectResponse
    {
        $dosen = $request->user()->dosen;

        abort_if($dosen === null, 403);
        abort_unless($mahasiswa->program_studi_id === $dosen->program_studi_id, 403);
        abort_unless(
            $mahasiswa->pa_dosen_id === null || $mahasiswa->pa_dosen_id === $dosen->id,
            403,
        );

        $mahasiswa->update([
            'pa_dosen_id' => $dosen->id,
        ]);

        return back()->with('success', 'Mahasiswa berhasil ditambahkan sebagai mahasiswa asuh');
    }

    /**
     * Release a mahasiswa asuh of the logged-in dosen.
     */
    public function destroy(Request $request, Mahasiswa $mahasiswa): RedirectResponse
    {
        $dosen = $request->user()->dosen;

        abort_if($dosen === null, 403);
        abort_unless($mahasiswa->pa_dosen_id === $dosen->id, 403);

        $mahasiswa->update([
            'pa_dosen_id' => null,
        ]);

        return back()->with('success', 'Mahasiswa berhasil dihapus dari mahasiswa asuh');
    }
}
