<?php

use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

function validAdminDosenPayload(array $overrides = []): array
{
    return array_replace([
        'nidn' => '1112223334',
        'nuptk' => '9998887776',
        'nama' => 'Dosen Baru',
        'email' => 'dosen.baru@example.com',
        'no_telepon' => '081234567890',
        'jenis_kelamin' => 'Laki-laki',
        'pangkat_golongan' => 'Lektor',
        'pendidikan_terakhir' => 'S2',
        'alamat' => 'Jl. Contoh No. 1',
        'status' => 'aktif',
    ], $overrides);
}

test('admin creating a dosen sets the account password to the nidn', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.dosen.store'), validAdminDosenPayload([
        'program_studi_id' => $programStudi->id,
    ]));

    $response->assertRedirect(route('admin.dosen.index'));

    $user = User::where('email', 'dosen.baru@example.com')->first();

    expect($user)->not->toBeNull();
    expect($user->nidn)->toBe('1112223334');
    expect(Hash::check('1112223334', $user->password))->toBeTrue();
    expect($user->must_change_password)->toBeTrue();
});
