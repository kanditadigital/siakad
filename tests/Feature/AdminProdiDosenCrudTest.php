<?php

use App\Models\Dosen;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

function validAdminProdiDosenPayload(array $overrides = []): array
{
    return array_replace([
        'nidn' => '1112223334',
        'nuptk' => '9998887776',
        'nama' => 'Dosen Prodi Baru',
        'email' => 'dosen.prodi.baru@example.com',
        'no_telepon' => '081234567890',
        'jenis_kelamin' => 'Laki-laki',
        'pangkat_golongan' => 'Lektor',
        'pendidikan_terakhir' => 'S2',
        'alamat' => 'Jl. Contoh No. 1',
        'status' => 'aktif',
    ], $overrides);
}

test('admin_prodi only sees dosen from their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $mine = Dosen::factory()->create(['program_studi_id' => $programStudi->id, 'nama' => 'Dosen Saya']);
    Dosen::factory()->create(['program_studi_id' => $otherProgramStudi->id, 'nama' => 'Dosen Lain']);

    $response = $this->actingAs($admin)->get(route('admin-prodi.dosen.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/dosen/index')
        ->has('dosens.data', 1)
        ->where('dosens.data.0.id', $mine->id)
    );
});

test('admin_prodi can create a dosen scoped to their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $response = $this->actingAs($admin)->post(route('admin-prodi.dosen.store'), validAdminProdiDosenPayload());

    $response->assertRedirect(route('admin-prodi.dosen.index'));
    $this->assertDatabaseHas('dosen', [
        'nidn' => '1112223334',
        'program_studi_id' => $programStudi->id,
    ]);
    $this->assertDatabaseHas('users', [
        'email' => 'dosen.prodi.baru@example.com',
        'role' => 'dosen',
    ]);

    $user = User::where('email', 'dosen.prodi.baru@example.com')->first();
    expect(Hash::check('1112223334', $user->password))->toBeTrue();
    expect($user->must_change_password)->toBeTrue();
});

test('admin_prodi create form cannot override program_studi_id via request payload', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $this->actingAs($admin)->post(route('admin-prodi.dosen.store'), validAdminProdiDosenPayload([
        'program_studi_id' => $otherProgramStudi->id,
    ]));

    $this->assertDatabaseHas('dosen', [
        'nidn' => '1112223334',
        'program_studi_id' => $programStudi->id,
    ]);
    $this->assertDatabaseMissing('dosen', [
        'nidn' => '1112223334',
        'program_studi_id' => $otherProgramStudi->id,
    ]);
});

test('admin_prodi cannot view a dosen outside their program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignDosen = Dosen::factory()->create(['program_studi_id' => $otherProgramStudi->id]);

    $this->actingAs($admin)->get(route('admin-prodi.dosen.show', $foreignDosen))->assertForbidden();
    $this->actingAs($admin)->get(route('admin-prodi.dosen.edit', $foreignDosen))->assertForbidden();
    $this->actingAs($admin)->put(route('admin-prodi.dosen.update', $foreignDosen), validAdminProdiDosenPayload())->assertForbidden();
    $this->actingAs($admin)->delete(route('admin-prodi.dosen.destroy', $foreignDosen))->assertForbidden();
});

test('admin_prodi can update and delete a dosen in their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);

    $update = $this->actingAs($admin)->put(route('admin-prodi.dosen.update', $dosen), validAdminProdiDosenPayload([
        'nama' => 'Nama Diperbarui',
    ]));
    $update->assertRedirect(route('admin-prodi.dosen.index'));
    $this->assertDatabaseHas('dosen', ['id' => $dosen->id, 'nama' => 'Nama Diperbarui']);

    $destroy = $this->actingAs($admin)->delete(route('admin-prodi.dosen.destroy', $dosen));
    $destroy->assertRedirect(route('admin-prodi.dosen.index'));
    $this->assertDatabaseMissing('dosen', ['id' => $dosen->id]);
});
