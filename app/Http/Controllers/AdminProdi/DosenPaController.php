<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DosenPaController extends Controller
{
    /**
     * Display all mahasiswa in this program studi with their assigned dosen PA.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = Mahasiswa::with(['programStudi', 'paDosen'])
            ->where('program_studi_id', $programStudiId);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search): void {
                $q->where('nim', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        if ($request->filled('pa_dosen_id')) {
            $query->where('pa_dosen_id', $request->input('pa_dosen_id'));
        }

        if ($request->filled('mahasiswa_id')) {
            $query->where('id', $request->input('mahasiswa_id'));
        }

        $stats = [
            'total' => (clone $query)->count(),
            'sudah_ada_pa' => (clone $query)->whereNotNull('pa_dosen_id')->count(),
            'belum_ada_pa' => (clone $query)->whereNull('pa_dosen_id')->count(),
        ];

        $mahasiswas = $query->orderBy('nama')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin-prodi/dosen-pa/index', [
            'mahasiswas' => $mahasiswas,
            'dosens' => Dosen::where('program_studi_id', $programStudiId)->orderBy('nama')->get(),
            'mahasiswaOptions' => Mahasiswa::where('program_studi_id', $programStudiId)
                ->orderBy('nama')
                ->get(['id', 'nim', 'nama']),
            'stats' => $stats,
            'filters' => $request->only(['search', 'pa_dosen_id', 'mahasiswa_id']),
        ]);
    }
}
