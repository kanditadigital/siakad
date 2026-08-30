<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfilController extends Controller
{
    /**
     * Display profil mahasiswa.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa()->with('programStudi')->first();

        return Inertia::render('mahasiswa/profil', [
            'mahasiswa' => $mahasiswa,
        ]);
    }
}
