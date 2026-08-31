<?php

namespace App\Http\Controllers;

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Materi;
use App\Models\Nilai;
use App\Models\ProgramStudi;
use App\Models\TagihanUkt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $role = $user->role?->value;

        $data = [];

        if ($role === 'admin') {
            $data['stats'] = [
                'total_mahasiswa' => Mahasiswa::count(),
                'mahasiswa_aktif' => Mahasiswa::where('status', 'aktif')->count(),
                'total_dosen' => Dosen::count(),
                'total_kelas' => Kelas::count(),
                'total_mata_kuliah' => MataKuliah::count(),
                'total_program_studi' => ProgramStudi::count(),
                'krs_pending' => Krs::where('status', 'pending')->count(),
                'tagihan_belum_lunas' => TagihanUkt::whereIn('status', ['belum', 'terlambat'])->count(),
            ];
        } elseif ($role === 'admin_prodi') {
            $mahasiswa = $user->mahasiswa;
            $programStudi = $user->programStudi;

            $data['programStudi'] = $programStudi;
            $data['stats'] = [
                'mahasiswa' => Mahasiswa::where('program_studi_id', $user->program_studi_id)->count(),
                'dosen' => Dosen::where('program_studi_id', $user->program_studi_id)->count(),
                'penjadwalan' => Kelas::whereHas('mataKuliah', function ($q) use ($user): void {
                    $q->where('program_studi_id', $user->program_studi_id);
                })->count(),
            ];
        } elseif ($role === 'mahasiswa') {
            $mahasiswa = $user->mahasiswa;

            if ($mahasiswa) {
                $data['mahasiswa'] = $mahasiswa;
                $data['stats'] = [
                    'krs_count' => Krs::where('mahasiswa_id', $mahasiswa->id)->count(),
                    'krs_active' => Krs::where('mahasiswa_id', $mahasiswa->id)
                        ->where('status', 'disetujui')
                        ->count(),
                    'tagihan_count' => TagihanUkt::where('mahasiswa_id', $mahasiswa->id)
                        ->whereIn('status', ['belum', 'terlambat'])
                        ->count(),
                    'nilai_count' => Nilai::whereHas('krs', function ($q) use ($mahasiswa): void {
                        $q->where('mahasiswa_id', $mahasiswa->id);
                    })->count(),
                ];

                $data['recent_krs'] = Krs::with(['kelas.mataKuliah', 'kelas.dosen'])
                    ->where('mahasiswa_id', $mahasiswa->id)
                    ->latest()
                    ->take(5)
                    ->get();

                $data['recent_nilai'] = Nilai::with(['krs.kelas.mataKuliah'])
                    ->whereHas('krs', function ($q) use ($mahasiswa): void {
                        $q->where('mahasiswa_id', $mahasiswa->id);
                    })
                    ->latest()
                    ->take(5)
                    ->get();
            }
        } elseif ($role === 'dosen') {
            $dosen = $user->dosen;

            if ($dosen) {
                $data['dosen'] = $dosen;
                $data['stats'] = [
                    'total_kelas' => Kelas::where('dosen_id', $dosen->id)->count(),
                    'kelas_aktif' => Kelas::where('dosen_id', $dosen->id)->where('status', 'Aktif')->count(),
                    'total_mahasiswa_asuh' => Mahasiswa::where('pa_dosen_id', $dosen->id)->count(),
                    'total_mahasiswa_diampu' => Krs::whereHas('kelas', function ($q) use ($dosen): void {
                        $q->where('dosen_id', $dosen->id);
                    })->where('status', 'disetujui')->distinct('mahasiswa_id')->count('mahasiswa_id'),
                ];

                $data['kelas_diampu'] = Kelas::with(['mataKuliah'])
                    ->where('dosen_id', $dosen->id)
                    ->latest()
                    ->take(5)
                    ->get();

                $data['materi_terbaru'] = Materi::whereHas('kelas', function ($q) use ($dosen): void {
                    $q->where('dosen_id', $dosen->id);
                })
                    ->with(['kelas.mataKuliah'])
                    ->latest()
                    ->take(5)
                    ->get();
            }
        } elseif ($role === 'pimpinan') {
            $data['stats'] = [
                'mahasiswa_aktif' => Mahasiswa::where('status', 'aktif')->count(),
                'total_dosen' => Dosen::count(),
                'total_kelas' => Kelas::count(),
                'krs_pending' => Krs::where('status', 'pending')->count(),
                'tagihan_belum_lunas' => TagihanUkt::whereIn('status', ['belum', 'terlambat'])->count(),
                'total_tunggakan' => TagihanUkt::whereIn('status', ['belum', 'terlambat'])
                    ->get()
                    ->sum(fn (TagihanUkt $t) => $t->jumlah_tagihan - $t->jumlah_bayar),
                'persentase_lunas' => TagihanUkt::count() > 0
                    ? round(TagihanUkt::where('status', 'lunas')->count() / TagihanUkt::count() * 100, 1)
                    : 0,
            ];
        }

        return Inertia::render("dashboard/{$role}", $data);
    }
}
