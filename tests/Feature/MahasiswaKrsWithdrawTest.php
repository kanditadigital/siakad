<?php

use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\User;

/**
 * @return array{0: User, 1: Mahasiswa}
 */
function mahasiswaUser(): array
{
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);

    return [$user, $mahasiswa];
}

test('mahasiswa can withdraw a pending KRS entry', function () {
    [$user, $mahasiswa] = mahasiswaUser();
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);

    $this->actingAs($user)
        ->delete(route('mahasiswa.krs.destroy', $krs))
        ->assertRedirect();

    $this->assertDatabaseMissing('krs', ['id' => $krs->id]);
});

test('mahasiswa can withdraw a KRS entry marked revisi', function () {
    [$user, $mahasiswa] = mahasiswaUser();
    $krs = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'status' => 'revisi',
        'catatan' => 'Kurangi SKS',
    ]);

    $this->actingAs($user)
        ->delete(route('mahasiswa.krs.destroy', $krs))
        ->assertRedirect();

    $this->assertDatabaseMissing('krs', ['id' => $krs->id]);
});

test('mahasiswa cannot withdraw an already approved KRS entry', function () {
    [$user, $mahasiswa] = mahasiswaUser();
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $this->actingAs($user)
        ->delete(route('mahasiswa.krs.destroy', $krs))
        ->assertStatus(422);

    $this->assertDatabaseHas('krs', ['id' => $krs->id]);
});

test('mahasiswa cannot withdraw a rejected KRS entry', function () {
    [$user, $mahasiswa] = mahasiswaUser();
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'ditolak']);

    $this->actingAs($user)
        ->delete(route('mahasiswa.krs.destroy', $krs))
        ->assertStatus(422);

    $this->assertDatabaseHas('krs', ['id' => $krs->id]);
});

test('mahasiswa cannot withdraw another mahasiswa KRS entry', function () {
    [$user] = mahasiswaUser();
    $other = Mahasiswa::factory()->create();
    $krs = Krs::factory()->create(['mahasiswa_id' => $other->id, 'status' => 'pending']);

    $this->actingAs($user)
        ->delete(route('mahasiswa.krs.destroy', $krs))
        ->assertForbidden();

    $this->assertDatabaseHas('krs', ['id' => $krs->id]);
});
