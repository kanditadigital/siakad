<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = User::with('programStudi');

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }

        $users = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        return Inertia::render('admin/user/index', [
            'users' => $users,
            'programStudis' => $programStudis,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        $adminProdiCounts = User::where('role', 'admin_prodi')
            ->select('program_studi_id', DB::raw('count(*) as total'))
            ->groupBy('program_studi_id')
            ->pluck('total', 'program_studi_id');

        return Inertia::render('admin/user/create', [
            'programStudis' => $programStudis,
            'adminProdiCounts' => $adminProdiCounts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'in:admin,admin_prodi,dosen,mahasiswa,pimpinan'],
            'program_studi_id' => ['required_if:role,admin_prodi', 'nullable', 'integer', 'exists:program_studi,id'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        if ($validated['role'] === 'admin_prodi' && ! empty($validated['program_studi_id'])) {
            $exists = User::where('role', 'admin_prodi')
                ->where('program_studi_id', $validated['program_studi_id'])
                ->exists();

            if ($exists) {
                return back()->withErrors([
                    'program_studi_id' => 'Program studi ini sudah memiliki admin prodi',
                ])->withInput();
            }
        }

        DB::transaction(function () use ($validated, $request): void {
            $data = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'program_studi_id' => $validated['program_studi_id'] ?? null,
                'password' => Hash::make($validated['password']),
            ];

            if ($request->hasFile('photo')) {
                $data['photo'] = $request->file('photo')->store('photos', 'public');
            }

            User::create($data);
        });

        return redirect()->route('admin.user.index')
            ->with('success', 'User berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        $user->load('programStudi');

        return Inertia::render('admin/user/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $programStudis = ProgramStudi::orderBy('nama_prodi')->get();

        $adminProdiCounts = User::where('role', 'admin_prodi')
            ->where('id', '!=', $user->id)
            ->select('program_studi_id', DB::raw('count(*) as total'))
            ->groupBy('program_studi_id')
            ->pluck('total', 'program_studi_id');

        return Inertia::render('admin/user/edit', [
            'user' => $user,
            'programStudis' => $programStudis,
            'adminProdiCounts' => $adminProdiCounts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'role' => ['required', 'string', 'in:admin,admin_prodi,dosen,mahasiswa,pimpinan'],
            'program_studi_id' => ['required_if:role,admin_prodi', 'nullable', 'integer', 'exists:program_studi,id'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        if ($validated['role'] === 'admin_prodi' && ! empty($validated['program_studi_id'])) {
            $exists = User::where('role', 'admin_prodi')
                ->where('program_studi_id', $validated['program_studi_id'])
                ->where('id', '!=', $user->id)
                ->exists();

            if ($exists) {
                return back()->withErrors([
                    'program_studi_id' => 'Program studi ini sudah memiliki admin prodi',
                ])->withInput();
            }
        }

        DB::transaction(function () use ($user, $validated, $request): void {
            $data = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'program_studi_id' => $validated['program_studi_id'] ?? null,
            ];

            if (! empty($validated['password'])) {
                $data['password'] = Hash::make($validated['password']);
            }

            if ($request->hasFile('photo')) {
                // Delete old photo
                if ($user->photo) {
                    Storage::disk('public')->delete($user->photo);
                }
                $data['photo'] = $request->file('photo')->store('photos', 'public');
            }

            $user->update($data);
        });

        return redirect()->route('admin.user.index')
            ->with('success', 'User berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Delete photo
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        $user->delete();

        return redirect()->route('admin.user.index')
            ->with('success', 'User berhasil dihapus');
    }
}
