<?php

use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

function validAdminMahasiswaPayload(array $overrides = []): array
{
    return array_replace([
        'nama' => 'Mahasiswa Baru',
        'tempat_lahir' => 'Jakarta',
        'tanggal_lahir' => '2003-01-01',
        'jenis_kelamin' => 'Laki-laki',
        'alamat' => 'Jl. Contoh No. 1',
        'kode_domisili' => '3171',
        'status' => 'aktif',
    ], $overrides);
}

test('admin creating a mahasiswa sets the account password to the generated nim', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.mahasiswa.store'), validAdminMahasiswaPayload([
        'program_studi_id' => $programStudi->id,
    ]));

    $response->assertRedirect(route('admin.mahasiswa.index'));

    $user = User::where('role', 'mahasiswa')->latest('id')->first();

    expect($user)->not->toBeNull();
    expect($user->nim)->not->toBeNull();
    expect(Hash::check($user->nim, $user->password))->toBeTrue();
    expect($user->must_change_password)->toBeTrue();
});
