<?php

use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\User;

test('pembimbing can view the progress detail page', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id]);

    $response = $this->actingAs($user)->get(route('dosen.bimbingan-tugas-akhir.show', $bimbingan));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dosen/bimbingan-tugas-akhir/show')
        ->where('bimbingan.tahap_saat_ini', 'pengajuan_judul')
        ->where('viewerPembimbingSlot', 1)
    );
});

test('a dosen who is not pembimbing 1 or 2 cannot view the progress detail page', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create();

    $this->actingAs($user)->get(route('dosen.bimbingan-tugas-akhir.show', $bimbingan))->assertForbidden();
});

test('a bimbingan with only pembimbing 1 advances the tahap on a single approval', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen->id,
        'pembimbing_2_id' => null,
        'tahap_saat_ini' => 'pengajuan_judul',
    ]);

    $response = $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan));

    $response->assertRedirect();
    $bimbingan->refresh();
    expect($bimbingan->tahap_saat_ini)->toBe('penyusunan_proposal');
    expect($bimbingan->acc_pembimbing_1_pada)->toBeNull();
    $this->assertDatabaseHas('progress_tugas_akhir', [
        'bimbingan_tugas_akhir_id' => $bimbingan->id,
        'tipe' => 'selesai',
        'tahap' => 'pengajuan_judul',
    ]);
});

test('a bimbingan with two pembimbing only advances once both approve', function () {
    $user1 = User::factory()->create(['role' => 'dosen']);
    $dosen1 = Dosen::factory()->create(['user_id' => $user1->id]);
    $user2 = User::factory()->create(['role' => 'dosen']);
    $dosen2 = Dosen::factory()->create(['user_id' => $user2->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen1->id,
        'pembimbing_2_id' => $dosen2->id,
        'tahap_saat_ini' => 'pengajuan_judul',
    ]);

    $this->actingAs($user1)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan));

    $bimbingan->refresh();
    expect($bimbingan->tahap_saat_ini)->toBe('pengajuan_judul');
    expect($bimbingan->acc_pembimbing_1_pada)->not->toBeNull();
    expect($bimbingan->acc_pembimbing_2_pada)->toBeNull();

    $this->actingAs($user2)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan));

    $bimbingan->refresh();
    expect($bimbingan->tahap_saat_ini)->toBe('penyusunan_proposal');
    expect($bimbingan->acc_pembimbing_1_pada)->toBeNull();
    expect($bimbingan->acc_pembimbing_2_pada)->toBeNull();
});

test('a pembimbing can toggle off their own approval before the other approves', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen->id,
        'pembimbing_2_id' => Dosen::factory(),
        'tahap_saat_ini' => 'pengajuan_judul',
    ]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan));
    expect($bimbingan->refresh()->acc_pembimbing_1_pada)->not->toBeNull();

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan));
    expect($bimbingan->refresh()->acc_pembimbing_1_pada)->toBeNull();
    expect($bimbingan->tahap_saat_ini)->toBe('pengajuan_judul');
});

test('marking the last tahap (sidang) complete sets selesai_pada instead of advancing', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen->id,
        'pembimbing_2_id' => null,
        'tahap_saat_ini' => 'sidang',
    ]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan));

    $bimbingan->refresh();
    expect($bimbingan->tahap_saat_ini)->toBe('sidang');
    expect($bimbingan->selesai_pada)->not->toBeNull();
});

test('a tugas akhir that is already finished cannot be approved again', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen->id,
        'tahap_saat_ini' => 'sidang',
        'selesai_pada' => now(),
    ]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan))
        ->assertStatus(422);
});

test('pembimbing can add a revisi note without advancing the tahap', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen->id,
        'tahap_saat_ini' => 'penyusunan_bab',
    ]);

    $response = $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.revisi', $bimbingan), [
        'catatan' => 'Bab 2 perlu diperbaiki',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('bimbingan_tugas_akhir', ['id' => $bimbingan->id, 'tahap_saat_ini' => 'penyusunan_bab']);
    $this->assertDatabaseHas('progress_tugas_akhir', [
        'bimbingan_tugas_akhir_id' => $bimbingan->id,
        'tipe' => 'revisi',
        'tahap' => 'penyusunan_bab',
        'catatan' => 'Bab 2 perlu diperbaiki',
    ]);
});

test('revisi catatan is required', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_1_id' => $dosen->id]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.revisi', $bimbingan), [
        'catatan' => '',
    ])->assertSessionHasErrors('catatan');
});

test('pembimbing can change the judul and it is logged with old and new title', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create([
        'pembimbing_1_id' => $dosen->id,
        'judul' => 'Judul Lama',
    ]);

    $response = $this->actingAs($user)->patch(route('dosen.bimbingan-tugas-akhir.ganti-judul', $bimbingan), [
        'judul' => 'Judul Baru',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('bimbingan_tugas_akhir', ['id' => $bimbingan->id, 'judul' => 'Judul Baru']);
    $log = $bimbingan->progress()->where('tipe', 'ganti_judul')->first();
    expect($log)->not->toBeNull();
    expect($log->catatan)->toContain('Judul Lama')->toContain('Judul Baru');
});

test('pembimbing 2 has the same progress management rights as pembimbing 1', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create(['pembimbing_2_id' => $dosen->id]);

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan))
        ->assertRedirect();
});

test('a dosen who is not pembimbing cannot approve tahap, add revisi, or change judul', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $bimbingan = BimbinganTugasAkhir::factory()->create();

    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.tahap.setujui', $bimbingan))->assertForbidden();
    $this->actingAs($user)->post(route('dosen.bimbingan-tugas-akhir.revisi', $bimbingan), ['catatan' => 'x'])->assertForbidden();
    $this->actingAs($user)->patch(route('dosen.bimbingan-tugas-akhir.ganti-judul', $bimbingan), ['judul' => 'x'])->assertForbidden();
});
