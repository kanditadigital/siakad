<?php

use App\Models\AcademicYearSemester;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Nilai;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('PA cannot view a mahasiswa who is not their own mahasiswa asuh', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => null]);

    $this->actingAs($user)
        ->get(route('dosen.mahasiswa-asuh.show', $mahasiswa))
        ->assertForbidden();
});

test('perkembangan akademik is ordered chronologically with running cumulative IPK', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id]);

    $semester1 = AcademicYearSemester::factory()->create(['tanggal_mulai' => '2025-01-01']);
    $semester2 = AcademicYearSemester::factory()->create(['tanggal_mulai' => '2025-08-01']);

    // Semester 1: one mata kuliah, 3 SKS, grade point 4.0 -> IPS 4.00
    $mk1 = MataKuliah::factory()->create(['sks' => 3]);
    $kelas1 = Kelas::factory()->create(['mata_kuliah_id' => $mk1->id]);
    $krs1 = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas1->id,
        'academic_year_semester_id' => $semester1->id,
        'status' => 'disetujui',
    ]);
    Nilai::factory()->create(['krs_id' => $krs1->id, 'grade' => 'A', 'nilai' => 4.0]);

    // Semester 2: one mata kuliah, 3 SKS, grade point 2.0 -> IPS 2.00, dragging IPK down
    $mk2 = MataKuliah::factory()->create(['sks' => 3]);
    $kelas2 = Kelas::factory()->create(['mata_kuliah_id' => $mk2->id]);
    $krs2 = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => $kelas2->id,
        'academic_year_semester_id' => $semester2->id,
        'status' => 'disetujui',
    ]);
    Nilai::factory()->create(['krs_id' => $krs2->id, 'grade' => 'C', 'nilai' => 2.0]);

    $perkembangan = $mahasiswa->perkembanganAkademik();

    expect($perkembangan)->toHaveCount(2);
    expect($perkembangan[0]['ips'])->toBe(4.0);
    expect($perkembangan[0]['ipk'])->toBe(4.0);
    expect($perkembangan[1]['ips'])->toBe(2.0);
    // Cumulative IPK after semester 2: (4*3 + 2*3) / 6 = 3.0
    expect($perkembangan[1]['ipk'])->toBe(3.0);

    expect($mahasiswa->hitungIpk())->toBe(3.0);
    expect($mahasiswa->totalSksLulus())->toBe(6);
});

test('mata kuliah bermasalah lists only D/E graded courses', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $ays = AcademicYearSemester::factory()->create();

    $lulus = MataKuliah::factory()->create(['nama_mk' => 'Lulus Baik']);
    $krsLulus = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => Kelas::factory()->create(['mata_kuliah_id' => $lulus->id])->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'disetujui',
    ]);
    Nilai::factory()->create(['krs_id' => $krsLulus->id, 'grade' => 'B', 'nilai' => 3.0]);

    $gagal = MataKuliah::factory()->create(['nama_mk' => 'Statistik']);
    $krsGagal = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => Kelas::factory()->create(['mata_kuliah_id' => $gagal->id])->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'disetujui',
    ]);
    Nilai::factory()->create(['krs_id' => $krsGagal->id, 'grade' => 'D', 'nilai' => 1.0]);

    $bermasalah = $mahasiswa->mataKuliahBermasalah();

    expect($bermasalah)->toHaveCount(1);
    expect($bermasalah[0]['mata_kuliah']->nama_mk)->toBe('Statistik');
    expect($bermasalah[0]['grade'])->toBe('D');
});

test('the mahasiswa asuh show page exposes academic progress and problem courses', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id]);

    $ays = AcademicYearSemester::factory()->create();
    $mk = MataKuliah::factory()->create();
    $krs = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => Kelas::factory()->create(['mata_kuliah_id' => $mk->id])->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'disetujui',
    ]);
    Nilai::factory()->create(['krs_id' => $krs->id, 'grade' => 'E', 'nilai' => 0]);

    $response = $this->actingAs($user)->get(route('dosen.mahasiswa-asuh.show', $mahasiswa));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dosen/mahasiswa-asuh/show')
        ->has('perkembanganAkademik', 1)
        ->has('mataKuliahBermasalah', 1)
        ->has('ringkasanPresensi')
        ->has('riwayatBimbingan')
    );
});

test('nilaiTerhitung is memoized so repeated academic stat calls do not re-query', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $ays = AcademicYearSemester::factory()->create();
    $mk = MataKuliah::factory()->create(['sks' => 3]);
    $krs = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => Kelas::factory()->create(['mata_kuliah_id' => $mk->id])->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'disetujui',
    ]);
    Nilai::factory()->create(['krs_id' => $krs->id, 'grade' => 'A', 'nilai' => 4.0]);

    DB::enableQueryLog();
    $mahasiswa->hitungIpk();
    $queriesAfterFirstCall = count(DB::getQueryLog());

    $mahasiswa->hitungIpk();
    $mahasiswa->totalSksLulus();
    $mahasiswa->perkembanganAkademik();
    $mahasiswa->mataKuliahBermasalah();
    $queriesAfterFourMoreCalls = count(DB::getQueryLog());
    DB::disableQueryLog();

    expect($queriesAfterFirstCall)->toBeGreaterThan(0);
    expect($queriesAfterFourMoreCalls)->toBe($queriesAfterFirstCall);
});
