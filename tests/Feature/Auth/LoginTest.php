<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('pengguna dapat login dengan email dan diarahkan sesuai role', function () {
    $user = User::create([
        'name' => 'Administrator',
        'email' => 'admin@sitiddarurrahmah.ac.id',
        'password' => bcrypt('password123'),
        'role' => 'admin',
    ]);

    $response = $this->post('/login', [
        'login_field' => 'email',
        'login_value' => 'admin@sitiddarurrahmah.ac.id',
        'password' => 'password123',
    ]);

    $response->assertRedirect('/dashboard/admin');
    $this->assertAuthenticatedAs($user);
});

test('login gagal ketika password salah', function () {
    User::create([
        'name' => 'Administrator',
        'email' => 'admin@sitiddarurrahmah.ac.id',
        'password' => bcrypt('password123'),
        'role' => 'admin',
    ]);

    $response = $this->post('/login', [
        'login_field' => 'email',
        'login_value' => 'admin@sitiddarurrahmah.ac.id',
        'password' => 'salah',
    ]);

    $response->assertSessionHasErrors();
    $this->assertGuest();
});

test('mahasiswa dapat login dengan nim', function () {
    $user = User::create([
        'name' => 'Mahasiswa',
        'email' => 'mhs@example.com',
        'password' => bcrypt('password123'),
        'role' => 'mahasiswa',
        'nim' => 'MHS-001',
    ]);

    $response = $this->post('/login', [
        'login_field' => 'nim',
        'login_value' => 'MHS-001',
        'password' => 'password123',
    ]);

    $response->assertRedirect('/dashboard/mahasiswa');
    $this->assertAuthenticatedAs($user);
});
