<?php

use App\Models\AcademicYearSemester;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use App\Models\Setting;
use App\Models\User;

test('admin_prodi only sees mahasiswa with KRS from their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $ownMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    Krs::factory()->create(['mahasiswa_id' => $ownMahasiswa->id]);
    Krs::factory()->create(['mahasiswa_id' => $foreignMahasiswa->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.krs.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/krs/index')
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $ownMahasiswa->id)
        ->has('mahasiswas.data.0.krs', 1)
    );
});

test('a mahasiswa with multiple krs entries is grouped into a single row', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);

    Krs::factory()->count(3)->create(['mahasiswa_id' => $mahasiswa->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.krs.index'));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->has('mahasiswas.data.0.krs', 3)
    );
});

test('status filter narrows the KRS entries within each mahasiswa group', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);

    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);
    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $response = $this->actingAs($admin)->get(route('admin-prodi.krs.index', ['status' => 'disetujui']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->has('mahasiswas.data.0.krs', 1)
        ->where('mahasiswas.data.0.krs.0.status', 'disetujui')
    );
});

test('semester filter narrows the KRS entries to the selected academic year semester', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $thisSemester = AcademicYearSemester::factory()->create();
    $otherSemester = AcademicYearSemester::factory()->create();

    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'academic_year_semester_id' => $thisSemester->id]);
    Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'academic_year_semester_id' => $otherSemester->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.krs.index', ['academic_year_semester_id' => $thisSemester->id]));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->has('mahasiswas.data.0.krs', 1)
        ->where('mahasiswas.data.0.krs.0.academic_year_semester.id', $thisSemester->id)
    );
});

test('admin_prodi cannot view KRS belonging to another program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $foreignKrs = Krs::factory()->create(['mahasiswa_id' => $foreignMahasiswa->id]);

    $this->actingAs($admin)->get(route('admin-prodi.krs.show', $foreignKrs))->assertForbidden();
});

test('admin_prodi KRS show loads dosen and academic year semester correctly', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $dosen = Dosen::factory()->create();
    $kelas = Kelas::factory()->create(['dosen_id' => $dosen->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.krs.show', $krs));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/krs/show')
        ->where('krs.kelas.dosen.nama', $dosen->nama)
        ->where('krs.academic_year_semester.id', $krs->academic_year_semester_id)
    );
});

test('admin_prodi can approve a pending krs within the sks limit', function () {
    Setting::setMany(['krs.sks_maks' => 24]);
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $mk = MataKuliah::factory()->create(['sks' => 3]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id, 'status' => 'pending']);

    $response = $this->actingAs($admin)->patch(route('admin-prodi.krs.approve', $krs));

    $response->assertRedirect();
    $this->assertDatabaseHas('krs', ['id' => $krs->id, 'status' => 'disetujui']);
});

test('admin_prodi approving a krs beyond the sks limit is rejected', function () {
    Setting::setMany(['krs.sks_maks' => 24]);
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $ays = AcademicYearSemester::factory()->create();

    Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'academic_year_semester_id' => $ays->id,
        'status' => 'disetujui',
        'kelas_id' => Kelas::factory()->create([
            'mata_kuliah_id' => MataKuliah::factory()->create(['sks' => 22])->id,
        ])->id,
    ]);

    $mk = MataKuliah::factory()->create(['sks' => 4]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id]);
    $krs = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'academic_year_semester_id' => $ays->id,
        'kelas_id' => $kelas->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->patch(route('admin-prodi.krs.approve', $krs));

    $response->assertSessionHasErrors('krs');
    $this->assertDatabaseHas('krs', ['id' => $krs->id, 'status' => 'pending']);
});

test('admin_prodi can reject a pending krs', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'pending']);

    $response = $this->actingAs($admin)->patch(route('admin-prodi.krs.reject', $krs));

    $response->assertRedirect();
    $this->assertDatabaseHas('krs', ['id' => $krs->id, 'status' => 'ditolak']);
});

test('admin_prodi cannot approve or reject a krs already processed', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $this->actingAs($admin)->patch(route('admin-prodi.krs.approve', $krs))->assertStatus(422);
    $this->actingAs($admin)->patch(route('admin-prodi.krs.reject', $krs))->assertStatus(422);
});

test('admin_prodi cannot approve or reject a krs belonging to another program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $foreignKrs = Krs::factory()->create(['mahasiswa_id' => $foreignMahasiswa->id, 'status' => 'pending']);

    $this->actingAs($admin)->patch(route('admin-prodi.krs.approve', $foreignKrs))->assertForbidden();
    $this->actingAs($admin)->patch(route('admin-prodi.krs.reject', $foreignKrs))->assertForbidden();
});
