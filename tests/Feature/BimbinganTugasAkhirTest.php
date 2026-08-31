<?php

use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\User;

test('dosen sees bimbingan where they are pembimbing 1 or 2', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $other = Dosen::factory()->create();

    $asP1 = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id, 'pembimbing_2_id' => null]);
    $asP2 = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $other->id, 'pembimbing_2_id' => $dosen->id]);
    BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $other->id, 'pembimbing_2_id' => null]);

    $response = $this->actingAs($user)->get(route('dosen.bimbingan-tugas-akhir.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dosen/bimbingan-tugas-akhir/index')
        ->has('bimbingans', 2)
    );
});

test('dosen can add a new bimbingan and is recorded as pembimbing 1', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $mahasiswa = Mahasiswa::factory()->create(['status' => 'aktif']);

    $response = $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.store'), [
        'mahasiswa_id' => $mahasiswa->id,
        'judul' => 'Implementasi Sistem X',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('bimbingan_tugas_akhir', [
        'mahasiswa_id' => $mahasiswa->id,
        'pembimbing_1_id' => $dosen->id,
        'status' => 'aktif',
    ]);
});

test('dosen can update the status of their own bimbingan', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id, 'status' => 'aktif']);

    $response = $this->actingAs($user)->put(route('dosen.bimbingan-tugas-akhir.update', $bimbingan->uuid), [
        'status' => 'revisi',
        'catatan' => 'Perlu revisi bab 3',
    ]);

    $response->assertRedirect();
    expect($bimbingan->fresh()->status)->toBe('revisi');
});

test('dosen cannot update a bimbingan they do not supervise', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create();

    $response = $this->actingAs($user)->put(route('dosen.bimbingan-tugas-akhir.update', $bimbingan->uuid), [
        'status' => 'revisi',
    ]);

    $response->assertForbidden();
});
