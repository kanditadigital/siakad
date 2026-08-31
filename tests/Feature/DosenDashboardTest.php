<?php

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\User;

test('dosen dashboard shows kelas and mahasiswa asuh stats', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $kelas = Kelas::factory()->create(['dosen_id' => $dosen->id, 'status' => 'Aktif']);
    Krs::factory()->create(['kelas_id' => $kelas->id, 'status' => 'disetujui']);

    Mahasiswa::factory()->count(2)->create(['pa_dosen_id' => $dosen->id]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard/dosen')
        ->where('stats.total_kelas', 1)
        ->where('stats.total_mahasiswa_asuh', 2)
        ->where('stats.total_mahasiswa_diampu', 1)
    );
});
