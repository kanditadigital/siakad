<?php

use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Nilai;

// ---------------------------------------------------------------------
// Krs::adaBentrokJadwal
// ---------------------------------------------------------------------

test('detects a schedule clash on the same day with overlapping time', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $ays = AcademicYearSemester::factory()->create();

    $existingKelas = Kelas::factory()->create([
        'hari' => 'Senin',
        'jam_mulai' => '08:00',
        'jam_selesai' => '10:00',
    ]);
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $existingKelas->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'disetujui',
    ]);

    $newKelas = Kelas::factory()->create([
        'hari' => 'Senin',
        'jam_mulai' => '09:00',
        'jam_selesai' => '11:00',
    ]);

    expect(Krs::adaBentrokJadwal($mahasiswa->id, $ays->id, $newKelas))->toBeTrue();
});

test('does not flag a clash on a different day', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $ays = AcademicYearSemester::factory()->create();

    $existingKelas = Kelas::factory()->create([
        'hari' => 'Senin',
        'jam_mulai' => '08:00',
        'jam_selesai' => '10:00',
    ]);
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $existingKelas->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'disetujui',
    ]);

    $newKelas = Kelas::factory()->create([
        'hari' => 'Selasa',
        'jam_mulai' => '08:00',
        'jam_selesai' => '10:00',
    ]);

    expect(Krs::adaBentrokJadwal($mahasiswa->id, $ays->id, $newKelas))->toBeFalse();
});

test('does not flag a clash for back-to-back classes that do not overlap', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $ays = AcademicYearSemester::factory()->create();

    $existingKelas = Kelas::factory()->create([
        'hari' => 'Senin',
        'jam_mulai' => '08:00',
        'jam_selesai' => '10:00',
    ]);
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $existingKelas->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'disetujui',
    ]);

    $newKelas = Kelas::factory()->create([
        'hari' => 'Senin',
        'jam_mulai' => '10:00',
        'jam_selesai' => '12:00',
    ]);

    expect(Krs::adaBentrokJadwal($mahasiswa->id, $ays->id, $newKelas))->toBeFalse();
});

test('ignores a pending (not yet approved) krs when checking for clashes', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $ays = AcademicYearSemester::factory()->create();

    $existingKelas = Kelas::factory()->create([
        'hari' => 'Senin',
        'jam_mulai' => '08:00',
        'jam_selesai' => '10:00',
    ]);
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $existingKelas->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'pending',
    ]);

    $newKelas = Kelas::factory()->create([
        'hari' => 'Senin',
        'jam_mulai' => '09:00',
        'jam_selesai' => '11:00',
    ]);

    expect(Krs::adaBentrokJadwal($mahasiswa->id, $ays->id, $newKelas))->toBeFalse();
});

test('reports no clash when the new kelas has no schedule set yet', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $ays = AcademicYearSemester::factory()->create();

    $newKelas = Kelas::factory()->create([
        'hari' => null,
        'jam_mulai' => null,
        'jam_selesai' => null,
    ]);

    expect(Krs::adaBentrokJadwal($mahasiswa->id, $ays->id, $newKelas))->toBeFalse();
});

// ---------------------------------------------------------------------
// Krs::prasyaratTerpenuhi
// ---------------------------------------------------------------------

test('prasyarat is satisfied when the mata kuliah has none', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $mataKuliah = MataKuliah::factory()->create(['prasyarat_mata_kuliah_id' => null]);

    expect(Krs::prasyaratTerpenuhi($mahasiswa->id, $mataKuliah))->toBeTrue();
});

test('prasyarat is not satisfied when the mahasiswa never took the prerequisite', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $prasyarat = MataKuliah::factory()->create();
    $mataKuliah = MataKuliah::factory()->create(['prasyarat_mata_kuliah_id' => $prasyarat->id]);

    expect(Krs::prasyaratTerpenuhi($mahasiswa->id, $mataKuliah))->toBeFalse();
});

test('prasyarat is not satisfied when the prerequisite was failed with D/E', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $prasyarat = MataKuliah::factory()->create();
    $mataKuliah = MataKuliah::factory()->create(['prasyarat_mata_kuliah_id' => $prasyarat->id]);

    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $prasyarat->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id, 'status' => 'disetujui']);
    Nilai::factory()->create(['krs_id' => $krs->id, 'grade' => 'E', 'nilai' => 0]);

    expect(Krs::prasyaratTerpenuhi($mahasiswa->id, $mataKuliah))->toBeFalse();
});

test('prasyarat is satisfied when the prerequisite was passed', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $prasyarat = MataKuliah::factory()->create();
    $mataKuliah = MataKuliah::factory()->create(['prasyarat_mata_kuliah_id' => $prasyarat->id]);

    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $prasyarat->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id, 'status' => 'disetujui']);
    Nilai::factory()->create(['krs_id' => $krs->id, 'grade' => 'B', 'nilai' => 3.0]);

    expect(Krs::prasyaratTerpenuhi($mahasiswa->id, $mataKuliah))->toBeTrue();
});

// ---------------------------------------------------------------------
// Krs::maxSksUntukIps
// ---------------------------------------------------------------------

test('maxSksUntukIps applies the documented tiers', function (?float $ips, int $expected) {
    expect(Krs::maxSksUntukIps($ips))->toBe($expected);
})->with([
    'no prior semester' => [null, Krs::DEFAULT_MAX_SKS],
    'ips 3.5 (top tier)' => [3.5, 24],
    'ips exactly 3.00' => [3.0, 24],
    'ips 2.75 (mid tier)' => [2.75, 21],
    'ips exactly 2.50' => [2.5, 21],
    'ips 2.20 (lower tier)' => [2.2, 18],
    'ips exactly 2.00' => [2.0, 18],
    'ips 1.50 (lowest tier)' => [1.5, 15],
]);
