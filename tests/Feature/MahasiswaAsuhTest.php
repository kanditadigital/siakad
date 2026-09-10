<?php

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\User;

test('dosen only sees their own mahasiswa asuh', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $otherDosen = Dosen::factory()->create();

    $mine = Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'nama' => 'Anak Bimbingan']);
    Mahasiswa::factory()->create(['pa_dosen_id' => $otherDosen->id, 'nama' => 'Bukan Bimbingan']);
    Mahasiswa::factory()->create(['pa_dosen_id' => null, 'nama' => 'Tanpa PA']);

    $response = $this->actingAs($user)->get(route('dosen.mahasiswa-asuh.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dosen/mahasiswa-asuh/index')
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.id', $mine->id)
    );
});

test('search filters mahasiswa asuh by nim or nama', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'nama' => 'Budi Santoso', 'nim' => '2026001']);
    Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'nama' => 'Citra Dewi', 'nim' => '2026002']);

    $response = $this->actingAs($user)->get(route('dosen.mahasiswa-asuh.index', ['search' => 'Budi']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.nama', 'Budi Santoso')
    );
});

test('status filter narrows mahasiswa asuh', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'status' => 'aktif']);
    Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id, 'status' => 'cuti']);

    $response = $this->actingAs($user)->get(route('dosen.mahasiswa-asuh.index', ['status' => 'cuti']));

    $response->assertInertia(fn ($page) => $page
        ->has('mahasiswas.data', 1)
        ->where('mahasiswas.data.0.status', 'cuti')
    );
});

test('dosen can remove a mahasiswa from their asuh list', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => $dosen->id]);

    $response = $this->actingAs($user)->delete(route('dosen.mahasiswa-asuh.destroy', $mahasiswa));

    $response->assertRedirect();
    expect($mahasiswa->fresh()->pa_dosen_id)->toBeNull();
});
