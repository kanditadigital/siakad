<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tendik;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TendikController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Tendik::query();

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search): void {
                $q->where('nip', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('jabatan', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('jabatan') && $request->jabatan !== '') {
            $query->where('jabatan', $request->jabatan);
        }

        $tendiks = $query->latest()
            ->paginate(10)
            ->withQueryString();

        $jabatanList = Tendik::distinct()->pluck('jabatan')->filter();

        return Inertia::render('admin/tendik/index', [
            'tendiks' => $tendiks,
            'jabatanList' => $jabatanList,
            'filters' => $request->only(['search', 'status', 'jabatan']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('admin/tendik/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => ['required', 'string', 'max:255', 'unique:tendik,nip'],
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:tendik,email'],
            'no_telepon' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'jabatan' => ['required', 'string', 'max:255'],
            'unit_kerja' => ['required', 'string', 'max:255'],
            'pendidikan_terakhir' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:aktif,cuti,pensiun'],
        ]);

        DB::transaction(function () use ($validated): void {
            $user = User::create([
                'name' => $validated['nama'],
                'email' => $validated['email'],
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]);

            $validated['user_id'] = $user->id;

            Tendik::create($validated);
        });

        return redirect()->route('admin.tendik.index')
            ->with('success', 'Tendik berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tendik $tendik): Response
    {
        $tendik->load('user');

        return Inertia::render('admin/tendik/show', [
            'tendik' => $tendik,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tendik $tendik): Response
    {
        return Inertia::render('admin/tendik/edit', [
            'tendik' => $tendik,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tendik $tendik): RedirectResponse
    {
        $validated = $request->validate([
            'nip' => ['required', 'string', 'max:255', 'unique:tendik,nip,'.$tendik->id],
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:tendik,email,'.$tendik->id],
            'no_telepon' => ['required', 'string', 'max:255'],
            'jenis_kelamin' => ['required', 'string', 'in:Laki-laki,Perempuan'],
            'jabatan' => ['required', 'string', 'max:255'],
            'unit_kerja' => ['required', 'string', 'max:255'],
            'pendidikan_terakhir' => ['required', 'string', 'max:255'],
            'alamat' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:aktif,cuti,pensiun'],
        ]);

        DB::transaction(function () use ($tendik, $validated): void {
            $tendik->update($validated);

            if ($tendik->user) {
                $tendik->user->update([
                    'name' => $validated['nama'],
                    'email' => $validated['email'],
                ]);
            }
        });

        return redirect()->route('admin.tendik.index')
            ->with('success', 'Tendik berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tendik $tendik): RedirectResponse
    {
        DB::transaction(function () use ($tendik): void {
            if ($tendik->user) {
                $tendik->user->delete();
            }
            $tendik->delete();
        });

        return redirect()->route('admin.tendik.index')
            ->with('success', 'Tendik berhasil dihapus');
    }
}
