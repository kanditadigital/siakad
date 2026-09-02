<?php

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use App\Models\User;

test('admin_prodi can assign a dosen pa from their own program studi to a mahasiswa', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);

    $response = $this->actingAs($admin)->patch(
        route('admin-prodi.mahasiswa.dosen-pa.update', $mahasiswa),
        ['pa_dosen_id' => $dosen->id]
    );

    $response->assertRedirect();
    $this->assertDatabaseHas('mahasiswa', ['id' => $mahasiswa->id, 'pa_dosen_id' => $dosen->id]);
});

test('admin_prodi can clear the dosen pa for a mahasiswa', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => $dosen->id]);

    $response = $this->actingAs($admin)->patch(
        route('admin-prodi.mahasiswa.dosen-pa.update', $mahasiswa),
        ['pa_dosen_id' => null]
    );

    $response->assertRedirect();
    $this->assertDatabaseHas('mahasiswa', ['id' => $mahasiswa->id, 'pa_dosen_id' => null]);
});

test('a single dosen can be pa for more than one mahasiswa', function () {
    $programStudi = ProgramStudi::factory()->create();
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    $mahasiswaOne = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => $dosen->id]);
    $mahasiswaTwo = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => $dosen->id]);

    expect($dosen->fresh())->not->toBeNull();
    $this->assertDatabaseHas('mahasiswa', ['id' => $mahasiswaOne->id, 'pa_dosen_id' => $dosen->id]);
    $this->assertDatabaseHas('mahasiswa', ['id' => $mahasiswaTwo->id, 'pa_dosen_id' => $dosen->id]);
});

test('admin_prodi cannot assign a dosen pa from another program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $foreignDosen = Dosen::factory()->create(['program_studi_id' => $otherProgramStudi->id]);

    $response = $this->actingAs($admin)->patch(
        route('admin-prodi.mahasiswa.dosen-pa.update', $mahasiswa),
        ['pa_dosen_id' => $foreignDosen->id]
    );

    $response->assertSessionHasErrors('pa_dosen_id');
    $this->assertDatabaseMissing('mahasiswa', ['id' => $mahasiswa->id, 'pa_dosen_id' => $foreignDosen->id]);
});

test('admin_prodi cannot assign a dosen pa for a mahasiswa outside their program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);

    $response = $this->actingAs($admin)->patch(
        route('admin-prodi.mahasiswa.dosen-pa.update', $foreignMahasiswa),
        ['pa_dosen_id' => $dosen->id]
    );

    $response->assertForbidden();
});

test('admin_prodi cannot view a mahasiswa outside their program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);

    $this->actingAs($admin)->get(route('admin-prodi.mahasiswa.show', $foreignMahasiswa))->assertForbidden();
});

test('dosen pa index lists mahasiswa of the own program studi with their assigned dosen pa', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => $dosen->id]);
    Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.dosen-pa.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/dosen-pa/index')
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $mahasiswa->id)
        ->where('mahasiswas.data.0.pa_dosen.id', $dosen->id)
        ->has('dosens', 1)
    );
});

test('dosen pa index can be filtered by assigned dosen', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $dosenOne = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    $dosenTwo = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    $mahasiswaOne = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => $dosenOne->id]);
    Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => $dosenTwo->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.dosen-pa.index', ['pa_dosen_id' => $dosenOne->id]));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $mahasiswaOne->id)
    );
});

test('dosen pa index can be filtered by a specific mahasiswa', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswaOne = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $mahasiswaTwo = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.dosen-pa.index', ['mahasiswa_id' => $mahasiswaOne->id]));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $mahasiswaOne->id)
    );

    expect($mahasiswaTwo->exists)->toBeTrue();
});

test('dosen pa index includes mahasiswa options and stats scoped to the program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => $dosen->id]);
    Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => null]);
    Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.dosen-pa.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswaOptions', 2)
        ->where('stats.total', 2)
        ->where('stats.sudah_ada_pa', 1)
        ->where('stats.belum_ada_pa', 1)
    );
});

test('mahasiswa show page includes dosen options scoped to the program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $ownDosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    Dosen::factory()->create(['program_studi_id' => $otherProgramStudi->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.mahasiswa.show', $mahasiswa));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/mahasiswa/show')
        ->has('dosens', 1)
        ->where('dosens.0.id', $ownDosen->id)
    );
});
