<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KhsController extends Controller
{
    /**
     * Display KHS mahasiswa.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;

        return Inertia::render('mahasiswa/khs', [
            'nilais' => $mahasiswa->nilaiTerhitung(),
            'mahasiswa' => $mahasiswa,
            'stats' => $this->stats($mahasiswa),
        ]);
    }

    /**
     * Export KHS to PDF.
     */
    public function exportPdf(Request $request)
    {
        $mahasiswa = $request->user()->mahasiswa;

        $pdf = Pdf::loadView('pdf.khs', [
            'mahasiswa' => $mahasiswa,
            'nilais' => $mahasiswa->nilaiTerhitung(),
            'stats' => $this->stats($mahasiswa),
        ]);

        return $pdf->download("khs-{$mahasiswa->nim}.pdf");
    }

    /**
     * IPK comes from Mahasiswa::hitungIpk() — the single source of truth
     * also used by the transkrip and dosen PA views — so it can never drift
     * from what's shown elsewhere. total_sks here counts every course taken
     * (graded or not), unlike the IPK's denominator.
     *
     * @return array{total_sks: int, ipk: float}
     */
    private function stats(Mahasiswa $mahasiswa): array
    {
        return [
            'total_sks' => (int) $mahasiswa->nilaiTerhitung()->sum('krs.kelas.mataKuliah.sks'),
            'ipk' => $mahasiswa->hitungIpk(),
        ];
    }
}
