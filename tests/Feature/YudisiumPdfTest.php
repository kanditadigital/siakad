<?php

use App\Models\User;
use App\Models\Yudisium;

test('admin can download berita acara for a lulus yudisium', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $yudisium = Yudisium::factory()->create(['status' => 'lulus']);

    $response = $this->actingAs($admin)->get(route('admin.yudisium.berita-acara', $yudisium->uuid));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

test('admin can download sk for a lulus yudisium', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $yudisium = Yudisium::factory()->create(['status' => 'lulus']);

    $response = $this->actingAs($admin)->get(route('admin.yudisium.sk', $yudisium->uuid));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

test('berita acara and sk cannot be downloaded for a tidak lulus yudisium', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $yudisium = Yudisium::factory()->create(['status' => 'tidak lulus']);

    $this->actingAs($admin)->get(route('admin.yudisium.berita-acara', $yudisium->uuid))->assertStatus(422);
    $this->actingAs($admin)->get(route('admin.yudisium.sk', $yudisium->uuid))->assertStatus(422);
});
