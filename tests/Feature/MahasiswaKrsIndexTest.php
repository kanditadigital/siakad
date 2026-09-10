<?php

use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\User;

test('semester filter narrows the KRS list to the selected academic year semester', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $thisSemester = AcademicYearSemester::factory()->create();
    $otherSemester = AcademicYearSemester::factory()->create();

    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'academic_year_semester_id' => $thisSemester->id]);
    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'academic_year_semester_id' => $otherSemester->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.krs', ['academic_year_semester_id' => $thisSemester->id]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('mahasiswa/krs')
        ->has('krss', 1)
        ->where('krss.0.academic_year_semester.id', $thisSemester->id)
    );
});

test('academic year semester filter options only include periods the mahasiswa actually has KRS in', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $ownSemester = AcademicYearSemester::factory()->create();
    AcademicYearSemester::factory()->create(); // unrelated period, never used by this mahasiswa

    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'academic_year_semester_id' => $ownSemester->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.krs'));

    $response->assertInertia(fn ($page) => $page
        ->has('academicYearSemesters', 1)
        ->where('academicYearSemesters.0.id', $ownSemester->id)
    );
});

test('krs pdf export streams inline for preview instead of forcing a download', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $mk = MataKuliah::factory()->create(['sks' => 3]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id]);
    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id, 'status' => 'disetujui']);

    $response = $this->actingAs($user)->get(route('mahasiswa.krs.export-pdf'));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    $disposition = $response->headers->get('content-disposition');
    expect($disposition)->toContain('inline');
    expect($disposition)->not->toContain('attachment');
});

test('krs pdf export respects the semester filter', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $thisSemester = AcademicYearSemester::factory()->create();
    $otherSemester = AcademicYearSemester::factory()->create();

    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'academic_year_semester_id' => $thisSemester->id]);
    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'academic_year_semester_id' => $otherSemester->id]);

    $response = $this->actingAs($user)->get(route('mahasiswa.krs.export-pdf', ['academic_year_semester_id' => $thisSemester->id]));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});
