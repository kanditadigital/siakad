<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\TagihanUkt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TagihanUktController extends Controller
{
    /**
     * Display tagihan UKT mahasiswa.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;

        $tagihans = TagihanUkt::with(['uktScheme', 'academicYearSemester'])
            ->where('mahasiswa_id', $mahasiswa->id)
            ->latest()
            ->get();

        return Inertia::render('mahasiswa/tagihan-ukt', [
            'tagihans' => $tagihans,
            'mahasiswa' => $mahasiswa,
        ]);
    }
}
