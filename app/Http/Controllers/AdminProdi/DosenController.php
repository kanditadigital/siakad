<?php

namespace App\Http\Controllers\AdminProdi;

use App\Concerns\AuthorizesProgramStudi;
use App\Concerns\InteractsWithUploads;
use App\Http\Controllers\Controller;
use App\Models\Dosen;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DosenController extends Controller
{
    use AuthorizesProgramStudi;
    use InteractsWithUploads;

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
     * Show the form for creating a new dosen in this program studi.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('admin-prodi/dosen/create', [
            'programStudi' => $request->user()->programStudi,
        ]);
    }

    /**
     * Store a newly created dosen, scoped to this admin's program studi.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nidn' => ['required', 'string', 'max:255', 'unique:dosen,nidn', 'unique:users,nidn'],
            'nuptk' => ['required', 'string', 'max:255', 'unique:dosen,nuptk'],
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:dosen,email', 'unique:users,email'],
            'no_telepon' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'pangkat_golongan' => ['required', 'string', 'max:255'],
            'pendidikan_terakhir' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:aktif,cuti,pensiun'],
            'photo' => ['nullable', 'file', 'image:jpeg,jpg,png', 'max:2048'],
        ]);

        $validated['program_studi_id'] = $request->user()->program_studi_id;

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = static::storeUpload($request->file('photo'), 'photos');
        }

        DB::transaction(function () use ($validated, $photoPath): void {
            $user = User::create([
                'name' => $validated['nama'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['nidn']),
                'must_change_password' => true,
                'role' => 'dosen',
                'nidn' => $validated['nidn'],
                'photo' => $photoPath,
            ]);

            $validated['user_id'] = $user->id;

            Dosen::create($validated);
        });

        return redirect()->route('admin-prodi.dosen.index')
            ->with('success', 'Dosen berhasil ditambahkan');
    }

    /**
     * Display the specified dosen.
     */
    public function show(Request $request, Dosen $dosen): Response
    {
        $this->authorizeSameProgramStudi($dosen->program_studi_id, $request);

        $dosen->load('programStudi', 'user');

        return Inertia::render('admin-prodi/dosen/show', [
            'dosen' => $dosen,
        ]);
    }

    /**
     * Show the form for editing the specified dosen.
     */
    public function edit(Request $request, Dosen $dosen): Response
    {
        $this->authorizeSameProgramStudi($dosen->program_studi_id, $request);

        $dosen->load('programStudi', 'user');

        return Inertia::render('admin-prodi/dosen/edit', [
            'dosen' => $dosen,
        ]);
    }

    /**
     * Update the specified dosen.
     */
    public function update(Request $request, Dosen $dosen): RedirectResponse
    {
        $this->authorizeSameProgramStudi($dosen->program_studi_id, $request);

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

        return redirect()->route('admin-prodi.dosen.index')
            ->with('success', 'Dosen berhasil diperbarui');
    }

    /**
     * Remove the specified dosen.
     */
    public function destroy(Request $request, Dosen $dosen): RedirectResponse
    {
        $this->authorizeSameProgramStudi($dosen->program_studi_id, $request);

        DB::transaction(function () use ($dosen): void {
            if ($dosen->user?->photo) {
                static::deleteUpload($dosen->user->photo);
            }
            if ($dosen->user) {
                $dosen->user->delete();
            }
            $dosen->delete();
        });

        return redirect()->route('admin-prodi.dosen.index')
            ->with('success', 'Dosen berhasil dihapus');
    }
}
