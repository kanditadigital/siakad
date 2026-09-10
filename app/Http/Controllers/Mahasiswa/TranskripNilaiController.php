<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TranskripNilaiController extends Controller
{
    /**
     * Display transkrip nilai mahasiswa.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;
        $mahasiswa->load('programStudi');

        return Inertia::render('mahasiswa/transkrip-nilai', [
            'nilais' => $mahasiswa->nilaiTerhitung(),
            'mahasiswa' => $mahasiswa,
            'stats' => $this->stats($mahasiswa),
        ]);
    }

    /**
     * Export transkrip nilai to PDF.
     */
    public function exportPdf(Request $request)
    {
        $mahasiswa = $request->user()->mahasiswa;
        $mahasiswa->load('programStudi');

        $pdf = Pdf::loadView('pdf.transkrip-nilai', [
            'mahasiswa' => $mahasiswa,
            'nilais' => $mahasiswa->nilaiTerhitung(),
            'stats' => $this->stats($mahasiswa),
        ]);

        return $pdf->download("transkrip-nilai-{$mahasiswa->nim}.pdf");
    }

    /**
     * IPK comes from Mahasiswa::hitungIpk() — the single source of truth
     * also used by the KHS and dosen PA views — so it can never drift from
     * what's shown elsewhere. total_sks here counts every course taken
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
