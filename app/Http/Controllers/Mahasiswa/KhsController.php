<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Nilai;
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

        $nilais = Nilai::with(['krs.kelas.mataKuliah', 'krs.academicYearSemester'])
            ->whereHas('krs', function ($q) use ($mahasiswa): void {
                $q->where('mahasiswa_id', $mahasiswa->id);
            })
            ->get();

        $totalSks = $nilais->sum('krs.kelas.mataKuliah.sks');
        $totalNilai = $nilais->filter(fn ($n) => $n->nilai !== null)
            ->sum(fn ($n) => $n->nilai * $n->krs->kelas->mataKuliah->sks);
        $ipk = $totalSks > 0 ? round($totalNilai / $totalSks, 2) : 0;

        return Inertia::render('mahasiswa/khs', [
            'nilais' => $nilais,
            'mahasiswa' => $mahasiswa,
            'stats' => [
                'total_sks' => $totalSks,
                'ipk' => $ipk,
            ],
        ]);
    }
}
