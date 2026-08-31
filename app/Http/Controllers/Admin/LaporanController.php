<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Nilai;
use App\Models\TagihanUkt;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    /**
     * Display laporan page.
     */
    public function index(Request $request): Response
    {
        $stats = [
            'total_mahasiswa' => Mahasiswa::count(),
            'mahasiswa_aktif' => Mahasiswa::where('status', 'aktif')->count(),
            'mahasiswa_lulus' => Mahasiswa::where('status', 'lulus')->count(),
            'mahasiswa_cuti' => Mahasiswa::where('status', 'cuti')->count(),
            'total_krs' => Krs::count(),
            'krs_approved' => Krs::where('status', 'disetujui')->count(),
            'total_nilai' => Nilai::count(),
            'tagihan_lunas' => TagihanUkt::where('status', 'lunas')->count(),
            'tagihan_belum_lunas' => TagihanUkt::whereIn('status', ['belum', 'terlambat'])->count(),
        ];

        return Inertia::render('admin/laporan/index', [
            'stats' => $stats,
        ]);
    }

    /**
     * Export laporan mahasiswa.
     */
    public function exportMahasiswa(Request $request)
    {
        $mahasiswas = Mahasiswa::with(['programStudi'])->get();

        $pdf = Pdf::loadView('pdf.laporan-mahasiswa', [
            'mahasiswas' => $mahasiswas,
        ]);

        return $pdf->download('laporan-mahasiswa.pdf');
    }

    /**
     * Export laporan nilai.
     */
    public function exportNilai(Request $request)
    {
        $nilais = Nilai::with(['krs.mahasiswa', 'krs.kelas.mataKuliah'])
            ->get();

        $pdf = Pdf::loadView('pdf.laporan-nilai', [
            'nilais' => $nilais,
        ]);

        return $pdf->download('laporan-nilai.pdf');
    }

    /**
     * Export laporan keuangan.
     */
    public function exportKeuangan(Request $request)
    {
        $tagihans = TagihanUkt::with(['mahasiswa', 'academicYearSemester', 'uktScheme'])
            ->get();

        $stats = [
            'total_tagihan' => $tagihans->sum('jumlah_tagihan'),
            'total_lunas' => $tagihans->where('status', 'lunas')->sum('jumlah_tagihan'),
            'total_belum_lunas' => $tagihans->whereIn('status', ['belum', 'terlambat'])->sum('jumlah_tagihan'),
        ];

        $pdf = Pdf::loadView('pdf.laporan-keuangan', [
            'tagihans' => $tagihans,
            'stats' => $stats,
        ]);

        return $pdf->download('laporan-keuangan.pdf');
    }
}
