<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KehadiranController extends Controller
{
    /**
     * Display attendance percentage per mata kuliah for the current period.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;

        return Inertia::render('mahasiswa/kehadiran', [
            'ringkasanPresensi' => $mahasiswa->ringkasanPresensi(),
        ]);
    }
}
