<?php

use App\Models\Mahasiswa;
use App\Models\TagihanUkt;
use App\Models\User;

test('pimpinan can view their dashboard with real stats', function () {
    $user = User::factory()->create(['role' => 'pimpinan']);
    Mahasiswa::factory()->create(['status' => 'aktif']);
    TagihanUkt::factory()->create(['status' => 'belum']);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard/pimpinan')
        ->has('stats')
    );
});

test('pimpinan can view monitoring akademik', function () {
    $user = User::factory()->create(['role' => 'pimpinan']);

    $response = $this->actingAs($user)->get(route('pimpinan.monitoring-akademik'));

    $response->assertOk();
});

test('pimpinan can view monitoring keuangan', function () {
    $user = User::factory()->create(['role' => 'pimpinan']);
    TagihanUkt::factory()->create();

    $response = $this->actingAs($user)->get(route('pimpinan.monitoring-keuangan'));

    $response->assertOk();
});

test('pimpinan can view laporan ringkas', function () {
    $user = User::factory()->create(['role' => 'pimpinan']);

    $response = $this->actingAs($user)->get(route('pimpinan.laporan'));

    $response->assertOk();
});

test('non-pimpinan roles cannot access pimpinan monitoring pages', function () {
    $mahasiswaUser = User::factory()->create(['role' => 'mahasiswa']);

    $response = $this->actingAs($mahasiswaUser)->get(route('pimpinan.monitoring-akademik'));

    $response->assertForbidden();
});
