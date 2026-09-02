<?php

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use App\Models\User;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

test('batas semester normal is derived from program studi lama studi', function () {
    $prodiS1 = ProgramStudi::factory()->create(['lama_studi' => 4]);
    $prodiD3 = ProgramStudi::factory()->create(['lama_studi' => 3]);

    $mahasiswaS1 = Mahasiswa::factory()->create(['program_studi_id' => $prodiS1->id]);
    $mahasiswaD3 = Mahasiswa::factory()->create(['program_studi_id' => $prodiD3->id]);

    expect($mahasiswaS1->batas_semester_normal)->toBe(8);
    expect($mahasiswaD3->batas_semester_normal)->toBe(6);
});

test('batas semester normal is null when program_studi_id is left out of a partial select', function () {
    Mahasiswa::factory()->create();

    $picked = Mahasiswa::query()->select(['id', 'nim', 'nama'])->first();

    expect($picked->batas_semester_normal)->toBeNull();
});

// ---------------------------------------------------------------------
// Admin: cross-prodi filter + bulk promotion
// ---------------------------------------------------------------------

test('admin can filter mahasiswa by an exact semester', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $sem3 = Mahasiswa::factory()->create(['semester_saat_ini' => 3, 'nama' => 'Semester Tiga']);
    Mahasiswa::factory()->create(['semester_saat_ini' => 5, 'nama' => 'Semester Lima']);

    $response = $this->actingAs($admin)->get(route('admin.mahasiswa.index', ['semester' => 3]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $sem3->id)
    );
});

test('admin can filter mahasiswa who have gone past their normal masa studi', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $prodi = ProgramStudi::factory()->create(['lama_studi' => 4]);

    $overdue = Mahasiswa::factory()->create([
        'program_studi_id' => $prodi->id,
        'semester_saat_ini' => 9,
        'nama' => 'Lewat Batas',
    ]);
    Mahasiswa::factory()->create([
        'program_studi_id' => $prodi->id,
        'semester_saat_ini' => 8,
        'nama' => 'Masih Normal',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.mahasiswa.index', ['semester' => 'over']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $overdue->id)
    );
});

test('the over filter compares each mahasiswa against their own jenjang cap', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $s1 = ProgramStudi::factory()->create(['lama_studi' => 4]);
    $d3 = ProgramStudi::factory()->create(['lama_studi' => 3]);

    // Semester 7: within S1's cap of 8, but past D3's cap of 6.
    Mahasiswa::factory()->create(['program_studi_id' => $s1->id, 'semester_saat_ini' => 7, 'nama' => 'S1 Semester 7']);
    $overD3 = Mahasiswa::factory()->create(['program_studi_id' => $d3->id, 'semester_saat_ini' => 7, 'nama' => 'D3 Semester 7']);

    $response = $this->actingAs($admin)->get(route('admin.mahasiswa.index', ['semester' => 'over']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $overD3->id)
    );
});

test('admin can bulk-advance every active mahasiswa of one program studi', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $prodi = ProgramStudi::factory()->create();
    $otherProdi = ProgramStudi::factory()->create();

    $active = Mahasiswa::factory()->create(['program_studi_id' => $prodi->id, 'status' => 'aktif', 'semester_saat_ini' => 3]);
    $cuti = Mahasiswa::factory()->create(['program_studi_id' => $prodi->id, 'status' => 'cuti', 'semester_saat_ini' => 3]);
    $otherProdiMahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $otherProdi->id, 'status' => 'aktif', 'semester_saat_ini' => 3]);

    $response = $this->actingAs($admin)->post(route('admin.mahasiswa.naikkan-semester'), [
        'program_studi_id' => $prodi->id,
    ]);

    $response->assertRedirect();
    expect($active->fresh()->semester_saat_ini)->toBe(4);
    expect($cuti->fresh()->semester_saat_ini)->toBe(3);
    expect($otherProdiMahasiswa->fresh()->semester_saat_ini)->toBe(3);
});

test('naikkan semester reports when there is nothing to promote', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $prodi = ProgramStudi::factory()->create();
    Mahasiswa::factory()->create(['program_studi_id' => $prodi->id, 'status' => 'lulus']);

    $response = $this->actingAs($admin)->post(route('admin.mahasiswa.naikkan-semester'), [
        'program_studi_id' => $prodi->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('admin can correct a mahasiswa semester through the edit form', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mahasiswa = Mahasiswa::factory()->create(['semester_saat_ini' => 2]);
    $mahasiswa->user()->update(['name' => $mahasiswa->nama]);

    $response = $this->actingAs($admin)->put(route('admin.mahasiswa.update', $mahasiswa), [
        'nama' => $mahasiswa->nama,
        'program_studi_id' => $mahasiswa->program_studi_id,
        'tempat_lahir' => $mahasiswa->tempat_lahir,
        'tanggal_lahir' => $mahasiswa->tanggal_lahir->format('Y-m-d'),
        'jenis_kelamin' => $mahasiswa->jenis_kelamin,
        'alamat' => $mahasiswa->alamat,
        'kode_domisili' => $mahasiswa->kode_domisili,
        'status' => 'aktif',
        'semester_saat_ini' => 5,
    ]);

    $response->assertRedirect();
    expect($mahasiswa->fresh()->semester_saat_ini)->toBe(5);
});

test('semester_saat_ini must be a positive integer', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $mahasiswa = Mahasiswa::factory()->create();

    $response = $this->actingAs($admin)->put(route('admin.mahasiswa.update', $mahasiswa), [
        'nama' => $mahasiswa->nama,
        'program_studi_id' => $mahasiswa->program_studi_id,
        'tempat_lahir' => $mahasiswa->tempat_lahir,
        'tanggal_lahir' => $mahasiswa->tanggal_lahir->format('Y-m-d'),
        'jenis_kelamin' => $mahasiswa->jenis_kelamin,
        'alamat' => $mahasiswa->alamat,
        'kode_domisili' => $mahasiswa->kode_domisili,
        'status' => 'aktif',
        'semester_saat_ini' => 0,
    ]);

    $response->assertSessionHasErrors('semester_saat_ini');
});

// ---------------------------------------------------------------------
// Admin Prodi: scoped filter + scoped bulk promotion
// ---------------------------------------------------------------------

test('admin prodi can filter mahasiswa by semester within their own prodi', function () {
    $prodi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $prodi->id]);

    $sem2 = Mahasiswa::factory()->create(['program_studi_id' => $prodi->id, 'semester_saat_ini' => 2]);
    Mahasiswa::factory()->create(['program_studi_id' => $prodi->id, 'semester_saat_ini' => 4]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.mahasiswa.index', ['semester' => 2]));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $sem2->id)
    );
});

test('admin prodi over filter uses their own prodi masa studi cap', function () {
    $prodi = ProgramStudi::factory()->create(['lama_studi' => 3]);
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $prodi->id]);

    $overdue = Mahasiswa::factory()->create(['program_studi_id' => $prodi->id, 'semester_saat_ini' => 7]);
    Mahasiswa::factory()->create(['program_studi_id' => $prodi->id, 'semester_saat_ini' => 6]);

    $response = $this->actingAs($admin)->get(route('admin-prodi.mahasiswa.index', ['semester' => 'over']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $overdue->id)
        ->where('maxSemester', 6)
    );
});

test('admin prodi naikkan semester only advances their own program studi', function () {
    $prodi = ProgramStudi::factory()->create();
    $otherProdi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $prodi->id]);

    $own = Mahasiswa::factory()->create(['program_studi_id' => $prodi->id, 'status' => 'aktif', 'semester_saat_ini' => 1]);
    $other = Mahasiswa::factory()->create(['program_studi_id' => $otherProdi->id, 'status' => 'aktif', 'semester_saat_ini' => 1]);

    $response = $this->actingAs($admin)->post(route('admin-prodi.mahasiswa.naikkan-semester'));

    $response->assertRedirect();
    expect($own->fresh()->semester_saat_ini)->toBe(2);
    expect($other->fresh()->semester_saat_ini)->toBe(1);
});

test('admin prodi cannot promote mahasiswa via a crafted program_studi_id since none is accepted', function () {
    $prodi = ProgramStudi::factory()->create();
    $otherProdi = ProgramStudi::factory()->create();
    $admin = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $prodi->id]);

    $other = Mahasiswa::factory()->create(['program_studi_id' => $otherProdi->id, 'status' => 'aktif', 'semester_saat_ini' => 1]);

    // AdminProdi's endpoint takes no program_studi_id input at all — it is
    // always derived from the authenticated user, so a spoofed field is
    // silently ignored rather than trusted.
    $this->actingAs($admin)->post(route('admin-prodi.mahasiswa.naikkan-semester'), [
        'program_studi_id' => $otherProdi->id,
    ]);

    expect($other->fresh()->semester_saat_ini)->toBe(1);
});

// ---------------------------------------------------------------------
// Dosen: read-only filter on mahasiswa asuh
// ---------------------------------------------------------------------

test('dosen can filter their mahasiswa asuh by semester', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $sem3 = Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'semester_saat_ini' => 3]);
    Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'semester_saat_ini' => 6]);

    $response = $this->actingAs($user)->get(route('dosen.mahasiswa-asuh.index', ['semester' => 3]));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $sem3->id)
    );
});

test('dosen mahasiswa asuh over filter uses their own program studi cap', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $prodi = ProgramStudi::factory()->create(['lama_studi' => 4]);
    $dosen = Dosen::factory()->create(['user_id' => $user->id, 'program_studi_id' => $prodi->id]);

    $overdue = Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'semester_saat_ini' => 9]);
    Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'semester_saat_ini' => 8]);

    $response = $this->actingAs($user)->get(route('dosen.mahasiswa-asuh.index', ['semester' => 'over']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $overdue->id)
        ->where('maxSemester', 8)
    );
});

test('dosen has no route to promote mahasiswa semester', function () {
    expect(function (): void {
        route('dosen.mahasiswa-asuh.naikkan-semester');
    })->toThrow(RouteNotFoundException::class);
});

// ---------------------------------------------------------------------
// Pimpinan: aggregated breakdown, not a raw filterable list
// ---------------------------------------------------------------------

test('pimpinan monitoring includes a mahasiswa per semester breakdown', function () {
    $pimpinan = User::factory()->create(['role' => 'pimpinan']);

    Mahasiswa::factory()->count(2)->create(['status' => 'aktif', 'semester_saat_ini' => 1]);
    Mahasiswa::factory()->create(['status' => 'aktif', 'semester_saat_ini' => 3]);
    // A lulus mahasiswa parked at their final semester should not pollute the
    // "currently progressing" breakdown.
    Mahasiswa::factory()->create(['status' => 'lulus', 'semester_saat_ini' => 8]);

    $response = $this->actingAs($pimpinan)->get(route('pimpinan.monitoring-akademik'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswaPerSemester', 2)
        ->where('mahasiswaPerSemester.0.semester', 1)
        ->where('mahasiswaPerSemester.0.total', 2)
        ->where('mahasiswaPerSemester.1.semester', 3)
        ->where('mahasiswaPerSemester.1.total', 1)
    );
});
