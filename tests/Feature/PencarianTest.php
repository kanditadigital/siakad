<?php

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admin can search mahasiswa, dosen, and mata kuliah at once', function () {
    $mahasiswa = Mahasiswa::factory()->create(['nama' => 'Andika Satria', 'nim' => '2026001']);
    $dosen = Dosen::factory()->create(['nama' => 'Andi Fauzi']);
    $mataKuliah = MataKuliah::factory()->create(['nama_mk' => 'Analisis Andal', 'kode_mk' => 'AND101']);
    Mahasiswa::factory()->create(['nama' => 'Budi Santoso']);

    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('pencarian', ['q' => 'And']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('pencarian')
            ->where('q', 'And')
            ->where('total', 3)
            ->where('hasil.mahasiswa.0.judul', $mahasiswa->nama)
            ->where('hasil.mahasiswa.0.href', "/admin/mahasiswa/{$mahasiswa->uuid}")
            ->where('hasil.dosen.0.judul', $dosen->nama)
            ->where('hasil.mataKuliah.0.judul', $mataKuliah->nama_mk)
        );
});

test('mahasiswa can also be found by NIM', function () {
    Mahasiswa::factory()->create(['nama' => 'Rina Wulandari', 'nim' => '2026009']);

    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('pencarian', ['q' => '2026009']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('total', 1)
            ->where('hasil.mahasiswa.0.judul', 'Rina Wulandari')
        );
});

test('admin prodi only searches within their own program studi', function () {
    $prodi = ProgramStudi::factory()->create();
    $prodiLain = ProgramStudi::factory()->create();

    $milikSendiri = Mahasiswa::factory()->create(['nama' => 'Sari Melati', 'program_studi_id' => $prodi->id]);
    Mahasiswa::factory()->create(['nama' => 'Sari Utami', 'program_studi_id' => $prodiLain->id]);

    $user = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $prodi->id]);

    $this->actingAs($user)
        ->get(route('pencarian', ['q' => 'Sari']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('hasil.mahasiswa', 1)
            ->where('hasil.mahasiswa.0.judul', 'Sari Melati')
            ->where('hasil.mahasiswa.0.href', "/admin-prodi/mahasiswa/{$milikSendiri->uuid}")
        );
});

test('admin prodi only searches dosen within their own program studi', function () {
    $prodi = ProgramStudi::factory()->create();
    $prodiLain = ProgramStudi::factory()->create();

    $milikSendiri = Dosen::factory()->create(['nama' => 'Dedi Kurniawan', 'program_studi_id' => $prodi->id]);
    Dosen::factory()->create(['nama' => 'Dedi Prasetyo', 'program_studi_id' => $prodiLain->id]);

    $user = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $prodi->id]);

    $this->actingAs($user)
        ->get(route('pencarian', ['q' => 'Dedi']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('hasil.dosen', 1)
            ->where('hasil.dosen.0.judul', 'Dedi Kurniawan')
            ->where('hasil.dosen.0.href', "/admin-prodi/dosen/{$milikSendiri->uuid}")
        );
});

test('admin prodi only searches mata kuliah within their own program studi', function () {
    $prodi = ProgramStudi::factory()->create();
    $prodiLain = ProgramStudi::factory()->create();

    $milikSendiri = MataKuliah::factory()->create(['nama_mk' => 'Kalkulus Lanjut', 'program_studi_id' => $prodi->id]);
    MataKuliah::factory()->create(['nama_mk' => 'Kalkulus Dasar', 'program_studi_id' => $prodiLain->id]);

    $user = User::factory()->create(['role' => 'admin_prodi', 'program_studi_id' => $prodi->id]);

    $this->actingAs($user)
        ->get(route('pencarian', ['q' => 'Kalkulus']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('hasil.mataKuliah', 1)
            ->where('hasil.mataKuliah.0.judul', 'Kalkulus Lanjut')
            ->where('hasil.mataKuliah.0.href', "/admin-prodi/mata-kuliah/{$milikSendiri->uuid}")
        );
});

test('an empty query renders the page without results instead of listing everything', function () {
    Mahasiswa::factory()->count(3)->create();

    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('pencarian'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('total', 0));
});

test('roles without their own admin screens cannot reach the search route', function (string $role) {
    $this->actingAs(User::factory()->create(['role' => $role]))
        ->get(route('pencarian', ['q' => 'a']))
        ->assertForbidden();
})->with(['dosen', 'mahasiswa', 'pimpinan']);
