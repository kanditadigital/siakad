<?php

use App\Models\Dosen;
use App\Models\ProgramStudi;
use App\Models\Tendik;
use App\Models\User;

function validDosenPayload(array $overrides = []): array
{
    return array_replace([
        'niy' => '1112223334',
        'nuptk' => '9998887776',
        'nama' => 'Dosen Baru',
        'email' => 'dosen.baru@example.com',
        'program_studi_id' => ProgramStudi::factory()->create()->id,
        'no_telepon' => '081234567890',
        'jenis_kelamin' => 'Laki-laki',
        'jabatan_fungsional' => 'Lektor',
        'pendidikan_terakhir' => 'S2',
        'alamat' => 'Jl. Contoh No. 1',
        'status' => 'aktif',
    ], $overrides);
}

function validTendikPayload(array $overrides = []): array
{
    return array_replace([
        'nip' => '199001012020121001',
        'nama' => 'Tendik Baru',
        'email' => 'tendik.baru@example.com',
        'no_telepon' => '081234567890',
        'jenis_kelamin' => 'Perempuan',
        'jabatan' => 'Staf Akademik',
        'unit_kerja' => 'BAAK',
        'pendidikan_terakhir' => 'S1',
        'alamat' => 'Jl. Contoh No. 2',
        'status' => 'aktif',
    ], $overrides);
}

test('creating a dosen with an niy already used by another user is rejected, not a 500', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->create(['role' => 'pimpinan', 'niy' => '1234567899']);

    $response = $this->actingAs($admin)->post(
        route('admin.dosen.store'),
        validDosenPayload(['niy' => '1234567899']),
    );

    $response->assertSessionHasErrors('niy');
    $this->assertDatabaseMissing('dosen', ['niy' => '1234567899']);
});

test('creating a dosen with an email already used by another user is rejected, not a 500', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->create(['role' => 'mahasiswa', 'email' => 'taken@example.com']);

    $response = $this->actingAs($admin)->post(
        route('admin.dosen.store'),
        validDosenPayload(['email' => 'taken@example.com']),
    );

    $response->assertSessionHasErrors('email');
    $this->assertDatabaseMissing('dosen', ['email' => 'taken@example.com']);
});

test('updating a dosen keeps its own user niy/email out of the uniqueness check', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $programStudi = ProgramStudi::factory()->create();
    $dosen = Dosen::factory()->for($programStudi)->create();
    $dosen->user->update(['niy' => $dosen->niy, 'email' => $dosen->email]);

    $response = $this->actingAs($admin)->put(
        route('admin.dosen.update', $dosen),
        validDosenPayload([
            'niy' => $dosen->niy,
            'email' => $dosen->email,
            'nuptk' => $dosen->nuptk,
            'program_studi_id' => $programStudi->id,
        ]),
    );

    $response->assertRedirect(route('admin.dosen.index'));
    $response->assertSessionDoesntHaveErrors();
});

test('creating a tendik with an email already used by another user is rejected, not a 500', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->create(['role' => 'dosen', 'email' => 'dupe@example.com']);

    $response = $this->actingAs($admin)->post(
        route('admin.tendik.store'),
        validTendikPayload(['email' => 'dupe@example.com']),
    );

    $response->assertSessionHasErrors('email');
    $this->assertDatabaseMissing('tendik', ['email' => 'dupe@example.com']);
});

test('updating a tendik keeps its own user email out of the uniqueness check', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tendik = Tendik::factory()->create();
    $tendik->user->update(['email' => $tendik->email]);

    $response = $this->actingAs($admin)->put(
        route('admin.tendik.update', $tendik),
        validTendikPayload([
            'nip' => $tendik->nip,
            'email' => $tendik->email,
        ]),
    );

    $response->assertRedirect(route('admin.tendik.index'));
    $response->assertSessionDoesntHaveErrors();
});
