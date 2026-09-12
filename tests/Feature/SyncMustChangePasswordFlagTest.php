<?php

use App\Models\User;

test('flags a dosen whose password still equals their nidn', function () {
    $dosen = User::factory()->create([
        'role' => 'dosen',
        'nidn' => '1112223334',
        'password' => bcrypt('1112223334'),
        'must_change_password' => false,
    ]);

    $this->artisan('users:sync-must-change-password')->assertExitCode(0);

    expect($dosen->refresh()->must_change_password)->toBeTrue();
});

test('flags a mahasiswa whose password still equals their nim', function () {
    $mahasiswa = User::factory()->create([
        'role' => 'mahasiswa',
        'nim' => '1492501001',
        'password' => bcrypt('1492501001'),
        'must_change_password' => false,
    ]);

    $this->artisan('users:sync-must-change-password')->assertExitCode(0);

    expect($mahasiswa->refresh()->must_change_password)->toBeTrue();
});

test('leaves a dosen alone whose password was already changed', function () {
    $dosen = User::factory()->create([
        'role' => 'dosen',
        'nidn' => '1112223334',
        'password' => bcrypt('password-yang-sudah-diganti'),
        'must_change_password' => false,
    ]);

    $this->artisan('users:sync-must-change-password')->assertExitCode(0);

    expect($dosen->refresh()->must_change_password)->toBeFalse();
});

test('dry-run reports matches without writing anything', function () {
    $dosen = User::factory()->create([
        'role' => 'dosen',
        'nidn' => '1112223334',
        'password' => bcrypt('1112223334'),
        'must_change_password' => false,
    ]);

    $this->artisan('users:sync-must-change-password', ['--dry-run' => true])
        ->expectsOutputToContain('1112223334')
        ->assertExitCode(0);

    expect($dosen->refresh()->must_change_password)->toBeFalse();
});

test('leaves admin and pimpinan accounts untouched entirely', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'password' => bcrypt('password'),
        'must_change_password' => false,
    ]);

    $this->artisan('users:sync-must-change-password')->assertExitCode(0);

    expect($admin->refresh()->must_change_password)->toBeFalse();
});
