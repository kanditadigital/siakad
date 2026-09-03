<?php

use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use App\Models\TagihanUkt;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function adminUser(): User
{
    return User::factory()->create(['role' => 'admin']);
}

test('admin dashboard reports KPI counts and outstanding UKT amount', function () {
    $prodi = ProgramStudi::factory()->create(['nama_prodi' => 'Teknik Informatika']);
    Mahasiswa::factory()->count(3)->create([
        'program_studi_id' => $prodi->id,
        'status' => 'aktif',
        'semester_saat_ini' => 3,
    ]);
    $penunggak = Mahasiswa::factory()->create(['status' => 'nonaktif']);
    MataKuliah::factory()->count(2)->create(['status' => 'aktif']);
    TagihanUkt::factory()->create([
        'mahasiswa_id' => $penunggak->id,
        'status' => 'belum',
        'jumlah_tagihan' => 5_000_000,
        'jumlah_bayar' => 1_000_000,
        'jatuh_tempo' => now()->addDays(3),
    ]);

    $this->actingAs(adminUser())
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/admin')
            ->where('stats.total_mahasiswa', 4)
            ->where('stats.mahasiswa_aktif', 3)
            ->where('stats.mata_kuliah_aktif', 2)
            ->where('stats.tagihan_belum_lunas', 1)
            ->where('stats.total_tunggakan', 4000000)
            ->where('stats.tagihan_jatuh_tempo', 1)
        );
});

test('admin dashboard groups active students by their current semester', function () {
    Mahasiswa::factory()->count(2)->create(['status' => 'aktif', 'semester_saat_ini' => 1]);
    Mahasiswa::factory()->create(['status' => 'aktif', 'semester_saat_ini' => 5]);
    Mahasiswa::factory()->create(['status' => 'nonaktif', 'semester_saat_ini' => 1]);

    $this->actingAs(adminUser())
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('mahasiswaPerSemester', 8)
            ->where('mahasiswaPerSemester.0', ['label' => 'S1', 'semester' => 1, 'jumlah' => 2])
            ->where('mahasiswaPerSemester.4', ['label' => 'S5', 'semester' => 5, 'jumlah' => 1])
        );
});

test('admin dashboard folds the smallest program studi into a single Lainnya row', function () {
    $besar = ProgramStudi::factory()->create(['nama_prodi' => 'Teknik Informatika']);
    Mahasiswa::factory()->count(4)->create(['program_studi_id' => $besar->id]);

    ProgramStudi::factory()->count(6)->create()->each(function (ProgramStudi $prodi): void {
        Mahasiswa::factory()->create(['program_studi_id' => $prodi->id]);
    });

    $this->actingAs(adminUser())
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('komposisiProdi', 6)
            ->where('komposisiProdi.0.nama', 'Teknik Informatika')
            ->where('komposisiProdi.0.jumlah', 4)
            ->where('komposisiProdi.5.kode', 'LAINNYA')
            ->where('komposisiProdi.5.jumlah', 2)
        );
});

test('admin dashboard only lists active classes scheduled for today', function () {
    $hariIni = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now()->dayOfWeek];
    $besok = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now()->addDay()->dayOfWeek];

    $kelas = Kelas::factory()->create([
        'hari' => $hariIni,
        'status' => 'Aktif',
        'jam_mulai' => '08:40',
    ]);
    Kelas::factory()->create(['hari' => $hariIni, 'status' => 'Tidak Aktif']);
    Kelas::factory()->create(['hari' => $besok, 'status' => 'Aktif']);

    $expected = $hariIni === 'Minggu' ? 0 : 1;

    $this->actingAs(adminUser())
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('jadwalHariIni', $expected)
            ->when($expected === 1, fn (Assert $p) => $p
                ->where('jadwalHariIni.0.kode', $kelas->kode_kelas)
                ->where('jadwalHariIni.0.dosen', $kelas->dosen->nama)
                ->where('jadwalHariIni.0.ruang', $kelas->ruang->nama_ruang)
            )
        );
});

test('admin dashboard exposes the active period and a recent activity feed', function () {
    AcademicYearSemester::query()->update(['status' => 'nonaktif']);
    AcademicYearSemester::factory()->create([
        'nama_tahun_akademik' => '2026/2027',
        'semester' => 'Ganjil',
        'status' => 'aktif',
        'tanggal_mulai' => now(),
    ]);

    $mahasiswa = Mahasiswa::factory()->create(['nama' => 'Andika Satria']);
    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);

    $this->actingAs(adminUser())
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('periode.nama_tahun_akademik', '2026/2027')
            ->where('periode.semester', 'Ganjil')
            ->where('stats.krs_pending', 1)
            ->where('stats.nilai_belum_diunggah', 0)
            ->has('aktivitasTerbaru', 2)
        );
});
