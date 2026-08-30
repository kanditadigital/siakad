<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaController extends Controller
{
    /**
     * Display a listing of mahasiswa for this program studi.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = Mahasiswa::with('programStudi')->where('program_studi_id', $programStudiId);

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('nim', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $mahasiswas = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin-prodi/mahasiswa/index', [
            'mahasiswas' => $mahasiswas,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified mahasiswa.
     */
    public function show(Mahasiswa $mahasiswa): Response
    {
        $mahasiswa->load('programStudi', 'user');

        return Inertia::render('admin-prodi/mahasiswa/show', [
            'mahasiswa' => $mahasiswa,
        ]);
    }
}
