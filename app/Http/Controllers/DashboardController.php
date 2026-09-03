<?php

namespace App\Http\Controllers;

use App\Models\AcademicYearSemester;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Materi;
use App\Models\Nilai;
use App\Models\Pembayaran;
use App\Models\ProgramStudi;
use App\Models\TagihanUkt;
use App\Models\Tendik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Weekday names as stored on `kelas.hari`, indexed by Carbon's dayOfWeek.
     *
     * @var array<int, string>
     */
    /**
     * Program studi listed individually in the composition card before the rest
     * are grouped into a single "Lainnya" row.
     */
    private const MAX_PRODI_DITAMPILKAN = 5;

    private const HARI = [
        1 => 'Senin',
        2 => 'Selasa',
        3 => 'Rabu',
        4 => 'Kamis',
        5 => 'Jumat',
        6 => 'Sabtu',
    ];

    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $role = $user->role?->value;

        // Admin prodi has its own dashboard controller/page under a
        // differently-named route (admin-prodi.dashboard), since its
        // component lives at resources/js/pages/admin-prodi/dashboard.tsx
        // rather than dashboard/{role}.tsx like the other roles.
        if ($role === 'admin_prodi') {
            return redirect()->route('admin-prodi.dashboard');
        }

        $data = [];

        if ($role === 'admin') {
            $data = $this->adminDashboardData();
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

    /**
     * Payload for the admin dashboard: KPI ribbon, enrolment distribution,
     * today's teaching schedule, outstanding work, and a recent activity feed.
     *
     * @return array<string, mixed>
     */
    private function adminDashboardData(): array
    {
        $periode = AcademicYearSemester::where('status', 'aktif')->latest('tanggal_mulai')->first();

        $totalMahasiswa = Mahasiswa::count();
        $tagihanBelumLunas = TagihanUkt::whereIn('status', ['belum', 'terlambat']);

        return [
            'periode' => $periode ? [
                'nama_tahun_akademik' => $periode->nama_tahun_akademik,
                'semester' => $periode->semester,
            ] : null,
            'stats' => [
                'total_mahasiswa' => $totalMahasiswa,
                'mahasiswa_aktif' => Mahasiswa::where('status', 'aktif')->count(),
                'mahasiswa_baru' => Mahasiswa::where('created_at', '>=', now()->subDays(30))->count(),
                'total_dosen' => Dosen::count(),
                'total_tendik' => Tendik::count(),
                'total_kelas' => Kelas::count(),
                'total_mata_kuliah' => MataKuliah::count(),
                'mata_kuliah_aktif' => MataKuliah::where('status', 'aktif')->count(),
                'total_program_studi' => ProgramStudi::count(),
                'krs_pending' => Krs::where('status', 'pending')->count(),
                'tagihan_belum_lunas' => (clone $tagihanBelumLunas)->count(),
                'total_tunggakan' => (float) (clone $tagihanBelumLunas)->sum(
                    DB::raw('jumlah_tagihan - jumlah_bayar')
                ),
                'tagihan_jatuh_tempo' => (clone $tagihanBelumLunas)
                    ->whereBetween('jatuh_tempo', [now()->startOfDay(), now()->addDays(7)->endOfDay()])
                    ->count(),
                'nilai_belum_diunggah' => Krs::where('status', 'disetujui')
                    ->whereDoesntHave('nilai')
                    ->count(),
            ],
            'mahasiswaPerSemester' => $this->mahasiswaPerSemester(),
            'komposisiProdi' => $this->komposisiProdi($totalMahasiswa),
            'jadwalHariIni' => $this->jadwalHariIni(),
            'aktivitasTerbaru' => $this->aktivitasTerbaru(),
        ];
    }

    /**
     * Active students grouped by their current semester.
     *
     * @return list<array{label: string, semester: int, jumlah: int}>
     */
    private function mahasiswaPerSemester(): array
    {
        $counts = Mahasiswa::where('status', 'aktif')
            ->selectRaw('semester_saat_ini, COUNT(*) as jumlah')
            ->groupBy('semester_saat_ini')
            ->pluck('jumlah', 'semester_saat_ini');

        $maxSemester = max(8, (int) ($counts->keys()->max() ?? 0));

        return collect(range(1, $maxSemester))
            ->map(fn (int $semester): array => [
                'label' => 'S'.$semester,
                'semester' => $semester,
                'jumlah' => (int) ($counts[$semester] ?? 0),
            ])
            ->all();
    }

    /**
     * Student head count per program studi, largest first. Only the top few are
     * listed individually; the rest are folded into a single "Lainnya" row so the
     * composition bar stays readable on an institution with many prodi.
     *
     * @return list<array{nama: string, kode: string, jumlah: int, persen: float}>
     */
    private function komposisiProdi(int $totalMahasiswa): array
    {
        $persen = fn (int $jumlah): float => $totalMahasiswa > 0
            ? round($jumlah / $totalMahasiswa * 100, 1)
            : 0.0;

        $prodi = ProgramStudi::withCount('mahasiswas')
            ->get()
            ->sortByDesc('mahasiswas_count')
            ->values();

        $teratas = $prodi->take(self::MAX_PRODI_DITAMPILKAN)
            ->map(fn (ProgramStudi $p): array => [
                'nama' => $p->nama_prodi,
                'kode' => $p->kode_prodi,
                'jumlah' => $p->mahasiswas_count,
                'persen' => $persen($p->mahasiswas_count),
            ]);

        $sisa = $prodi->skip(self::MAX_PRODI_DITAMPILKAN);

        if ($sisa->isNotEmpty()) {
            $jumlahSisa = (int) $sisa->sum('mahasiswas_count');

            $teratas->push([
                'nama' => 'Prodi lainnya ('.$sisa->count().')',
                'kode' => 'LAINNYA',
                'jumlah' => $jumlahSisa,
                'persen' => $persen($jumlahSisa),
            ]);
        }

        return $teratas->values()->all();
    }

    /**
     * Classes scheduled on today's weekday, ordered by start time.
     *
     * @return list<array{kode: string, mata_kuliah: string, dosen: string, ruang: string, jam_mulai: string|null, jam_selesai: string|null}>
     */
    private function jadwalHariIni(): array
    {
        $hari = self::HARI[now()->dayOfWeek] ?? null;

        if ($hari === null) {
            return [];
        }

        return Kelas::with(['mataKuliah', 'dosen', 'ruang'])
            ->where('hari', $hari)
            ->where('status', 'Aktif')
            ->orderBy('jam_mulai')
            ->take(6)
            ->get()
            ->map(fn (Kelas $kelas): array => [
                'kode' => $kelas->kode_kelas,
                'mata_kuliah' => $kelas->mataKuliah?->nama_mk ?? $kelas->nama_kelas,
                'dosen' => $kelas->dosen?->nama ?? 'Belum ditentukan',
                'ruang' => $kelas->ruang?->nama_ruang ?? 'Belum ditentukan',
                'jam_mulai' => $kelas->jam_mulai,
                'jam_selesai' => $kelas->jam_selesai,
            ])
            ->all();
    }

    /**
     * Merged feed of the newest records across the modules an admin watches.
     *
     * @return list<array{jenis: string, teks: string, waktu: string}>
     */
    private function aktivitasTerbaru(): array
    {
        $mahasiswa = Mahasiswa::with('programStudi')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn (Mahasiswa $m): array => [
                'jenis' => 'mahasiswa',
                'teks' => "{$m->nama} terdaftar pada ".($m->programStudi?->nama_prodi ?? 'program studi'),
                'waktu' => $m->created_at?->toIso8601String() ?? '',
            ]);

        $pembayaran = Pembayaran::with('mahasiswa')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn (Pembayaran $p): array => [
                'jenis' => 'pembayaran',
                'teks' => 'Pembayaran UKT diterima dari '.($p->mahasiswa?->nama ?? 'mahasiswa'),
                'waktu' => $p->created_at?->toIso8601String() ?? '',
            ]);

        $nilai = Nilai::with('krs.kelas.mataKuliah')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn (Nilai $n): array => [
                'jenis' => 'nilai',
                'teks' => 'Nilai '.($n->krs?->kelas?->mataKuliah?->nama_mk ?? 'mata kuliah').' diunggah',
                'waktu' => $n->created_at?->toIso8601String() ?? '',
            ]);

        $krs = Krs::with('mahasiswa')
            ->where('status', 'pending')
            ->latest()
            ->take(4)
            ->get()
            ->map(fn (Krs $k): array => [
                'jenis' => 'krs',
                'teks' => 'Pengajuan KRS dari '.($k->mahasiswa?->nama ?? 'mahasiswa').' menunggu persetujuan',
                'waktu' => $k->created_at?->toIso8601String() ?? '',
            ]);

        return $mahasiswa
            ->concat($pembayaran)
            ->concat($nilai)
            ->concat($krs)
            ->sortByDesc('waktu')
            ->take(6)
            ->values()
            ->all();
    }
}
