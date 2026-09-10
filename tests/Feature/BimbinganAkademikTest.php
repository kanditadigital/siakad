<?php

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\User;

test('PA can add a standalone catatan bimbingan for their mahasiswa asuh', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id]);

    $response = $this->actingAs($user)->post(
        route('dosen.mahasiswa-asuh.bimbingan.store', $mahasiswa),
        [
            'topik' => 'Konsultasi KRS Semester 5',
            'catatan' => 'Disarankan maksimal 21 SKS karena IPS semester sebelumnya 2,70.',
        ],
    );

    $response->assertRedirect();
    $this->assertDatabaseHas('bimbingan_akademik', [
        'dosen_id' => $dosen->id,
        'mahasiswa_id' => $mahasiswa->id,
        'krs_id' => null,
        'topik' => 'Konsultasi KRS Semester 5',
    ]);
});

test('PA cannot add a catatan for a mahasiswa who is not their mahasiswa asuh', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => null]);

    $this->actingAs($user)
        ->post(route('dosen.mahasiswa-asuh.bimbingan.store', $mahasiswa), [
            'topik' => 'Topik',
            'catatan' => 'Catatan',
        ])
        ->assertForbidden();

    $this->assertDatabaseCount('bimbingan_akademik', 0);
});

test('topik and catatan are required', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id]);

    $this->actingAs($user)
        ->post(route('dosen.mahasiswa-asuh.bimbingan.store', $mahasiswa), [])
        ->assertSessionHasErrors(['topik', 'catatan']);
});
