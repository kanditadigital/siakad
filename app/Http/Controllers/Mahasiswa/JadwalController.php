<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Krs;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    /**
     * Display jadwal perkuliahan (enrolled classes) for the logged-in mahasiswa.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;

        $krss = Krs::with(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester'])
            ->where('mahasiswa_id', $mahasiswa->id)
            ->where('status', 'disetujui')
            ->get();

        return Inertia::render('mahasiswa/jadwal', [
            'krss' => $krss,
            'mahasiswa' => $mahasiswa,
        ]);
    }
}
