<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KrsController extends Controller
{
    /**
     * Display a listing of KRS for this program studi.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = Krs::with(['mahasiswa.programStudi', 'kelas.mataKuliah'])
            ->whereHas('mahasiswa', function ($q) use ($programStudiId): void {
                $q->where('program_studi_id', $programStudiId);
            });

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->whereHas('mahasiswa', function ($mq) use ($search): void {
                    $mq->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama', 'like', "%{$search}%");
                });
            });
        }

        $krss = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin-prodi/krs/index', [
            'krss' => $krss,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display the specified KRS.
     */
    public function show(Krs $krs): Response
    {
        $krs->load(['mahasiswa.programStudi', 'kelas.mataKuliah', 'kelas.ruang']);

        return Inertia::render('admin-prodi/krs/show', [
            'krs' => $krs,
        ]);
    }
}
