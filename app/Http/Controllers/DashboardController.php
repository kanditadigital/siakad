<?php

namespace App\Http\Controllers;

use App\Models\Krs;
use App\Models\Nilai;
use App\Models\TagihanUkt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user->role?->value;

        $data = [];

        if ($role === 'mahasiswa') {
            $mahasiswa = $user->mahasiswa;

            if ($mahasiswa) {
                $data['mahasiswa'] = $mahasiswa;
                $data['stats'] = [
                    'krs_count' => Krs::where('mahasiswa_id', $mahasiswa->id)->count(),
                    'krs_active' => Krs::where('mahasiswa_id', $mahasiswa->id)
                        ->where('status', 'approved')
                        ->count(),
                    'tagihan_count' => TagihanUkt::where('mahasiswa_id', $mahasiswa->id)
                        ->where('status', 'belum_lunas')
                        ->count(),
                    'nilai_count' => Nilai::whereHas('krs', function ($q) use ($mahasiswa): void {
                        $q->where('mahasiswa_id', $mahasiswa->id);
                    })->count(),
                ];

                $data['recent_krs'] = Krs::with(['kelas.mataKuliah', 'kelas.dosen'])
                    ->where('mahasiswa_id', $mahasiswa->id)
                    ->latest()
                    ->take(5)
                    ->get();

                $data['recent_nilai'] = Nilai::with(['krs.kelas.mataKuliah'])
                    ->whereHas('krs', function ($q) use ($mahasiswa): void {
                        $q->where('mahasiswa_id', $mahasiswa->id);
                    })
                    ->latest()
                    ->take(5)
                    ->get();
            }
        }

        return Inertia::render("dashboard/{$role}", $data);
    }
}
