<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\Nilai;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Collection;
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
        $nilais = $this->nilaisFor($mahasiswa);

        return Inertia::render('mahasiswa/khs', [
            'nilais' => $nilais,
            'mahasiswa' => $mahasiswa,
            'stats' => $this->stats($nilais),
        ]);
    }

    /**
     * Export KHS to PDF.
     */
    public function exportPdf(Request $request)
    {
        $mahasiswa = $request->user()->mahasiswa;
        $nilais = $this->nilaisFor($mahasiswa);

        $pdf = Pdf::loadView('pdf.khs', [
            'mahasiswa' => $mahasiswa,
            'nilais' => $nilais,
            'stats' => $this->stats($nilais),
        ]);

        return $pdf->download("khs-{$mahasiswa->nim}.pdf");
    }

    /**
     * @return Collection<int, Nilai>
     */
    private function nilaisFor(Mahasiswa $mahasiswa): Collection
    {
        return Nilai::with(['krs.kelas.mataKuliah', 'krs.academicYearSemester'])
            ->whereHas('krs', function ($q) use ($mahasiswa): void {
                $q->where('mahasiswa_id', $mahasiswa->id);
            })
            ->get();
    }

    /**
     * IPK is computed only from graded entries (nilai not null), so the
     * denominator (SKS) always matches the courses contributing to the
     * numerator — mixing in ungraded courses' SKS would deflate the IPK.
     *
     * @param  Collection<int, Nilai>  $nilais
     * @return array{total_sks: int, ipk: float}
     */
    private function stats(Collection $nilais): array
    {
        $totalSks = $nilais->sum('krs.kelas.mataKuliah.sks');

        $graded = $nilais->filter(fn (Nilai $n) => $n->nilai !== null);
        $gradedSks = $graded->sum(fn (Nilai $n) => $n->krs->kelas->mataKuliah->sks ?? 0);
        $totalNilai = $graded->sum(fn (Nilai $n) => $n->nilai * ($n->krs->kelas->mataKuliah->sks ?? 0));
        $ipk = $gradedSks > 0 ? round($totalNilai / $gradedSks, 2) : 0;

        return [
            'total_sks' => $totalSks,
            'ipk' => $ipk,
        ];
    }
}
