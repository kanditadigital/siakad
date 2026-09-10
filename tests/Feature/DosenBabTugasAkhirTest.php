<?php

use App\Models\BabTugasAkhir;
use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\User;

test('advancing to penyusunan_bab seeds the default Bab 1 through Bab 5 checklist', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen->id,
        'tahap_saat_ini' => 'seminar_proposal',
    ]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan));

    $bimbingan->refresh();
    expect($bimbingan->tahap_saat_ini)->toBe('penyusunan_bab');
    expect($bimbingan->babTugasAkhir()->pluck('nama')->all())->toBe(['Bab 1', 'Bab 2', 'Bab 3', 'Bab 4', 'Bab 5']);
});

test('advancing past penyusunan_bab does not reseed or duplicate the checklist', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen->id,
        'tahap_saat_ini' => 'penyusunan_bab',
    ]);
    BabTugasAkhir::factory()->count(5)->create(['bimbingan_tugas_akhir_id' => $bimbingan->id]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan));

    expect($bimbingan->babTugasAkhir()->count())->toBe(5);
});

test('pembimbing can add a bab checklist item', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id]);
    BabTugasAkhir::factory()->create(['bimbingan_tugas_akhir_id' => $bimbingan->id, 'nama' => 'Bab 1', 'urutan' => 0]);

    $response = $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.bab.store', $bimbingan), [
        'nama' => 'Lampiran',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('bab_tugas_akhir', [
        'bimbingan_tugas_akhir_id' => $bimbingan->id,
        'nama' => 'Lampiran',
        'urutan' => 1,
    ]);
});

test('nama is required to add a bab item', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.bab.store', $bimbingan), [
        'nama' => '',
    ])->assertSessionHasErrors('nama');
});

test('pembimbing can toggle a bab item between selesai and belum selesai', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id]);
    $bab = BabTugasAkhir::factory()->create(['bimbingan_tugas_akhir_id' => $bimbingan->id, 'selesai' => false]);

    $this->actingAs($user)->patch(route('dosen.bimbingan-tugas-akhir.bab.toggle', [$bimbingan, $bab]));
    expect($bab->fresh()->selesai)->toBeTrue();
    expect($bab->fresh()->selesai_pada)->not->toBeNull();

    $this->actingAs($user)->patch(route('dosen.bimbingan-tugas-akhir.bab.toggle', [$bimbingan, $bab]));
    expect($bab->fresh()->selesai)->toBeFalse();
    expect($bab->fresh()->selesai_pada)->toBeNull();
});

test('pembimbing can delete a bab item', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id]);
    $bab = BabTugasAkhir::factory()->create(['bimbingan_tugas_akhir_id' => $bimbingan->id]);

    $response = $this->actingAs($user)->delete(route('dosen.bimbingan-tugas-akhir.bab.destroy', [$bimbingan, $bab]));

    $response->assertRedirect();
    $this->assertModelMissing($bab);
});

test('pembimbing 2 has the same bab checklist rights as pembimbing 1', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_2_id' => $dosen->id]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.bab.store', $bimbingan), [
        'nama' => 'Bab 1',
    ])->assertRedirect();
});

test('a dosen who is not pembimbing cannot manage the bab checklist', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create();
    $bab = BabTugasAkhir::factory()->create(['bimbingan_tugas_akhir_id' => $bimbingan->id]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.bab.store', $bimbingan), ['nama' => 'x'])->assertForbidden();
    $this->actingAs($user)->patch(route('dosen.bimbingan-tugas-akhir.bab.toggle', [$bimbingan, $bab]))->assertForbidden();
    $this->actingAs($user)->delete(route('dosen.bimbingan-tugas-akhir.bab.destroy', [$bimbingan, $bab]))->assertForbidden();
});

test('a bab item belonging to a different bimbingan cannot be toggled or deleted through this bimbingan', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id]);
    $otherBimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id]);
    $foreignBab = BabTugasAkhir::factory()->create(['bimbingan_tugas_akhir_id' => $otherBimbingan->id]);

    $this->actingAs($user)->patch(route('dosen.bimbingan-tugas-akhir.bab.toggle', [$bimbingan, $foreignBab]))->assertNotFound();
    $this->actingAs($user)->delete(route('dosen.bimbingan-tugas-akhir.bab.destroy', [$bimbingan, $foreignBab]))->assertNotFound();
});
