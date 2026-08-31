<?php

use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\User;

function makeAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

test('approving a krs beyond the sks limit is rejected', function () {
    $admin = makeAdmin();
    $mahasiswa = Mahasiswa::factory()->create();
    $semester = AcademicYearSemester::factory()->create();

    $mataKuliah = MataKuliah::factory()->create(['sks' => 4]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mataKuliah->id]);

    // Already at 22 SKS disetujui for this mahasiswa/semester.
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'academic_year_semester_id' => $semester->id,
        'kelas_id' => Kelas::factory()->create([
            'mata_kuliah_id' => MataKuliah::factory()->create(['sks' => 22])->id,
        ])->id,
        'status' => 'disetujui',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.krs.store'), [
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $semester->id,
        'status' => 'disetujui',
    ]);

    $response->assertSessionHasErrors('kelas_id');
    $this->assertDatabaseMissing('krs', [
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
    ]);
});

test('approving a krs within the sks limit succeeds', function () {
    $admin = makeAdmin();
    $mahasiswa = Mahasiswa::factory()->create();
    $semester = AcademicYearSemester::factory()->create();
    $mataKuliah = MataKuliah::factory()->create(['sks' => 3]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mataKuliah->id]);

    $response = $this->actingAs($admin)->post(route('admin.krs.store'), [
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $semester->id,
        'status' => 'disetujui',
    ]);

    $response->assertRedirect(route('admin.krs.index'));
    $this->assertDatabaseHas('krs', [
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'status' => 'disetujui',
    ]);
});

test('pending krs are not counted toward the sks limit', function () {
    $admin = makeAdmin();
    $mahasiswa = Mahasiswa::factory()->create();
    $semester = AcademicYearSemester::factory()->create();

    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'academic_year_semester_id' => $semester->id,
        'kelas_id' => Kelas::factory()->create([
            'mata_kuliah_id' => MataKuliah::factory()->create(['sks' => 24])->id,
        ])->id,
        'status' => 'pending',
    ]);

    $mataKuliah = MataKuliah::factory()->create(['sks' => 4]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mataKuliah->id]);

    $response = $this->actingAs($admin)->post(route('admin.krs.store'), [
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $semester->id,
        'status' => 'disetujui',
    ]);

    $response->assertRedirect(route('admin.krs.index'));
});
