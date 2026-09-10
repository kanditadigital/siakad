<?php

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Rps;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('dosen can upload rps for their own kelas', function () {
    Storage::fake(config('filesystems.uploads'));

    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $kelas = Kelas::factory()->create(['dosen_id' => $dosen->id]);

    $response = $this->actingAs($user)->post(route('dosen.perkuliahan.rps.upload', $kelas->id), [
        'file' => UploadedFile::fake()->create('rps.pdf', 500, 'application/pdf'),
    ]);

    $response->assertRedirect();

    $rps = Rps::where('kelas_id', $kelas->id)->first();
    expect($rps)->not->toBeNull()
        ->and($rps->status)->toBe('sudah_upload');
    Storage::disk(config('filesystems.uploads'))->assertExists($rps->file_path);
});

test('dosen cannot upload rps for a kelas they do not own', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $otherKelas = Kelas::factory()->create();

    $response = $this->actingAs($user)->post(route('dosen.perkuliahan.rps.upload', $otherKelas->id), [
        'file' => UploadedFile::fake()->create('rps.pdf', 500, 'application/pdf'),
    ]);

    $response->assertForbidden();
});

test('admin can approve a submitted rps', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $rps = Rps::factory()->create(['status' => 'sudah_upload', 'file_path' => 'rps/file.pdf']);

    $response = $this->actingAs($admin)->patch(route('admin.rps.approve', $rps->uuid));

    $response->assertRedirect();
    expect($rps->fresh()->status)->toBe('disetujui');
});

test('admin can request revision with a note', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $rps = Rps::factory()->create(['status' => 'sudah_upload', 'file_path' => 'rps/file.pdf']);

    $response = $this->actingAs($admin)->patch(route('admin.rps.request-revision', $rps->uuid), [
        'catatan' => 'Tambahkan referensi terbaru',
    ]);

    $response->assertRedirect();
    $rps->refresh();
    expect($rps->status)->toBe('perlu_revisi')
        ->and($rps->catatan)->toBe('Tambahkan referensi terbaru');
});

test('rps cannot be approved when still belum_upload', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $rps = Rps::factory()->create(['status' => 'belum_upload']);

    $response = $this->actingAs($admin)->patch(route('admin.rps.approve', $rps->uuid));

    $response->assertStatus(422);
});
