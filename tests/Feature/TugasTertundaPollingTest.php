<?php

use App\Models\Krs;
use App\Models\TagihanUkt;
use App\Models\User;
use App\Support\TugasTertunda;
use Illuminate\Support\Facades\Cache;

beforeEach(function () {
    Cache::flush();
});

test('creating a pending krs refreshes the cached tugas counts', function () {
    Krs::factory()->count(2)->create(['status' => 'pending']);

    expect(TugasTertunda::hitung())->toBe([
        'krs_pending' => 2,
        'tagihan_belum_lunas' => 0,
    ]);
});

test('a tagihan ukt status change refreshes the cached tugas counts', function () {
    $tagihan = TagihanUkt::factory()->create(['status' => 'belum']);

    $tagihan->update(['status' => 'lunas']);

    expect(TugasTertunda::hitung())->toBe([
        'krs_pending' => 0,
        'tagihan_belum_lunas' => 0,
    ]);
});

test('the chrome tugas endpoint returns the current counts', function () {
    Krs::factory()->count(2)->create(['status' => 'pending']);
    TagihanUkt::factory()->create(['status' => 'terlambat']);

    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->getJson(route('chrome.tugas'))
        ->assertOk()
        ->assertJson([
            'krs_pending' => 2,
            'tagihan_belum_lunas' => 1,
        ]);
});

test('only staff roles may poll the chrome tugas endpoint', function (string $role, int $status) {
    $this->actingAs(User::factory()->create(['role' => $role]))
        ->getJson(route('chrome.tugas'))
        ->assertStatus($status);
})->with([
    ['admin', 200],
    ['admin_prodi', 200],
    ['pimpinan', 200],
    ['dosen', 403],
    ['mahasiswa', 403],
]);
