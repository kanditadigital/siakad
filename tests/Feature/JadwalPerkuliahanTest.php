<?php

use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\User;

test('mahasiswa can view their enrolled class schedule', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $semester = AcademicYearSemester::factory()->create();
    $kelas = Kelas::factory()->create();

    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas->id,
        'academic_year_semester_id' => $semester->id,
        'status' => 'disetujui',
    ]);

    // Pending KRS should not show up on the schedule.
    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'academic_year_semester_id' => $semester->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($user)->get(route('mahasiswa.jadwal'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('mahasiswa/jadwal')
        ->has('krss', 1)
    );
});

test('guests cannot view the jadwal page', function () {
    $response = $this->get(route('mahasiswa.jadwal'));

    $response->assertRedirect(route('login'));
});
