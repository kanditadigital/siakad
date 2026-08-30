<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin prodi dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $programStudiId = $user->program_studi_id;

        $stats = [
            'mahasiswa' => Mahasiswa::where('program_studi_id', $programStudiId)->count(),
            'dosen' => Dosen::where('program_studi_id', $programStudiId)->count(),
            'penjadwalan' => Kelas::whereHas('mataKuliah', function ($query) use ($programStudiId): void {
                $query->where('program_studi_id', $programStudiId);
            })->count(),
        ];

        return Inertia::render('admin-prodi/dashboard', [
            'stats' => $stats,
            'programStudi' => $user->programStudi,
        ]);
    }
}
