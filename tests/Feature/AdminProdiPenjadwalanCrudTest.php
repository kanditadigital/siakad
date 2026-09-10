<?php

use App\Models\AcademicYearSemester;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use App\Models\User;

function validAdminProdiKelasPayload(array $overrides = []): array
{
    return array_replace([
        'kode_kelas' => 'KEL-BARU-001',
        'nama_kelas' => 'Kelas Baru',
        'kapasitas' => 30,
        'semester' => '1',
        'status' => 'Aktif',
    ], $overrides);
}

test('admin_prodi penjadwalan index no longer 500s and only shows own program studi classes', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);

    $ownMk = MataKuliah::factory()->create(['program_studi_id' => $programStudi->id]);
    $foreignMk = MataKuliah::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $mine = Kelas::factory()->create(['mata_kuliah_id' => $ownMk->id]);
    Kelas::factory()->create(['mata_kuliah_id' => $foreignMk->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.penjadwalan.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/penjadwalan/index')
        ->has('kelases.data', 1)
        ->where('kelases.data.0.id', $mine->id)
    );
});

test('admin_prodi penjadwalan show no longer 500s and loads dosen correctly', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mk = MataKuliah::factory()->create(['program_studi_id' => $programStudi->id]);
    $dosen = Dosen::factory()->create(['program_studi_id' => $programStudi->id]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id, 'dosen_id' => $dosen->id]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.penjadwalan.show', $kelas));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/penjadwalan/show')
        ->where('kelas.dosen.id', $dosen->id)
    );
});

test('admin_prodi penjadwalan create page defaults to the currently active academic year semester', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    AcademicYearSemester::factory()->create(['status' => 'nonaktif']);
    $active = AcademicYearSemester::factory()->create(['status' => 'aktif']);

    $response = $this->actingAs($admin)->get(route('admin-prodi.penjadwalan.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin-prodi/penjadwalan/create')
        ->where('activeAcademicYearSemesterId', $active->id)
    );
});

test('admin_prodi penjadwalan create page has no default when no academic year semester is active', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    AcademicYearSemester::factory()->create(['status' => 'nonaktif']);

    $response = $this->actingAs($admin)->get(route('admin-prodi.penjadwalan.create'));

    $response->assertInertia(fn ($page) => $page
        ->where('activeAcademicYearSemesterId', null)
    );
});

test('admin_prodi can create a kelas scoped to their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mk = MataKuliah::factory()->create(['program_studi_id' => $programStudi->id]);
    $ays = AcademicYearSemester::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin-prodi.penjadwalan.store'), validAdminProdiKelasPayload([
        'mata_kuliah_id' => $mk->id,
        'academic_year_semester_id' => $ays->id,
    ]));

    $response->assertRedirect(route('admin-prodi.penjadwalan.index'));
    $this->assertDatabaseHas('kelas', ['kode_kelas' => 'KEL-BARU-001', 'mata_kuliah_id' => $mk->id]);
});

test('admin_prodi cannot create a kelas for another program studis mata kuliah', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMk = MataKuliah::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $ays = AcademicYearSemester::factory()->create();

    $response = $this->actingAs($admin)->post(route('admin-prodi.penjadwalan.store'), validAdminProdiKelasPayload([
        'mata_kuliah_id' => $foreignMk->id,
        'academic_year_semester_id' => $ays->id,
    ]));

    $response->assertSessionHasErrors('mata_kuliah_id');
    $this->assertDatabaseMissing('kelas', ['kode_kelas' => 'KEL-BARU-001']);
});

test('admin_prodi cannot view, edit, or delete a kelas outside their program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $otherProgramStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $foreignMk = MataKuliah::factory()->create(['program_studi_id' => $otherProgramStudi->id]);
    $foreignKelas = Kelas::factory()->create(['mata_kuliah_id' => $foreignMk->id]);

    $this->actingAs($admin)->get(route('admin-prodi.penjadwalan.show', $foreignKelas))->assertForbidden();
    $this->actingAs($admin)->get(route('admin-prodi.penjadwalan.edit', $foreignKelas))->assertForbidden();
    $this->actingAs($admin)->delete(route('admin-prodi.penjadwalan.destroy', $foreignKelas))->assertForbidden();
});

test('admin_prodi can update and delete a kelas in their own program studi', function () {
    $programStudi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $programStudi->id]);
    $mk = MataKuliah::factory()->create(['program_studi_id' => $programStudi->id]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id]);
    $ays = AcademicYearSemester::factory()->create();

    $update = $this->actingAs($admin)->put(route('admin-prodi.penjadwalan.update', $kelas), validAdminProdiKelasPayload([
        'mata_kuliah_id' => $mk->id,
        'academic_year_semester_id' => $ays->id,
        'nama_kelas' => 'Nama Diperbarui',
        'kode_kelas' => $kelas->kode_kelas,
    ]));
    $update->assertRedirect(route('admin-prodi.penjadwalan.index'));
    $this->assertDatabaseHas('kelas', ['id' => $kelas->id, 'nama_kelas' => 'Nama Diperbarui']);

    $destroy = $this->actingAs($admin)->delete(route('admin-prodi.penjadwalan.destroy', $kelas));
    $destroy->assertRedirect(route('admin-prodi.penjadwalan.index'));
    $this->assertDatabaseMissing('kelas', ['id' => $kelas->id]);
});
