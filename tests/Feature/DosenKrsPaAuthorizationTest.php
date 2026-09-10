<?php

use App\Models\AcademicYearSemester;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\User;

/**
 * @return array{0: User, 1: Dosen}
 */
function dosenPa(): array
{
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    return [$user, $dosen];
}

function krsPendingForMahasiswaAsuh(Dosen $dosen): Krs
{
    $mahasiswa = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'pa_dosen_id' => $dosen->id,
    ]);
    $ays = AcademicYearSemester::factory()->create();
    $kelas = Kelas::factory()->create();

    return Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'pending',
    ]);
}

test('PA sees only pending KRS from their own mahasiswa asuh', function () {
    [$user, $dosen] = dosenPa();
    $own = krsPendingForMahasiswaAsuh($dosen);

    [, $otherDosen] = dosenPa();
    krsPendingForMahasiswaAsuh($otherDosen);

    $response = $this->actingAs($user)->get(route('dosen.krs-pa.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('krss.data', 1)
        ->where('krss.data.0.id', $own->id)
    );
});

test('PA cannot view a KRS belonging to another PA mahasiswa asuh', function () {
    [$user] = dosenPa();
    [, $otherDosen] = dosenPa();
    $krs = krsPendingForMahasiswaAsuh($otherDosen);

    $this->actingAs($user)
        ->get(route('dosen.krs-pa.show', $krs))
        ->assertForbidden();
});

test('PA cannot approve a KRS belonging to another PA mahasiswa asuh', function () {
    [$user] = dosenPa();
    [, $otherDosen] = dosenPa();
    $krs = krsPendingForMahasiswaAsuh($otherDosen);

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.approve', $krs))
        ->assertForbidden();

    expect($krs->fresh()->status)->toBe('pending');
});

test('PA cannot reject or request revision on a KRS outside their mahasiswa asuh', function () {
    [$user] = dosenPa();
    [, $otherDosen] = dosenPa();
    $krs = krsPendingForMahasiswaAsuh($otherDosen);

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.reject', $krs), ['catatan' => 'Tidak sesuai'])
        ->assertForbidden();

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.revisi', $krs), ['catatan' => 'Kurangi SKS'])
        ->assertForbidden();

    expect($krs->fresh()->status)->toBe('pending');
});

test('PA can approve a pending KRS of their own mahasiswa asuh', function () {
    [$user, $dosen] = dosenPa();
    $krs = krsPendingForMahasiswaAsuh($dosen);

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.approve', $krs))
        ->assertRedirect();

    expect($krs->fresh()->status)->toBe('disetujui');
});

test('PA approving beyond the flat max SKS is rejected', function () {
    [$user, $dosen] = dosenPa();
    $mahasiswa = Mahasiswa::factory()->create([
        'program_studi_id' => $dosen->program_studi_id,
        'pa_dosen_id' => $dosen->id,
    ]);
    $ays = AcademicYearSemester::factory()->create();
    $mataKuliah = MataKuliah::factory()->create(['sks' => 30]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mataKuliah->id]);

    $krs = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.approve', $krs))
        ->assertSessionHasErrors('krs');

    expect($krs->fresh()->status)->toBe('pending');
});

test('PA rejecting a KRS requires a catatan and records it to bimbingan akademik', function () {
    [$user, $dosen] = dosenPa();
    $krs = krsPendingForMahasiswaAsuh($dosen);

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.reject', $krs), [])
        ->assertSessionHasErrors('catatan');

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.reject', $krs), ['catatan' => 'Bentrok jadwal dengan kelas lain'])
        ->assertRedirect();

    $krs->refresh();
    expect($krs->status)->toBe('ditolak');
    expect($krs->catatan)->toBe('Bentrok jadwal dengan kelas lain');

    $this->assertDatabaseHas('bimbingan_akademik', [
        'dosen_id' => $dosen->id,
        'mahasiswa_id' => $krs->mahasiswa_id,
        'krs_id' => $krs->id,
        'catatan' => 'Bentrok jadwal dengan kelas lain',
    ]);
});

test('PA requesting revision sets status to revisi with catatan', function () {
    [$user, $dosen] = dosenPa();
    $krs = krsPendingForMahasiswaAsuh($dosen);

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.revisi', $krs), ['catatan' => 'Kurangi SKS semester ini'])
        ->assertRedirect();

    $krs->refresh();
    expect($krs->status)->toBe('revisi');
    expect($krs->catatan)->toBe('Kurangi SKS semester ini');
});

test('PA cannot act twice on a KRS that is no longer pending', function () {
    [$user, $dosen] = dosenPa();
    $krs = krsPendingForMahasiswaAsuh($dosen);
    $krs->update(['status' => 'disetujui']);

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.approve', $krs))
        ->assertStatus(422);

    $this->actingAs($user)
        ->patch(route('dosen.krs-pa.reject', $krs), ['catatan' => 'x'])
        ->assertStatus(422);
});
