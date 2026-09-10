<?php

use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use App\Models\User;

function validAdminProdiMataKuliahPayload(array $overrides = []): array
{
    return array_replace([
        'kode_mk' => 'MK-BARU-001',
        'nama_mk' => 'Struktur Data',
        'jenis' => 'Wajib',
        'sks' => 3,
        'semester' => 2,
        'status' => 'aktif',
    ], $overrides);
}

test('admin_prodi only sees mata kuliah from their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $mine = MataKuliah::factory()->create(['program_studi_id' => $programStudi->id, 'nama_mk' => 'MK Saya']);
    MataKuliah::factory()->create(['program_studi_id' => $otherProgramStudi->id, 'nama_mk' => 'MK Lain']);

    $response = $this->actingAs($admin)->get(route('admin-prodi.mata-kuliah.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/mata-kuliah/index')
        ->has('mataKuliahs.data', 1)
        ->where('mataKuliahs.data.0.id', $mine->id)
    );
});

test('admin_prodi can create a mata kuliah scoped to their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $response = $this->actingAs($admin)->post(route('admin-prodi.mata-kuliah.store'), validAdminProdiMataKuliahPayload());

    $response->assertRedirect(route('admin-prodi.mata-kuliah.index'));
    $this->assertDatabaseHas('mata_kuliah', [
        'kode_mk' => 'MK-BARU-001',
        'program_studi_id' => $programStudi->id,
    ]);
});

test('admin_prodi create form cannot override program_studi_id via request payload', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $this->actingAs($admin)->post(route('admin-prodi.mata-kuliah.store'), validAdminProdiMataKuliahPayload([
        'program_studi_id' => $otherProgramStudi->id,
    ]));

    $this->assertDatabaseHas('mata_kuliah', [
        'kode_mk' => 'MK-BARU-001',
        'program_studi_id' => $programStudi->id,
    ]);
    $this->assertDatabaseMissing('mata_kuliah', [
        'kode_mk' => 'MK-BARU-001',
        'program_studi_id' => $otherProgramStudi->id,
    ]);
});

test('admin_prodi cannot view, edit, or delete a mata kuliah outside their program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMk = MataKuliah::factory()->create(['program_studi_id' => $otherProgramStudi->id]);

    $this->actingAs($admin)->get(route('admin-prodi.mata-kuliah.show', $foreignMk))->assertForbidden();
    $this->actingAs($admin)->get(route('admin-prodi.mata-kuliah.edit', $foreignMk))->assertForbidden();
    $this->actingAs($admin)->put(route('admin-prodi.mata-kuliah.update', $foreignMk), validAdminProdiMataKuliahPayload())->assertForbidden();
    $this->actingAs($admin)->delete(route('admin-prodi.mata-kuliah.destroy', $foreignMk))->assertForbidden();
});

test('admin_prodi can update and delete a mata kuliah in their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mataKuliah = MataKuliah::factory()->create(['program_studi_id' => $programStudi->id]);

    $update = $this->actingAs($admin)->put(route('admin-prodi.mata-kuliah.update', $mataKuliah), validAdminProdiMataKuliahPayload([
        'nama_mk' => 'Nama Diperbarui',
    ]));
    $update->assertRedirect(route('admin-prodi.mata-kuliah.index'));
    $this->assertDatabaseHas('mata_kuliah', ['id' => $mataKuliah->id, 'nama_mk' => 'Nama Diperbarui']);

    $destroy = $this->actingAs($admin)->delete(route('admin-prodi.mata-kuliah.destroy', $mataKuliah));
    $destroy->assertRedirect(route('admin-prodi.mata-kuliah.index'));
    $this->assertDatabaseMissing('mata_kuliah', ['id' => $mataKuliah->id]);
});
