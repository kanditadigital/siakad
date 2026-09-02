<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\InteractsWithUploads;
use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaController extends Controller
{
    use InteractsWithUploads;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Mahasiswa::with('programStudi');

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('nim', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('program_studi_id') && $request->program_studi_id !== '') {
            $query->where('program_studi_id', $request->program_studi_id);
        }

        if ($request->filled('semester')) {
            $this->applySemesterFilter($query, $request->input('semester'));
        }

        $mahasiswas = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('admin/mahasiswa/index', [
            'mahasiswas' => $mahasiswas,
            'programStudis' => $programStudis,
            'filters' => $request->only(['search', 'status', 'program_studi_id', 'semester']),
        ]);
    }

    /**
     * Narrow the query to a specific semester, or to mahasiswa who have gone
     * past the normal length of their jenjang ("over").
     *
     * A prodi-to-cap map is built once and matched with OR branches rather
     * than a correlated subquery — simple, and the number of program studi is
     * always small enough that this stays cheap.
     */
    /**
     * @param  Builder<Mahasiswa>  $query
     */
    private function applySemesterFilter(Builder $query, string $semester): void
    {
        if ($semester !== 'over') {
            $query->where('semester_saat_ini', (int) $semester);

            return;
        }

        $normalCapByProdi = ProgramStudi::query()->pluck('lama_studi', 'id');

        $query->where(function ($outer) use ($normalCapByProdi): void {
            foreach ($normalCapByProdi as $programStudiId => $lamaStudi) {
                $outer->orWhere(function ($inner) use ($programStudiId, $lamaStudi): void {
                    $inner->where('program_studi_id', $programStudiId)
                        ->where('semester_saat_ini', '>', $lamaStudi * 2);
                });
            }
        });
    }

    /**
     * Bulk-advance every active mahasiswa of one program studi to their next
     * semester. Cuti/nonaktif/lulus mahasiswa are left untouched — advancing
     * them would misrepresent students who are not actually progressing.
     */
    public function naikkanSemester(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'program_studi_id' => ['required', 'integer', 'exists:program_studi,id'],
        ]);

        $affected = Mahasiswa::where('program_studi_id', $validated['program_studi_id'])
            ->where('status', 'aktif')
            ->increment('semester_saat_ini');

        if ($affected === 0) {
            return back()->with('error', 'Tidak ada mahasiswa aktif di program studi ini.');
        }

        return back()->with('success', "Semester berhasil dinaikkan untuk {$affected} mahasiswa aktif.");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();
        $dosens = Dosen::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('admin/mahasiswa/create', [
            'programStudis' => $programStudis,
            'dosens' => $dosens,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'program_studi_id' => ['required', 'integer', 'exists:program_studi,id'],
            'pa_dosen_id' => ['nullable', 'integer', 'exists:dosen,id'],
            'no_ktp' => ['nullable', 'string', 'max:255'],
            'tempat_lahir' => ['required', 'string', 'max:255'],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'email_orang_tua' => ['nullable', 'email', 'max:255'],
            'no_hp_orang_tua' => ['nullable', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
            'kode_domisili' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:aktif,cuti,nonaktif,lulus'],
            'photo' => ['nullable', 'file', 'image:jpeg,jpg,png', 'max:2048'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = static::storeUpload($request->file('photo'), 'photos');
        }

        DB::transaction(function () use ($validated, $photoPath): void {
            $programStudi = ProgramStudi::findOrFail($validated['program_studi_id']);
            $nim = $programStudi->generateNim();

            $user = User::create([
                'name' => $validated['nama'],
                'email' => fake()->unique()->safeEmail(),
                'password' => bcrypt('password'),
                'role' => 'mahasiswa',
                'nim' => $nim,
                'photo' => $photoPath,
            ]);

            $validated['user_id'] = $user->id;
            $validated['nim'] = $nim;

            Mahasiswa::create($validated);
        });

        return redirect()->route('admin.mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Mahasiswa $mahasiswa): Response
    {
        $mahasiswa->load('programStudi', 'user');

        return Inertia::render('admin/mahasiswa/show', [
            'mahasiswa' => $mahasiswa,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mahasiswa $mahasiswa): Response
    {
        $mahasiswa->load('programStudi', 'user');
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();
        $dosens = Dosen::where('status', 'aktif')->orderBy('nama')->get();

        return Inertia::render('admin/mahasiswa/edit', [
            'mahasiswa' => $mahasiswa,
            'programStudis' => $programStudis,
            'dosens' => $dosens,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Mahasiswa $mahasiswa): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'program_studi_id' => ['required', 'integer', 'exists:program_studi,id'],
            'pa_dosen_id' => ['nullable', 'integer', 'exists:dosen,id'],
            'no_ktp' => ['nullable', 'string', 'max:255'],
            'tempat_lahir' => ['required', 'string', 'max:255'],
            'tanggal_lahir' => ['required', 'date', 'before:today'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'email_orang_tua' => ['nullable', 'email', 'max:255'],
            'no_hp_orang_tua' => ['nullable', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
            'kode_domisili' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:aktif,cuti,nonaktif,lulus'],
            'semester_saat_ini' => ['required', 'integer', 'min:1', 'max:40'],
            'photo' => ['nullable', 'file', 'image:jpeg,jpg,png', 'max:2048'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            if ($mahasiswa->user?->photo) {
                static::deleteUpload($mahasiswa->user->photo);
            }
            $photoPath = static::storeUpload($request->file('photo'), 'photos');
        }

        DB::transaction(function () use ($mahasiswa, $validated, $photoPath): void {
            $mahasiswa->update($validated);

            if ($mahasiswa->user) {
                $userUpdate = ['name' => $validated['nama']];
                if ($photoPath) {
                    $userUpdate['photo'] = $photoPath;
                }
                $mahasiswa->user->update($userUpdate);
            }
        });

        return redirect()->route('admin.mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Mahasiswa $mahasiswa): RedirectResponse
    {
        DB::transaction(function () use ($mahasiswa): void {
            if ($mahasiswa->user?->photo) {
                static::deleteUpload($mahasiswa->user->photo);
            }
            if ($mahasiswa->user) {
                $mahasiswa->user->delete();
            }
            $mahasiswa->delete();
        });

        return redirect()->route('admin.mahasiswa.index')
            ->with('success', 'Mahasiswa berhasil dihapus');
    }
}
