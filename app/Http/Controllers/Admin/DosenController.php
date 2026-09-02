<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\InteractsWithUploads;
use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DosenController extends Controller
{
    use InteractsWithUploads;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Dosen::with('programStudi');

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('nidn', 'like', "%{$search}%")
                    ->orWhere('nuptk', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('program_studi_id') && $request->program_studi_id !== '') {
            $query->where('program_studi_id', $request->program_studi_id);
        }

        $dosens = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('admin/dosen/index', [
            'dosens' => $dosens,
            'programStudis' => $programStudis,
            'filters' => $request->only(['search', 'status', 'program_studi_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('admin/dosen/create', [
            'programStudis' => $programStudis,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nidn' => ['required', 'string', 'max:255', 'unique:dosen,nidn', 'unique:users,nidn'],
            'nuptk' => ['required', 'string', 'max:255', 'unique:dosen,nuptk'],
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:dosen,email', 'unique:users,email'],
            'program_studi_id' => ['required', 'integer', 'exists:program_studi,id'],
            'no_telepon' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'pangkat_golongan' => ['required', 'string', 'max:255'],
            'pendidikan_terakhir' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:aktif,cuti,pensiun'],
            'photo' => ['nullable', 'file', 'image:jpeg,jpg,png', 'max:2048'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = static::storeUpload($request->file('photo'), 'photos');
        }

        DB::transaction(function () use ($validated, $photoPath): void {
            $user = User::create([
                'name' => $validated['nama'],
                'email' => $validated['email'],
                'password' => bcrypt('password'),
                'role' => 'dosen',
                'nidn' => $validated['nidn'],
                'photo' => $photoPath,
            ]);

            $validated['user_id'] = $user->id;

            Dosen::create($validated);
        });

        return redirect()->route('admin.dosen.index')
            ->with('success', 'Dosen berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Dosen $dosen): Response
    {
        $dosen->load('programStudi', 'user');

        return Inertia::render('admin/dosen/show', [
            'dosen' => $dosen,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Dosen $dosen): Response
    {
        $dosen->load('programStudi', 'user');
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('admin/dosen/edit', [
            'dosen' => $dosen,
            'programStudis' => $programStudis,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Dosen $dosen): RedirectResponse
    {
        $validated = $request->validate([
            'nidn' => [
                'required', 'string', 'max:255',
                Rule::unique('dosen', 'nidn')->ignore($dosen->id),
                Rule::unique('users', 'nidn')->ignore($dosen->user_id),
            ],
            'nuptk' => ['required', 'string', 'max:255', 'unique:dosen,nuptk,'.$dosen->id],
            'nama' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('dosen', 'email')->ignore($dosen->id),
                Rule::unique('users', 'email')->ignore($dosen->user_id),
            ],
            'program_studi_id' => ['required', 'integer', 'exists:program_studi,id'],
            'no_telepon' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'pangkat_golongan' => ['required', 'string', 'max:255'],
            'pendidikan_terakhir' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:aktif,cuti,pensiun'],
            'photo' => ['nullable', 'file', 'image:jpeg,jpg,png', 'max:2048'],
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            if ($dosen->user?->photo) {
                static::deleteUpload($dosen->user->photo);
            }
            $photoPath = static::storeUpload($request->file('photo'), 'photos');
        }

        DB::transaction(function () use ($dosen, $validated, $photoPath): void {
            $dosen->update($validated);

            if ($dosen->user) {
                $userUpdate = [
                    'name' => $validated['nama'],
                    'email' => $validated['email'],
                    'nidn' => $validated['nidn'],
                ];
                if ($photoPath) {
                    $userUpdate['photo'] = $photoPath;
                }
                $dosen->user->update($userUpdate);
            }
        });

        return redirect()->route('admin.dosen.index')
            ->with('success', 'Dosen berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Dosen $dosen): RedirectResponse
    {
        DB::transaction(function () use ($dosen): void {
            if ($dosen->user?->photo) {
                static::deleteUpload($dosen->user->photo);
            }
            if ($dosen->user) {
                $dosen->user->delete();
            }
            $dosen->delete();
        });

        return redirect()->route('admin.dosen.index')
            ->with('success', 'Dosen berhasil dihapus');
    }
}
