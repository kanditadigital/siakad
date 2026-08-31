<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Nilai;
use App\Models\TagihanUkt;
use App\Models\Yudisium;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Display a condensed summary report (read-only) covering academic, student,
     * grading/graduation, and financial figures.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('pimpinan/laporan', [
            'laporanAkademik' => [
                'total_mahasiswa' => Mahasiswa::count(),
                'mahasiswa_aktif' => Mahasiswa::where('status', 'aktif')->count(),
                'mahasiswa_cuti' => Mahasiswa::where('status', 'cuti')->count(),
                'mahasiswa_lulus' => Mahasiswa::where('status', 'lulus')->count(),
            ],
            'laporanNilai' => [
                'total_nilai' => Nilai::count(),
                'nilai_tercatat' => Nilai::where('status', 'tercatat')->count(),
                'krs_disetujui' => Krs::where('status', 'disetujui')->count(),
                'total_yudisium' => Yudisium::count(),
            ],
            'laporanKeuangan' => [
                'total_tagihan' => TagihanUkt::sum('jumlah_tagihan'),
                'total_terbayar' => TagihanUkt::sum('jumlah_bayar'),
                'tagihan_lunas' => TagihanUkt::where('status', 'lunas')->count(),
                'tagihan_belum_lunas' => TagihanUkt::whereIn('status', ['belum', 'terlambat'])->count(),
            ],
        ]);
    }
}
