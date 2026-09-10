<?php

use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Presensi;
use App\Models\User;

test('mahasiswa can view their attendance percentage per mata kuliah', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $semester = AcademicYearSemester::factory()->create(['status' => 'aktif']);
    $mataKuliah = MataKuliah::factory()->create(['nama_mk' => 'Basis Data']);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mataKuliah->id]);

    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $semester->id,
        'status' => 'disetujui',
    ]);

    Presensi::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'tanggal' => '2026-09-01',
        'status' => 'hadir',
    ]);
    Presensi::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'tanggal' => '2026-09-08',
        'status' => 'alpha',
    ]);

    $response = $this->actingAs($user)->get(route('mahasiswa.kehadiran'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('mahasiswa/kehadiran')
        ->where('ringkasanPresensi.persentase_hadir', 50)
        ->has('ringkasanPresensi.per_kelas', 1)
        ->where('ringkasanPresensi.per_kelas.0.mata_kuliah', 'Basis Data')
        ->where('ringkasanPresensi.per_kelas.0.persentase_hadir', 50)
    );
});

test('guests cannot view the kehadiran page', function () {
    $response = $this->get(route('mahasiswa.kehadiran'));

    $response->assertRedirect(route('login'));
});
