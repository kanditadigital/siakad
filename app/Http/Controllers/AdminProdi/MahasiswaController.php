<?php

namespace App\Http\Controllers\AdminProdi;

use App\Concerns\AuthorizesProgramStudi;
use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaController extends Controller
{
    use AuthorizesProgramStudi;

    /**
     * Display a listing of mahasiswa for this program studi.
     */
    public function index(Request $request): Response
    {
        $programStudiId = $request->user()->program_studi_id;

        $query = Mahasiswa::with(['programStudi', 'paDosen'])->where('program_studi_id', $programStudiId);

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

        $maxSemester = ProgramStudi::whereKey($programStudiId)->value('lama_studi') * 2;

        if ($request->filled('semester')) {
            $semester = $request->input('semester');

            if ($semester === 'over') {
                $query->where('semester_saat_ini', '>', $maxSemester);
            } else {
                $query->where('semester_saat_ini', (int) $semester);
            }
        }

        $mahasiswas = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin-prodi/mahasiswa/index', [
            'mahasiswas' => $mahasiswas,
            'maxSemester' => $maxSemester,
            'activeCount' => Mahasiswa::where('program_studi_id', $programStudiId)->where('status', 'aktif')->count(),
            'filters' => $request->only(['search', 'status', 'semester']),
        ]);
    }

    /**
     * Bulk-advance every active mahasiswa of this admin's own program studi to
     * their next semester. Cuti/nonaktif/lulus mahasiswa are left untouched.
     */
    public function naikkanSemester(Request $request): RedirectResponse
    {
        $programStudiId = $request->user()->program_studi_id;

        $affected = Mahasiswa::where('program_studi_id', $programStudiId)
            ->where('status', 'aktif')
            ->increment('semester_saat_ini');

        if ($affected === 0) {
            return back()->with('error', 'Tidak ada mahasiswa aktif di program studi ini.');
        }

        return back()->with('success', "Semester berhasil dinaikkan untuk {$affected} mahasiswa aktif.");
    }

    /**
     * Display the specified mahasiswa.
     */
    public function show(Request $request, Mahasiswa $mahasiswa): Response
    {
        $this->authorizeSameProgramStudi($mahasiswa->program_studi_id, $request);

        $mahasiswa->load('programStudi', 'user', 'paDosen');

        return Inertia::render('admin-prodi/mahasiswa/show', [
            'mahasiswa' => $mahasiswa,
            'dosens' => Dosen::where('program_studi_id', $mahasiswa->program_studi_id)
                ->orderBy('nama')
                ->get(),
        ]);
    }

    /**
     * Assign or clear the dosen PA (pembimbing akademik) for this mahasiswa.
     */
    public function updateDosenPa(Request $request, Mahasiswa $mahasiswa): RedirectResponse
    {
        $programStudiId = $request->user()->program_studi_id;

        $this->authorizeSameProgramStudi($mahasiswa->program_studi_id, $request);

        $validated = $request->validate([
            'pa_dosen_id' => [
                'nullable', 'integer',
                Rule::exists('dosen', 'id')->where('program_studi_id', $programStudiId),
            ],
        ]);

        $mahasiswa->update($validated);

        return back()->with('success', 'Dosen PA berhasil diperbarui');
    }
}
