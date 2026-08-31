<?php

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\User;

/**
 * The real login form only ever posts `login_value` + `password` (no `login_field`) —
 * these tests exercise the auto-detection path in FortifyServiceProvider, as opposed to
 * tests/Feature/Auth/LoginTest.php which exercises explicit login_field selection.
 */
test('mahasiswa can log in with only their nim, without an explicit login_field', function () {
    $user = User::factory()->create(['role' => 'mahasiswa', 'password' => bcrypt('password123')]);
    Mahasiswa::factory()->create(['user_id' => $user->id, 'nim' => '2026001234']);

    $response = $this->post('/login', [
        'login_value' => '2026001234',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($user);
});

test('dosen can log in with only their nidn, without an explicit login_field', function () {
    $user = User::factory()->create(['role' => 'dosen', 'password' => bcrypt('password123')]);
    Dosen::factory()->create(['user_id' => $user->id, 'nidn' => '0012345678']);

    $response = $this->post('/login', [
        'login_value' => '0012345678',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($user);
});

test('admin can log in with only their email, without an explicit login_field', function () {
    $user = User::factory()->create(['role' => 'admin', 'email' => 'admin@example.com', 'password' => bcrypt('password123')]);

    $response = $this->post('/login', [
        'login_value' => 'admin@example.com',
        'password' => 'password123',
    ]);

    $this->assertAuthenticatedAs($user);
});

test('login fails for an unknown nim without leaking whether it exists', function () {
    $response = $this->post('/login', [
        'login_value' => '9999999999',
        'password' => 'password123',
    ]);

    $response->assertSessionHasErrors();
    $this->assertGuest();
});
