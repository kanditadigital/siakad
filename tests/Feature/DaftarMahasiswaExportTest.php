<?php

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\User;

test('dosen can export the enrolled mahasiswa list for their own kelas', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $kelas = Kelas::factory()->create(['dosen_id' => $dosen->id]);
    Krs::factory()->create(['kelas_id' => $kelas->id, 'status' => 'disetujui']);

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.export-mahasiswa', $kelas->id));

    $response->assertOk();
});

test('dosen cannot export the mahasiswa list for a kelas they do not own', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $otherKelas = Kelas::factory()->create();

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.export-mahasiswa', $otherKelas->id));

    $response->assertForbidden();
});
