<?php

use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\PengajuanJudulTa;
use App\Models\User;

test('the page lists the mahasiswa own pengajuan and remaining slots', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'ditolak']);

    $response = $this->actingAs($user)->get(route('mahasiswa.pengajuan-judul-ta.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('pengajuan', 2)
        ->where('sisaSlot', 2)
        ->where('batasAktif', 3)
        ->where('bimbingan', null)
    );
});

test('the page exposes the bimbingan with pembimbing and tahapan once a judul is approved', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $pembimbing1 = Dosen::factory()->create(['nama' => 'Dr. Budi']);
    BimbinganTugasAkhir::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'judul' => 'Sistem Informasi Akademik',
        'pembimbing_1_id' => $pembimbing1->id,
        'tahap_saat_ini' => 'penyusunan_proposal',
    ]);

    $response = $this->actingAs($user)->get(route('mahasiswa.pengajuan-judul-ta.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('bimbingan.judul', 'Sistem Informasi Akademik')
        ->where('bimbingan.pembimbing1.nama', 'Dr. Budi')
        ->where('bimbingan.tahap_saat_ini', 'penyusunan_proposal')
        ->where('bimbingan.acc_pembimbing_1_pada', null)
        ->where('bimbingan.acc_pembimbing_2_pada', null)
        ->has('tahapan')
    );
});

test('mahasiswa can submit a judul proposal', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->post(route('mahasiswa.pengajuan-judul-ta.store'), [
        'judul' => 'Sistem Informasi Akademik Berbasis Web',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('pengajuan_judul_ta', [
        'mahasiswa_id' => $mahasiswa->id,
        'judul' => 'Sistem Informasi Akademik Berbasis Web',
        'status' => 'pending',
    ]);
});

test('judul is required', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    Mahasiswa::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)->post(route('mahasiswa.pengajuan-judul-ta.store'), [
        'judul' => '',
    ])->assertSessionHasErrors('judul');
});

test('mahasiswa cannot submit more than 3 active judul', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);

    $this->actingAs($user)->post(route('mahasiswa.pengajuan-judul-ta.store'), [
        'judul' => 'Judul Keempat',
    ])->assertSessionHasErrors('judul');

    expect($mahasiswa->pengajuanJudulTa()->count())->toBe(3);
});

test('a rejected judul frees up a slot for resubmission', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'ditolak']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'ditolak']);
    PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'ditolak']);

    $this->actingAs($user)->post(route('mahasiswa.pengajuan-judul-ta.store'), [
        'judul' => 'Judul Baru Setelah Ditolak',
    ])->assertSessionHasNoErrors();

    $this->assertDatabaseHas('pengajuan_judul_ta', [
        'mahasiswa_id' => $mahasiswa->id,
        'judul' => 'Judul Baru Setelah Ditolak',
    ]);
});

test('mahasiswa can delete a pending judul', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);

    $response = $this->actingAs($user)->delete(route('mahasiswa.pengajuan-judul-ta.destroy', $pengajuan));

    $response->assertRedirect();
    $this->assertModelMissing($pengajuan);
});

test('mahasiswa cannot delete an already-decided judul', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $this->actingAs($user)->delete(route('mahasiswa.pengajuan-judul-ta.destroy', $pengajuan))
        ->assertStatus(422);

    $this->assertModelExists($pengajuan);
});

test('a mahasiswa cannot delete another mahasiswa judul', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    Mahasiswa::factory()->create(['user_id' => $user->id]);

    $otherMahasiswa = Mahasiswa::factory()->create();
    $pengajuan = PengajuanJudulTa::factory()->create(['mahasiswa_id' => $otherMahasiswa->id, 'status' => 'pending']);

    $this->actingAs($user)->delete(route('mahasiswa.pengajuan-judul-ta.destroy', $pengajuan))
        ->assertForbidden();

    $this->assertModelExists($pengajuan);
});
