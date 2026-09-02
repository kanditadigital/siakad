<?php

use App\Models\Mahasiswa;
use App\Models\Pembayaran;
use App\Models\TagihanUkt;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can manually record a payment which is immediately verified and reconciled', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tagihan = TagihanUkt::factory()->create([
        'jumlah_tagihan' => 2000000,
        'jumlah_bayar' => 0,
        'status' => 'belum',
        'jatuh_tempo' => now()->addMonth(),
    ]);

    $response = $this->actingAs($admin)->post(route('admin.pembayaran.store'), [
        'tagihan_ukt_id' => $tagihan->id,
        'jumlah_bayar' => 2000000,
        'tanggal_bayar' => now()->toDateString(),
        'metode_pembayaran' => 'cash',
        'keterangan' => 'Bayar tunai di kantor',
    ]);

    $response->assertRedirect(route('admin.pembayaran.index'));

    $this->assertDatabaseHas('pembayaran', [
        'tagihan_ukt_id' => $tagihan->id,
        'status' => 'verified',
    ]);

    expect($tagihan->fresh()->status)->toBe('lunas');
});

test('mahasiswa can upload proof of payment for their own tagihan', function () {
    Storage::fake(config('filesystems.uploads'));

    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $tagihan = TagihanUkt::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'status' => 'belum']);

    $response = $this->actingAs($user)->post(route('mahasiswa.pembayaran.store', $tagihan->uuid), [
        'jumlah_bayar' => 1000000,
        'tanggal_bayar' => now()->toDateString(),
        'metode_pembayaran' => 'transfer',
        'bukti_pembayaran' => UploadedFile::fake()->image('bukti.jpg'),
    ]);

    $response->assertRedirect(route('mahasiswa.tagihan-ukt'));

    $this->assertDatabaseHas('pembayaran', [
        'tagihan_ukt_id' => $tagihan->id,
        'mahasiswa_id' => $mahasiswa->id,
        'status' => 'pending',
    ]);

    $pembayaran = Pembayaran::where('tagihan_ukt_id', $tagihan->id)->first();
    Storage::disk(config('filesystems.uploads'))->assertExists($pembayaran->bukti_pembayaran);
});

test('mahasiswa cannot upload payment proof for another mahasiswa tagihan', function () {
    $user = User::factory()->create(['role' => 'mahasiswa']);
    Mahasiswa::factory()->create(['user_id' => $user->id]);
    $otherTagihan = TagihanUkt::factory()->create();

    $response = $this->actingAs($user)->post(route('mahasiswa.pembayaran.store', $otherTagihan->uuid), [
        'jumlah_bayar' => 500000,
        'tanggal_bayar' => now()->toDateString(),
        'metode_pembayaran' => 'transfer',
        'bukti_pembayaran' => UploadedFile::fake()->image('bukti.jpg'),
    ]);

    $response->assertForbidden();
});

test('admin can download kuitansi pdf for a verified payment', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tagihan = TagihanUkt::factory()->create();
    $pembayaran = Pembayaran::factory()->create([
        'tagihan_ukt_id' => $tagihan->id,
        'mahasiswa_id' => $tagihan->mahasiswa_id,
        'status' => 'verified',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.pembayaran.kuitansi', $pembayaran->uuid));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

test('kuitansi cannot be downloaded for a pending payment', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $tagihan = TagihanUkt::factory()->create();
    $pembayaran = Pembayaran::factory()->create([
        'tagihan_ukt_id' => $tagihan->id,
        'mahasiswa_id' => $tagihan->mahasiswa_id,
        'status' => 'pending',
    ]);

    $response = $this->actingAs($admin)->get(route('admin.pembayaran.kuitansi', $pembayaran->uuid));

    $response->assertNotFound();
});
