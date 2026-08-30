<?php

namespace App\Http\Controllers\AdminProdi;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DosenController extends Controller
{
    /**
     * Display a listing of dosen for this program studi.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = Dosen::with('programStudi')->where('program_studi_id', $programStudiId);

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('nidn', 'like', "%{$search}%")
                    ->orWhere('nuptk', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $dosens = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin-prodi/dosen/index', [
            'dosens' => $dosens,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified dosen.
     */
    public function show(Dosen $dosen): Response
    {
        $dosen->load('programStudi', 'user');

        return Inertia::render('admin-prodi/dosen/show', [
            'dosen' => $dosen,
        ]);
    }
}
