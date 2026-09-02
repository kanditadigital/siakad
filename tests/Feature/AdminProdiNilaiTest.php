<?php

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Nilai;
use App\Models\ProgramStudi;
use App\Models\User;

test('admin_prodi only sees nilai for mahasiswa in their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $ownMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $ownKrs = Krs::factory()->create(['mahasiswa_id' => $ownMahasiswa->id]);
    $foreignKrs = Krs::factory()->create(['mahasiswa_id' => $foreignMahasiswa->id]);
    $mine = Nilai::factory()->create(['krs_id' => $ownKrs->id]);
    Nilai::factory()->create(['krs_id' => $foreignKrs->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.nilai.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/nilai/index')
        ->has('nilais.data', 1)
        ->where('nilais.data.0.id', $mine->id)
    );
});

test('status filter narrows the nilai list', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $krs1 = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id]);
    $krs2 = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id]);

    Nilai::factory()->create(['krs_id' => $krs1->id, 'status' => 'belum']);
    Nilai::factory()->create(['krs_id' => $krs2->id, 'status' => 'tercatat']);

    $response = $this->actingAs($admin)->get(route('admin-prodi.nilai.index', ['status' => 'tercatat']));

    $response->assertInertia(fn ($page) => $page
        ->has('nilais.data', 1)
        ->where('nilais.data.0.status', 'tercatat')
    );
});

test('admin_prodi cannot view nilai belonging to another program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $foreignKrs = Krs::factory()->create(['mahasiswa_id' => $foreignMahasiswa->id]);
    $foreignNilai = Nilai::factory()->create(['krs_id' => $foreignKrs->id]);

    $this->actingAs($admin)->get(route('admin-prodi.nilai.show', $foreignNilai))->assertForbidden();
});

test('admin_prodi nilai show loads dosen and academic year semester correctly', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $dosen = Dosen::factory()->create();
    $kelas = Kelas::factory()->create(['dosen_id' => $dosen->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id]);
    $nilai = Nilai::factory()->create(['krs_id' => $krs->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.nilai.show', $nilai));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/nilai/show')
        ->where('nilai.krs.kelas.dosen.nama', $dosen->nama)
        ->where('nilai.krs.academic_year_semester.id', $krs->academic_year_semester_id)
    );
});
