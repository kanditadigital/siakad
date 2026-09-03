<?php

use App\Models\Dosen;
use App\Models\RiwayatPendidikanDosen;
use App\Models\User;

function validRiwayatPendidikanPayload(array $overrides = []): array
{
    return array_merge([
        'jenjang' => 'S2',
        'nama_institusi' => 'Universitas Contoh',
        'fakultas_prodi' => 'Fakultas Ilmu Komputer',
    ], $overrides);
}

test('the profile page lists the dosen own riwayat pendidikan', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    RiwayatPendidikanDosen::factory()->create([
        'dosen_id' => $dosen->id,
        'jenjang' => 'S1',
        'nama_institusi' => 'Universitas A',
        'fakultas_prodi' => 'Teknik Informatika',
    ]);
    RiwayatPendidikanDosen::factory()->create([
        'dosen_id' => $dosen->id,
        'jenjang' => 'S2',
        'nama_institusi' => 'Universitas B',
        'fakultas_prodi' => null,
    ]);

    $response = $this->actingAs($user)->get(route('dosen.profil.show'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('dosen.riwayat_pendidikan', 2)
    );
});

test('dosen can add a riwayat pendidikan entry', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->post(
        route('dosen.riwayat-pendidikan.store'),
        validRiwayatPendidikanPayload(),
    );

    $response->assertRedirect();
    $this->assertDatabaseHas('riwayat_pendidikan_dosen', [
        'dosen_id' => $dosen->id,
        'jenjang' => 'S2',
        'nama_institusi' => 'Universitas Contoh',
        'fakultas_prodi' => 'Fakultas Ilmu Komputer',
    ]);
});

test('dosen can add more than one riwayat pendidikan entry', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->post(route('dosen.riwayat-pendidikan.store'), validRiwayatPendidikanPayload(['jenjang' => 'S1']));
    $this->actingAs($user)->post(route('dosen.riwayat-pendidikan.store'), validRiwayatPendidikanPayload(['jenjang' => 'S2']));

    expect($dosen->riwayatPendidikan()->count())->toBe(2);
});

test('jenjang must be one of the allowed values', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->post(
        route('dosen.riwayat-pendidikan.store'),
        validRiwayatPendidikanPayload(['jenjang' => 'SD']),
    )->assertSessionHasErrors('jenjang');
});

test('fakultas_prodi is optional', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->post(
        route('dosen.riwayat-pendidikan.store'),
        validRiwayatPendidikanPayload(['fakultas_prodi' => null]),
    );

    $response->assertSessionDoesntHaveErrors();
    $this->assertDatabaseHas('riwayat_pendidikan_dosen', [
        'dosen_id' => $dosen->id,
        'fakultas_prodi' => null,
    ]);
});

test('dosen can update their own riwayat pendidikan entry', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $riwayat = RiwayatPendidikanDosen::factory()->create(['dosen_id' => $dosen->id]);

    $response = $this->actingAs($user)->put(
        route('dosen.riwayat-pendidikan.update', $riwayat),
        validRiwayatPendidikanPayload(['nama_institusi' => 'Universitas Baru']),
    );

    $response->assertRedirect();
    expect($riwayat->fresh()->nama_institusi)->toBe('Universitas Baru');
});

test('dosen can delete their own riwayat pendidikan entry', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $riwayat = RiwayatPendidikanDosen::factory()->create(['dosen_id' => $dosen->id]);

    $response = $this->actingAs($user)->delete(route('dosen.riwayat-pendidikan.destroy', $riwayat));

    $response->assertRedirect();
    $this->assertModelMissing($riwayat);
});

test('a dosen cannot update another dosen riwayat pendidikan entry', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $otherDosen = Dosen::factory()->create();
    $riwayat = RiwayatPendidikanDosen::factory()->create([
        'dosen_id' => $otherDosen->id,
        'nama_institusi' => 'Universitas Asli',
    ]);

    $this->actingAs($user)->put(
        route('dosen.riwayat-pendidikan.update', $riwayat),
        validRiwayatPendidikanPayload(['nama_institusi' => 'Universitas Diubah']),
    )->assertForbidden();

    expect($riwayat->fresh()->nama_institusi)->toBe('Universitas Asli');
});

test('a dosen cannot delete another dosen riwayat pendidikan entry', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $otherDosen = Dosen::factory()->create();
    $riwayat = RiwayatPendidikanDosen::factory()->create(['dosen_id' => $otherDosen->id]);

    $this->actingAs($user)->delete(route('dosen.riwayat-pendidikan.destroy', $riwayat))
        ->assertForbidden();

    $this->assertModelExists($riwayat);
});

test('a dosen without a Dosen record cannot manage riwayat pendidikan', function () {
    $user = User::factory()->create(['role' => 'dosen']);

    $this->actingAs($user)->post(
        route('dosen.riwayat-pendidikan.store'),
        validRiwayatPendidikanPayload(),
    )->assertNotFound();
});
