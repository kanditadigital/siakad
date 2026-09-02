<?php

use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Nilai;
use App\Models\User;

test('IPK denominator only counts SKS from graded courses, not pending ones', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);

    // Graded: nilai 80, 3 SKS -> contributes 240 points over 3 SKS
    $gradedMk = MataKuliah::factory()->create(['sks' => 3]);
    $gradedKelas = Kelas::factory()->create(['mata_kuliah_id' => $gradedMk->id]);
    $gradedKrs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $gradedKelas->id]);
    Nilai::factory()->create(['krs_id' => $gradedKrs->id, 'nilai' => 80, 'status' => 'tercatat']);

    // Ungraded placeholder: nilai is null, should NOT dilute the IPK denominator
    $pendingMk = MataKuliah::factory()->create(['sks' => 4]);
    $pendingKelas = Kelas::factory()->create(['mata_kuliah_id' => $pendingMk->id]);
    $pendingKrs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $pendingKelas->id]);
    Nilai::factory()->create(['krs_id' => $pendingKrs->id, 'nilai' => null, 'status' => 'belum']);

    $response = $this->actingAs($user)->get(route('mahasiswa.khs'));

    $response->assertOk();
    // IPK should be 80.0 (240 / 3), not 34.29 (240 / 7) which the old
    // implementation produced by including the ungraded course's 4 SKS.
    $response->assertInertia(fn ($page) => $page
        ->where('stats.ipk', 80)
        ->where('stats.total_sks', 7)
    );
});
