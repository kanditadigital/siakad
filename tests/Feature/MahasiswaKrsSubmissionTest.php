<?php

use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use App\Models\Setting;
use App\Models\User;

function actingMahasiswa(): array
{
    $programStudi = ProgramStudi::factory()->create();
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $user->id,
        'program_studi_id' => $programStudi->id,
    ]);

    return [$user, $mahasiswa, $programStudi];
}

test('create page lists only active kelas from the mahasiswa own program studi, excluding ones already taken', function () {
    [$user, $mahasiswa, $programStudi] = actingMahasiswa();
    $otherProdi = ProgramStudi::factory()->create();
    $ays = AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $ownMk = MataKuliah::factory()->create(['program_studi_id' => $programStudi->id]);
    $available = Kelas::factory()->create(['mata_kuliah_id' => $ownMk->id, 'status' => 'Aktif']);
    $alreadyTaken = Kelas::factory()->create(['mata_kuliah_id' => $ownMk->id, 'status' => 'Aktif']);
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $alreadyTaken->id,
        'academic_year_semester_id' => $ays->id,
    ]);

    $foreignMk = MataKuliah::factory()->create(['program_studi_id' => $otherProdi->id]);
    Kelas::factory()->create(['mata_kuliah_id' => $foreignMk->id, 'status' => 'Aktif']);

    $inactiveKelas = Kelas::factory()->create(['mata_kuliah_id' => $ownMk->id, 'status' => 'Tidak Aktif']);

    $response = $this->actingAs($user)->get(route('mahasiswa.krs.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('mahasiswa/krs/create')
        ->has('kelases', 1)
        ->where('kelases.0.id', $available->id)
    );

    expect($inactiveKelas)->not->toBeNull();
});

test('mahasiswa can submit a valid krs batch within sks limits', function () {
    [$user, $mahasiswa] = actingMahasiswa();
    Setting::setMany(['krs.sks_min' => 6, 'krs.sks_maks' => 24, 'krs.dibuka' => true]);
    $ays = AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $mk1 = MataKuliah::factory()->create(['program_studi_id' => $mahasiswa->program_studi_id, 'sks' => 3]);
    $mk2 = MataKuliah::factory()->create(['program_studi_id' => $mahasiswa->program_studi_id, 'sks' => 4]);
    $kelas1 = Kelas::factory()->create(['mata_kuliah_id' => $mk1->id, 'status' => 'Aktif']);
    $kelas2 = Kelas::factory()->create(['mata_kuliah_id' => $mk2->id, 'status' => 'Aktif']);

    $response = $this->actingAs($user)->post(route('mahasiswa.krs.store'), [
        'kelas_ids' => [$kelas1->id, $kelas2->id],
    ]);

    $response->assertRedirect(route('mahasiswa.krs'));
    $this->assertDatabaseHas('krs', [
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas1->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'pending',
    ]);
    $this->assertDatabaseHas('krs', [
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas2->id,
        'status' => 'pending',
    ]);
});

test('submission exceeding the configured sks maximum is rejected', function () {
    [$user, $mahasiswa] = actingMahasiswa();
    Setting::setMany(['krs.sks_min' => 6, 'krs.sks_maks' => 10]);
    AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $mk = MataKuliah::factory()->create(['program_studi_id' => $mahasiswa->program_studi_id, 'sks' => 12]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id, 'status' => 'Aktif']);

    $response = $this->actingAs($user)->post(route('mahasiswa.krs.store'), [
        'kelas_ids' => [$kelas->id],
    ]);

    $response->assertSessionHasErrors('kelas_ids');
    $this->assertDatabaseMissing('krs', ['kelas_id' => $kelas->id]);
});

test('submission below the configured sks minimum is rejected', function () {
    [$user, $mahasiswa] = actingMahasiswa();
    Setting::setMany(['krs.sks_min' => 12, 'krs.sks_maks' => 24]);
    AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $mk = MataKuliah::factory()->create(['program_studi_id' => $mahasiswa->program_studi_id, 'sks' => 3]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id, 'status' => 'Aktif']);

    $response = $this->actingAs($user)->post(route('mahasiswa.krs.store'), [
        'kelas_ids' => [$kelas->id],
    ]);

    $response->assertSessionHasErrors('kelas_ids');
    $this->assertDatabaseMissing('krs', ['kelas_id' => $kelas->id]);
});

test('submission is blocked when the krs period is closed', function () {
    [$user, $mahasiswa] = actingMahasiswa();
    Setting::setMany(['krs.dibuka' => false]);
    AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $mk = MataKuliah::factory()->create(['program_studi_id' => $mahasiswa->program_studi_id, 'sks' => 3]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id, 'status' => 'Aktif']);

    $this->actingAs($user)->get(route('mahasiswa.krs.create'))
        ->assertRedirect(route('mahasiswa.krs'));

    $response = $this->actingAs($user)->post(route('mahasiswa.krs.store'), [
        'kelas_ids' => [$kelas->id],
    ]);

    $response->assertStatus(422);
    $this->assertDatabaseMissing('krs', ['kelas_id' => $kelas->id]);
});

test('mahasiswa cannot submit a kelas belonging to another program studi', function () {
    [$user, $mahasiswa] = actingMahasiswa();
    Setting::setMany(['krs.sks_min' => 1, 'krs.sks_maks' => 24]);
    AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $otherProdi = ProgramStudi::factory()->create();
    $foreignMk = MataKuliah::factory()->create(['program_studi_id' => $otherProdi->id, 'sks' => 3]);
    $foreignKelas = Kelas::factory()->create(['mata_kuliah_id' => $foreignMk->id, 'status' => 'Aktif']);

    $response = $this->actingAs($user)->post(route('mahasiswa.krs.store'), [
        'kelas_ids' => [$foreignKelas->id],
    ]);

    $response->assertSessionHasErrors('kelas_ids');
    $this->assertDatabaseMissing('krs', ['kelas_id' => $foreignKelas->id]);
});

test('mahasiswa cannot submit a kelas already taken this period', function () {
    [$user, $mahasiswa] = actingMahasiswa();
    Setting::setMany(['krs.sks_min' => 1, 'krs.sks_maks' => 24]);
    $ays = AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $mk = MataKuliah::factory()->create(['program_studi_id' => $mahasiswa->program_studi_id, 'sks' => 3]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id, 'status' => 'Aktif']);
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $ays->id,
    ]);

    $response = $this->actingAs($user)->post(route('mahasiswa.krs.store'), [
        'kelas_ids' => [$kelas->id],
    ]);

    $response->assertSessionHasErrors('kelas_ids');
});

test('mahasiswa can resubmit a kelas after withdrawing its rejected entry', function () {
    [$user, $mahasiswa] = actingMahasiswa();
    Setting::setMany(['krs.sks_min' => 1, 'krs.sks_maks' => 24]);
    $ays = AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $mk = MataKuliah::factory()->create(['program_studi_id' => $mahasiswa->program_studi_id, 'sks' => 3]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id, 'status' => 'Aktif']);
    $rejected = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'ditolak',
    ]);

    // Rejected entries still occupy the kelas slot until withdrawn.
    $this->actingAs($user)->get(route('mahasiswa.krs.create'))
        ->assertInertia(fn ($page) => $page->has('kelases', 0));

    $this->actingAs($user)->delete(route('mahasiswa.krs.destroy', $rejected))
        ->assertRedirect();

    $this->actingAs($user)->get(route('mahasiswa.krs.create'))
        ->assertInertia(fn ($page) => $page
            ->has('kelases', 1)
            ->where('kelases.0.id', $kelas->id)
        );

    $response = $this->actingAs($user)->post(route('mahasiswa.krs.store'), [
        'kelas_ids' => [$kelas->id],
    ]);

    $response->assertRedirect(route('mahasiswa.krs'));
    $this->assertDatabaseHas('krs', [
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'status' => 'pending',
    ]);
});

test('Krs::maxSks and minSks read from Setting with sensible fallbacks', function () {
    expect(Krs::maxSks())->toBe(24);
    expect(Krs::minSks())->toBe(12);

    Setting::setMany(['krs.sks_maks' => 20, 'krs.sks_min' => 14]);

    expect(Krs::maxSks())->toBe(20);
    expect(Krs::minSks())->toBe(14);
});
