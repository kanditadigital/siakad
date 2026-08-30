<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\MataKuliah;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PenjadwalanController extends Controller
{
    /**
     * Display a listing of penjadwalan for this program studi.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = Kelas::with(['mataKuliah.programStudi', 'mataKuliah.dosen', 'ruang'])
            ->whereHas('mataKuliah', function ($q) use ($programStudiId): void {
                $q->where('program_studi_id', $programStudiId);
            });

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('nama_kelas', 'like', "%{$search}%")
                    ->orWhere('kode_kelas', 'like', "%{$search}%");
            });
        }

        $kelases = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $mataKuliahs = MataKuliah::where('program_studi_id', $programStudiId)->orderBy('nama_mk')->get();

        return Inertia::render('admin-prodi/penjadwalan/index', [
            'kelases' => $kelases,
            'mataKuliahs' => $mataKuliahs,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display the specified penjadwalan.
     */
    public function show(Kelas $kelas): Response
    {
        $kelas->load(['mataKuliah.programStudi', 'mataKuliah.dosen', 'ruang']);

        return Inertia::render('admin-prodi/penjadwalan/show', [
            'kelas' => $kelas,
        ]);
    }
}
