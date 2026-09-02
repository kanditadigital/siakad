<?php

use App\Models\Dosen;
use App\Models\ProgramStudi;
use App\Models\User;

/**
 * A complete, valid payload for the self-service profile form.
 *
 * @return array<string, string>
 */
function validDosenProfilPayload(array $overrides = []): array
{
    return array_merge([
        'nama' => 'Nama Baru',
        'jenis_kelamin' => 'Perempuan',
        'pendidikan_terakhir' => 'S3',
        'no_telepon' => '081234567890',
        'alamat' => 'Alamat Baru',
    ], $overrides);
}

test('dosen can view their own edit profile page', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('dosen.profil.edit'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dosen/profil/edit')
        ->missing('programStudis')
    );
});

test('dosen can update all their self-editable personal and contact fields', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create([
        'user_id' => $user->id,
        'nama' => 'Nama Lama',
        'jenis_kelamin' => 'Laki-laki',
        'pendidikan_terakhir' => 'S2',
        'no_telepon' => '080000000',
        'alamat' => 'Alamat Lama',
    ]);

    $response = $this->actingAs($user)->put(
        route('dosen.profil.update'),
        validDosenProfilPayload(),
    );

    $response->assertRedirect(route('dosen.profil.show'));
    expect($dosen->fresh())
        ->nama->toBe('Nama Baru')
        ->jenis_kelamin->toBe('Perempuan')
        ->pendidikan_terakhir->toBe('S3')
        ->no_telepon->toBe('081234567890')
        ->alamat->toBe('Alamat Baru');
});

test('updating nama also updates the linked user account name', function () {
    $user = User::factory()->create(['role' => 'dosen', 'name' => 'Nama Lama']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->put(
        route('dosen.profil.update'),
        validDosenProfilPayload(['nama' => 'Nama Setelah Update']),
    );

    expect($user->fresh()->name)->toBe('Nama Setelah Update');
});

test('dosen profile update rejects empty required fields', function () {
    // All five columns are NOT NULL on `dosen` — clearing any of them must
    // fail validation, not crash with a database constraint error.
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create([
        'user_id' => $user->id,
        'nama' => 'Nama Lama',
        'no_telepon' => '080000000',
        'alamat' => 'Alamat Lama',
    ]);

    $this->actingAs($user)->put(route('dosen.profil.update'), [
        'nama' => '',
        'jenis_kelamin' => '',
        'pendidikan_terakhir' => '',
        'no_telepon' => '',
        'alamat' => '',
    ])->assertSessionHasErrors([
        'nama', 'jenis_kelamin', 'pendidikan_terakhir', 'no_telepon', 'alamat',
    ]);

    expect($dosen->fresh())
        ->nama->toBe('Nama Lama')
        ->no_telepon->toBe('080000000')
        ->alamat->toBe('Alamat Lama');
});

test('dosen profile update rejects a no_telepon longer than 255 characters', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->put(
        route('dosen.profil.update'),
        validDosenProfilPayload(['no_telepon' => str_repeat('1', 256)]),
    )->assertSessionHasErrors('no_telepon');
});

test('jenis_kelamin must be one of the two allowed values', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->put(
        route('dosen.profil.update'),
        validDosenProfilPayload(['jenis_kelamin' => 'Lainnya']),
    )->assertSessionHasErrors('jenis_kelamin');
});

test('pendidikan_terakhir must be S2 or S3', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->put(
        route('dosen.profil.update'),
        validDosenProfilPayload(['pendidikan_terakhir' => 'S1']),
    )->assertSessionHasErrors('pendidikan_terakhir');
});

test('dosen cannot change institutional fields the form does not expose', function () {
    $prodi = ProgramStudi::factory()->create();
    $otherProdi = ProgramStudi::factory()->create();
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create([
        'user_id' => $user->id,
        'program_studi_id' => $prodi->id,
        'nidn' => '0011223344',
        'nuptk' => '1234567890123456',
        'pangkat_golongan' => 'Penata Muda III/a',
        'status' => 'aktif',
    ]);

    $this->actingAs($user)->put(route('dosen.profil.update'), validDosenProfilPayload([
        'nidn' => '9999999999',
        'nuptk' => '9999999999999999',
        'program_studi_id' => $otherProdi->id,
        'pangkat_golongan' => 'Pembina Utama IV/c',
        'status' => 'pensiun',
    ]));

    expect($dosen->fresh())
        ->nidn->toBe('0011223344')
        ->nuptk->toBe('1234567890123456')
        ->program_studi_id->toBe($prodi->id)
        ->pangkat_golongan->toBe('Penata Muda III/a')
        ->status->toBe('aktif');
});

test('a dosen without a Dosen record cannot reach the edit or update routes', function () {
    $user = User::factory()->create(['role' => 'dosen']);

    $this->actingAs($user)->get(route('dosen.profil.edit'))->assertNotFound();
    $this->actingAs($user)->put(
        route('dosen.profil.update'),
        validDosenProfilPayload(),
    )->assertNotFound();
});
