<?php

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Materi;
use App\Models\Nilai;
use App\Models\Presensi;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Build a dosen (with its user) plus a kelas they teach.
 *
 * @return array{0: User, 1: Dosen, 2: Kelas}
 */
function dosenWithKelas(): array
{
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $kelas = Kelas::factory()->create(['dosen_id' => $dosen->id]);

    return [$user, $dosen, $kelas];
}

test('dosen cannot update nilai of a kelas they do not teach', function () {
    [$attacker] = dosenWithKelas();
    [, , $victimKelas] = dosenWithKelas();

    $krs = Krs::factory()->create(['kelas_id' => $victimKelas->id, 'status' => 'disetujui']);

    $response = $this->actingAs($attacker)
        ->put(route('dosen.perkuliahan.nilai.update', $krs), [
            'nilai' => 'E',
            'nilai_angka' => 0,
        ]);

    $response->assertForbidden();
    expect(Nilai::where('krs_id', $krs->id)->exists())->toBeFalse();
    expect($krs->fresh()->status)->toBe('disetujui');
});

test('dosen updating nilai writes to the nilai table and leaves krs status untouched', function () {
    [$user, , $kelas] = dosenWithKelas();

    $krs = Krs::factory()->create(['kelas_id' => $kelas->id, 'status' => 'disetujui']);

    $response = $this->actingAs($user)
        ->put(route('dosen.perkuliahan.nilai.update', $krs), [
            'nilai' => 'B+',
            'nilai_angka' => 3.5,
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('nilai', [
        'krs_id' => $krs->id,
        'grade' => 'B+',
        'status' => 'tercatat',
    ]);
    expect((float) Nilai::where('krs_id', $krs->id)->value('nilai'))->toBe(3.5);
    expect($krs->fresh()->status)->toBe('disetujui');
});

test('dosen cannot record presensi for a kelas they do not teach', function () {
    [$attacker] = dosenWithKelas();
    [, , $victimKelas] = dosenWithKelas();

    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create([
        'kelas_id' => $victimKelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'status' => 'disetujui',
    ]);

    $response = $this->actingAs($attacker)
        ->post(route('dosen.perkuliahan.presensi.store'), [
            'kelas_id' => $victimKelas->id,
            'mahasiswa_id' => $mahasiswa->id,
            'tanggal' => '2026-09-01',
            'status' => 'alpha',
        ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('presensi', 0);
});

test('dosen cannot record presensi for a mahasiswa not enrolled in their kelas', function () {
    [$user, , $kelas] = dosenWithKelas();

    $outsider = Mahasiswa::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('dosen.perkuliahan.presensi.store'), [
            'kelas_id' => $kelas->id,
            'mahasiswa_id' => $outsider->id,
            'tanggal' => '2026-09-01',
            'status' => 'hadir',
        ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('presensi', 0);
});

test('dosen cannot update presensi belonging to another kelas', function () {
    [$attacker] = dosenWithKelas();
    [, , $victimKelas] = dosenWithKelas();

    $presensi = Presensi::create([
        'kelas_id' => $victimKelas->id,
        'mahasiswa_id' => Mahasiswa::factory()->create()->id,
        'tanggal' => '2026-09-01',
        'status' => 'hadir',
    ]);

    $response = $this->actingAs($attacker)
        ->put(route('dosen.perkuliahan.presensi.update', $presensi), ['status' => 'alpha']);

    $response->assertForbidden();
    expect($presensi->fresh()->status)->toBe('hadir');
});

test('dosen cannot create materi in a kelas they do not teach', function () {
    Storage::fake(config('filesystems.uploads'));

    [$attacker] = dosenWithKelas();
    [, , $victimKelas] = dosenWithKelas();

    $response = $this->actingAs($attacker)
        ->post(route('dosen.perkuliahan.materi.store'), [
            'kelas_id' => $victimKelas->id,
            'judul' => 'Disusupkan',
            'file' => UploadedFile::fake()->create('materi.pdf', 100, 'application/pdf'),
        ]);

    $response->assertForbidden();
    $this->assertDatabaseCount('materi', 0);
});

test('dosen cannot update or delete materi of another kelas', function () {
    [$attacker] = dosenWithKelas();
    [, , $victimKelas] = dosenWithKelas();

    $materi = Materi::create(['kelas_id' => $victimKelas->id, 'judul' => 'Materi Asli']);

    $this->actingAs($attacker)
        ->put(route('dosen.perkuliahan.materi.update', $materi), ['judul' => 'Diubah'])
        ->assertForbidden();

    $this->actingAs($attacker)
        ->delete(route('dosen.perkuliahan.materi.destroy', $materi))
        ->assertForbidden();

    expect($materi->fresh()->judul)->toBe('Materi Asli');
});

test('dosen can still manage materi in their own kelas', function () {
    $disk = Storage::fake(config('filesystems.uploads'));

    [$user, , $kelas] = dosenWithKelas();

    $this->actingAs($user)
        ->post(route('dosen.perkuliahan.materi.store'), [
            'kelas_id' => $kelas->id,
            'judul' => 'Pertemuan 1',
            'file' => UploadedFile::fake()->create('pertemuan-1.pdf', 100, 'application/pdf'),
        ])
        ->assertRedirect();

    $materi = Materi::firstOrFail();
    $disk->assertExists($materi->file_path);

    $this->actingAs($user)
        ->delete(route('dosen.perkuliahan.materi.destroy', $materi))
        ->assertRedirect();

    $this->assertDatabaseCount('materi', 0);
    $disk->assertMissing($materi->file_path);
});

test('dosen cannot release a mahasiswa asuh of another dosen', function () {
    [$attacker] = dosenWithKelas();
    $otherDosen = Dosen::factory()->create();

    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => $otherDosen->id]);

    $this->actingAs($attacker)
        ->delete(route('dosen.mahasiswa-asuh.destroy', $mahasiswa))
        ->assertForbidden();

    expect($mahasiswa->fresh()->pa_dosen_id)->toBe($otherDosen->id);
});

test('dosen cannot claim a mahasiswa already assigned to another dosen', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $otherDosen = Dosen::factory()->create(['program_studi_id' => $dosen->program_studi_id]);

    $mahasiswa = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'pa_dosen_id' => $otherDosen->id,
    ]);

    $this->actingAs($user)
        ->put(route('dosen.mahasiswa-asuh.update', $mahasiswa))
        ->assertForbidden();

    expect($mahasiswa->fresh()->pa_dosen_id)->toBe($otherDosen->id);
});

test('dosen can claim an unassigned mahasiswa in their own program studi', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $mahasiswa = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'pa_dosen_id' => null,
    ]);

    $this->actingAs($user)
        ->put(route('dosen.mahasiswa-asuh.update', $mahasiswa))
        ->assertRedirect();

    expect($mahasiswa->fresh()->pa_dosen_id)->toBe($dosen->id);
});

test('dosen cannot claim a mahasiswa from another program studi', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => null]);

    $this->actingAs($user)
        ->put(route('dosen.mahasiswa-asuh.update', $mahasiswa))
        ->assertForbidden();

    expect($mahasiswa->fresh()->pa_dosen_id)->toBeNull();
});
