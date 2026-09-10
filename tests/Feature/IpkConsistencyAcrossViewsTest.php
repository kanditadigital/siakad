<?php

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Nilai;
use App\Models\User;

/**
 * KhsController, TranskripNilaiController, and Dosen\MahasiswaAsuhController
 * all report a mahasiswa's IPK. They must all read it from the single
 * Mahasiswa::hitungIpk() source instead of each re-implementing the
 * formula, or a future formula change could silently apply to only one view.
 */
test('KHS, transkrip, and dosen PA views report the same IPK for the same mahasiswa', function () {
    $dosenUser = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $dosenUser->id]);
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id, 'pa_dosen_id' => $dosen->id]);

    $mk1 = MataKuliah::factory()->create(['sks' => 3]);
    $krs1 = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => Kelas::factory()->create(['mata_kuliah_id' => $mk1->id])->id,
        'status' => 'disetujui',
    ]);
    Nilai::factory()->create(['krs_id' => $krs1->id, 'grade' => 'B', 'nilai' => 3.0]);

    $mk2 = MataKuliah::factory()->create(['sks' => 2]);
    $krs2 = Krs::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'kelas_id' => Kelas::factory()->create(['mata_kuliah_id' => $mk2->id])->id,
        'status' => 'disetujui',
    ]);
    Nilai::factory()->create(['krs_id' => $krs2->id, 'grade' => 'D', 'nilai' => 1.0]);

    $expectedIpk = $mahasiswa->fresh()->hitungIpk();

    $this->actingAs($user)->get(route('mahasiswa.khs'))
        ->assertInertia(fn ($page) => $page->where('stats.ipk', $expectedIpk));

    $this->actingAs($user)->get(route('mahasiswa.transkrip-nilai'))
        ->assertInertia(fn ($page) => $page->where('stats.ipk', $expectedIpk));

    $this->actingAs($dosenUser)->get(route('dosen.mahasiswa-asuh.show', $mahasiswa))
        ->assertInertia(fn ($page) => $page->where('mahasiswa.ipk', $expectedIpk));
});
