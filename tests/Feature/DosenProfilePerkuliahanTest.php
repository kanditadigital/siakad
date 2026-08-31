<?php

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\User;

test('dosen can view their profile page', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    Kelas::factory()->create(['dosen_id' => $dosen->id]);

    $response = $this->actingAs($user)->get(route('dosen.profil.show'));

    $response->assertOk();
});

test('dosen can view their perkuliahan page', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    Kelas::factory()->create(['dosen_id' => $dosen->id]);

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.index'));

    $response->assertOk();
});
