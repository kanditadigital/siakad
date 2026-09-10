<?php

namespace App\Http\Controllers\AdminProdi;

use App\Concerns\AuthorizesProgramStudi;
use App\Http\Controllers\Controller;
use App\Models\Nilai;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NilaiController extends Controller
{
    use AuthorizesProgramStudi;

    /**
     * Display a listing of nilai for this program studi.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = Nilai::with(['krs.mahasiswa.programStudi', 'krs.kelas.mataKuliah'])
            ->whereHas('krs.mahasiswa', function ($q) use ($programStudiId): void {
                $q->where('program_studi_id', $programStudiId);
            });

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->whereHas('krs.mahasiswa', function ($mq) use ($search): void {
                    $mq->where('nim', 'like', "%{$search}%")
                        ->orWhere('nama', 'like', "%{$search}%");
                });
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        $nilais = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin-prodi/nilai/index', [
            'nilais' => $nilais,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified nilai.
     */
    public function show(Request $request, Nilai $nilai): Response
    {
        $nilai->load(['krs.mahasiswa.programStudi', 'krs.kelas.mataKuliah', 'krs.kelas.dosen', 'krs.academicYearSemester']);

        $this->authorizeSameProgramStudi($nilai->krs?->mahasiswa?->program_studi_id, $request);

        return Inertia::render('admin-prodi/nilai/show', [
            'nilai' => $nilai,
        ]);
    }
}
