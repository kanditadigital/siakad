<?php

use App\Models\ProgramStudi;
use App\Models\User;

test('admin_prodi visiting the generic dashboard route is redirected to their own dashboard', function () {
    $programStudi = ProgramStudi::factory()->create();
    $user = User::factory()->create([
        'role' => 'admin_prodi',
        'program_studi_id' => $programStudi->id,
    ]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('admin-prodi.dashboard'));

    $follow = $this->actingAs($user)->get(route('admin-prodi.dashboard'));
    $follow->assertOk();
});

test('admin, dosen, mahasiswa, and pimpinan still render their own dashboard component directly', function (string $role) {
    $user = User::factory()->create(['role' => $role]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component("dashboard/{$role}"));
})->with(['admin', 'dosen', 'mahasiswa', 'pimpinan']);
