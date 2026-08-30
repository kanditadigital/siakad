<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Krs;
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
}
