<?php

use App\Models\Dosen;
use App\Models\User;

function validBobotPayload(array $overrides = []): array
{
    return array_merge([
        'bobot_tugas' => 20,
        'bobot_uts' => 25,
        'bobot_uas' => 30,
        'bobot_partisipasi' => 10,
        'bobot_kehadiran' => 15,
    ], $overrides);
}

test('dosen can view their own grading-weight settings', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create([
        'user_id' => $user->id,
        'bobot_tugas' => 20,
        'bobot_uts' => 25,
        'bobot_uas' => 30,
        'bobot_partisipasi' => 10,
        'bobot_kehadiran' => 15,
    ]);

    $response = $this->actingAs($user)->get(route('dosen.pengaturan-nilai.show'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dosen/pengaturan-nilai')
        ->where('bobot.bobot_tugas', 20)
        ->where('bobot.bobot_uts', 25)
        ->where('bobot.bobot_uas', 30)
        ->where('bobot.bobot_partisipasi', 10)
        ->where('bobot.bobot_kehadiran', 15)
    );
});

test('dosen can update their grading weights', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->put(
        route('dosen.pengaturan-nilai.update'),
        validBobotPayload(['bobot_tugas' => 30, 'bobot_uts' => 15]),
    );

    $response->assertRedirect(route('dosen.pengaturan-nilai.show'));
    expect($dosen->fresh())
        ->bobot_tugas->toBe(30)
        ->bobot_uts->toBe(15)
        ->bobot_uas->toBe(30)
        ->bobot_partisipasi->toBe(10)
        ->bobot_kehadiran->toBe(15);
});

test('grading weights must total 100 percent', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id, 'bobot_tugas' => 20]);

    $response = $this->actingAs($user)->put(
        route('dosen.pengaturan-nilai.update'),
        validBobotPayload(['bobot_tugas' => 50]),
    );

    $response->assertSessionHasErrors('bobot_tugas');
    expect($dosen->fresh()->bobot_tugas)->toBe(20);
});

test('a dosen without a Dosen record cannot reach the pengaturan nilai routes', function () {
    $user = User::factory()->create(['role' => 'dosen']);

    $this->actingAs($user)->get(route('dosen.pengaturan-nilai.show'))->assertNotFound();
    $this->actingAs($user)->put(
        route('dosen.pengaturan-nilai.update'),
        validBobotPayload(),
    )->assertNotFound();
});

test('a dosen cannot change another dosen weights through this route', function () {
    $user = User::factory()->create(['role' => 'dosen']);
    Dosen::factory()->create(['user_id' => $user->id]);

    $otherUser = User::factory()->create(['role' => 'dosen']);
    $otherDosen = Dosen::factory()->create(['user_id' => $otherUser->id, 'bobot_tugas' => 20]);

    $this->actingAs($user)->put(
        route('dosen.pengaturan-nilai.update'),
        validBobotPayload(['bobot_tugas' => 40, 'bobot_uts' => 15]),
    );

    expect($otherDosen->fresh()->bobot_tugas)->toBe(20);
});
