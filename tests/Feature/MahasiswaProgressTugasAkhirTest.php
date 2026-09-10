<?php

use App\Models\BimbinganTugasAkhir;
use App\Models\Mahasiswa;
use App\Models\User;

test('mahasiswa with a bimbingan can add a catatan to the timeline', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['mahasiswa_id' => $mahasiswa->id]);

    $response = $this->actingAs($user)->post(route('mahasiswa.bimbingan-tugas-akhir.progress.store'), [
        'catatan' => 'Sudah submit draft Bab 1',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('progress_tugas_akhir', [
        'bimbingan_tugas_akhir_id' => $bimbingan->id,
        'tipe' => 'catatan',
        'catatan' => 'Sudah submit draft Bab 1',
        'dibuat_oleh_user_id' => $user->id,
    ]);
});

test('catatan is required', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    BimbinganTugasAkhir::factory()->create(['mahasiswa_id' => $mahasiswa->id]);

    $this->actingAs($user)->post(route('mahasiswa.bimbingan-tugas-akhir.progress.store'), [
        'catatan' => '',
    ])->assertSessionHasErrors('catatan');
});

test('a mahasiswa without a bimbingan tugas akhir cannot add a catatan', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    Mahasiswa::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->post(route('mahasiswa.bimbingan-tugas-akhir.progress.store'), [
        'catatan' => 'x',
    ])->assertNotFound();
});

test('adding a catatan does not change tahap_saat_ini', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'tahap_saat_ini' => 'penelitian',
    ]);

    $this->actingAs($user)->post(route('mahasiswa.bimbingan-tugas-akhir.progress.store'), [
        'catatan' => 'Update progres penelitian',
    ]);

    expect($bimbingan->fresh()->tahap_saat_ini)->toBe('penelitian');
});
