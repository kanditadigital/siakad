<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KrsController extends Controller
{
    /**
     * Display KRS mahasiswa.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;

        $krss = Krs::with(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester'])
            ->where('mahasiswa_id', $mahasiswa->id)
            ->latest()
            ->get();

        return Inertia::render('mahasiswa/krs', [
            'krss' => $krss,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    /**
     * Export KRS to PDF.
     */
    public function exportPdf(Request $request)
    {
        $mahasiswa = $request->user()->mahasiswa;

        $krss = Krs::with(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester'])
            ->where('mahasiswa_id', $mahasiswa->id)
            ->latest()
            ->get();

        $totalSks = $krss->filter(fn ($krs) => $krs->status === 'disetujui')
            ->sum(fn ($krs) => $krs->kelas->mataKuliah->sks ?? 0);

        $pdf = Pdf::loadView('pdf.krs', [
            'mahasiswa' => $mahasiswa,
            'krss' => $krss,
            'totalSks' => $totalSks,
        ]);

        return $pdf->download("krs-{$mahasiswa->nim}.pdf");
    }
}
