<?php

use App\Models\Dosen;
use App\Models\Ruang;
use App\Models\Tendik;
use App\Models\User;

test('admin can export laporan sumber daya as pdf', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Dosen::factory()->create();
    Tendik::factory()->create();
    Ruang::factory()->create();

    $response = $this->actingAs($admin)->get(route('admin.laporan.export-sumber-daya'));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});
