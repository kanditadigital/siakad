<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MonitoringAkademikController extends Controller
{
    /**
     * Display academic monitoring overview (read-only).
     */
    public function index(Request $request): Response
    {
        $mahasiswaPerStatus = Mahasiswa::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $krsPerStatus = Krs::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $presensiTotal = Presensi::count();
        $presensiHadir = Presensi::where('status', 'hadir')->count();

        $mahasiswaPerProdi = Mahasiswa::query()
            ->join('program_studi', 'mahasiswa.program_studi_id', '=', 'program_studi.id')
            ->selectRaw('program_studi.nama_prodi, count(mahasiswa.id) as total')
            ->groupBy('program_studi.nama_prodi')
            ->orderByDesc('total')
            ->get();

        // Only mahasiswa still progressing through their studies — cuti,
        // nonaktif, and lulus have no meaningful "current semester" and would
        // otherwise pile up in whatever semester they stopped at.
        $mahasiswaPerSemester = Mahasiswa::query()
            ->where('status', 'aktif')
            ->selectRaw('semester_saat_ini as semester, count(*) as total')
            ->groupBy('semester_saat_ini')
            ->orderBy('semester_saat_ini')
            ->get();

        return Inertia::render('pimpinan/monitoring-akademik', [
            'stats' => [
                'mahasiswa_per_status' => $mahasiswaPerStatus,
                'krs_per_status' => $krsPerStatus,
                'total_kelas' => Kelas::count(),
                'kelas_aktif' => Kelas::where('status', 'Aktif')->count(),
                'persentase_kehadiran' => $presensiTotal > 0 ? round($presensiHadir / $presensiTotal * 100, 1) : 0,
            ],
            'mahasiswaPerProdi' => $mahasiswaPerProdi,
            'mahasiswaPerSemester' => $mahasiswaPerSemester,
        ]);
    }
}
