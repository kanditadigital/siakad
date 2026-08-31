<?php

use App\Models\Pembayaran;
use App\Models\TagihanUkt;
use App\Models\User;

function actingAsAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

test('verifying a payment that covers the full tagihan marks it lunas', function () {
    $admin = actingAsAdmin();

    $tagihan = TagihanUkt::factory()->create([
        'jumlah_tagihan' => 2000000,
        'jumlah_bayar' => 0,
        'status' => 'belum',
        'jatuh_tempo' => now()->addMonth(),
    ]);

    $pembayaran = Pembayaran::factory()->create([
        'mahasiswa_id' => $tagihan->mahasiswa_id,
        'tagihan_ukt_id' => $tagihan->id,
        'jumlah_bayar' => 2000000,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)
        ->patch(route('admin.pembayaran.verify', $pembayaran->uuid));

    $response->assertRedirect(route('admin.pembayaran.show', $pembayaran->uuid));

    expect($pembayaran->fresh()->status)->toBe('verified');

    $tagihan->refresh();
    expect((float) $tagihan->jumlah_bayar)->toBe(2000000.0)
        ->and($tagihan->status)->toBe('lunas');
});

test('verifying a partial payment does not mark the tagihan lunas', function () {
    $admin = actingAsAdmin();

    $tagihan = TagihanUkt::factory()->create([
        'jumlah_tagihan' => 2000000,
        'jumlah_bayar' => 0,
        'status' => 'belum',
        'jatuh_tempo' => now()->addMonth(),
    ]);

    $pembayaran = Pembayaran::factory()->create([
        'mahasiswa_id' => $tagihan->mahasiswa_id,
        'tagihan_ukt_id' => $tagihan->id,
        'jumlah_bayar' => 500000,
        'status' => 'pending',
    ]);

    $this->actingAs($admin)->patch(route('admin.pembayaran.verify', $pembayaran->uuid));

    $tagihan->refresh();
    expect((float) $tagihan->jumlah_bayar)->toBe(500000.0)
        ->and($tagihan->status)->toBe('belum');
});

test('rejecting a payment does not change the tagihan balance', function () {
    $admin = actingAsAdmin();

    $tagihan = TagihanUkt::factory()->create([
        'jumlah_tagihan' => 2000000,
        'jumlah_bayar' => 0,
        'status' => 'belum',
    ]);

    $pembayaran = Pembayaran::factory()->create([
        'mahasiswa_id' => $tagihan->mahasiswa_id,
        'tagihan_ukt_id' => $tagihan->id,
        'jumlah_bayar' => 2000000,
        'status' => 'pending',
    ]);

    $this->actingAs($admin)->patch(route('admin.pembayaran.reject', $pembayaran->uuid));

    expect($pembayaran->fresh()->status)->toBe('rejected');

    $tagihan->refresh();
    expect((float) $tagihan->jumlah_bayar)->toBe(0.0)
        ->and($tagihan->status)->toBe('belum');
});

test('an already-processed payment cannot be verified again', function () {
    $admin = actingAsAdmin();

    $tagihan = TagihanUkt::factory()->create([
        'jumlah_tagihan' => 2000000,
        'jumlah_bayar' => 2000000,
        'status' => 'lunas',
    ]);

    $pembayaran = Pembayaran::factory()->create([
        'mahasiswa_id' => $tagihan->mahasiswa_id,
        'tagihan_ukt_id' => $tagihan->id,
        'jumlah_bayar' => 2000000,
        'status' => 'verified',
    ]);

    $response = $this->actingAs($admin)
        ->patch(route('admin.pembayaran.verify', $pembayaran->uuid));

    $response->assertStatus(422);

    // Balance must not be double-counted.
    expect((float) $tagihan->fresh()->jumlah_bayar)->toBe(2000000.0);
});

test('non-admin users cannot verify payments', function () {
    $mahasiswaUser = User::factory()->create(['role' => 'mahasiswa']);

    $tagihan = TagihanUkt::factory()->create();
    $pembayaran = Pembayaran::factory()->create([
        'mahasiswa_id' => $tagihan->mahasiswa_id,
        'tagihan_ukt_id' => $tagihan->id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($mahasiswaUser)
        ->patch(route('admin.pembayaran.verify', $pembayaran->uuid));

    $response->assertForbidden();
    expect($pembayaran->fresh()->status)->toBe('pending');
});
