<?php

use App\Models\Dosen;
use App\Models\Mahasiswa;
use App\Models\Pembayaran;
use App\Models\Rps;
use App\Models\TagihanUkt;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('the uploads disk is a private s3 bucket by default', function () {
    expect(config('filesystems.uploads'))->toBe('uploads');
    expect(config('filesystems.disks.uploads.driver'))->toBe('s3');
    expect(config('filesystems.disks.uploads.visibility'))->toBe('private');
});

test('an uploaded photo lands on the uploads disk and never on the public disk', function () {
    Storage::fake(config('filesystems.uploads'));
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->post(route('admin.user.store'), [
            'name' => 'Pengguna Baru',
            'email' => 'baru@example.test',
            'role' => 'dosen',
            'password' => 'rahasia-panjang-123',
            'password_confirmation' => 'rahasia-panjang-123',
            'photo' => UploadedFile::fake()->image('avatar.jpg'),
        ])
        ->assertRedirect();

    $photo = User::where('email', 'baru@example.test')->value('photo');

    expect($photo)->toStartWith('photos/');
    Storage::disk(config('filesystems.uploads'))->assertExists($photo);
    Storage::disk('public')->assertMissing($photo);
});

test('bukti pembayaran lands on the uploads disk', function () {
    Storage::fake(config('filesystems.uploads'));
    Storage::fake('public');

    $user = User::factory()->create(['role' => 'mahasiswa']);
    $mahasiswa = Mahasiswa::factory()->create(['user_id' => $user->id]);
    $tagihan = TagihanUkt::factory()->create(['mahasiswa_id' => $mahasiswa->id]);

    $this->actingAs($user)
        ->post(route('mahasiswa.pembayaran.store', $tagihan), [
            'jumlah_bayar' => 500000,
            'tanggal_bayar' => '2026-09-01',
            'metode_pembayaran' => 'transfer',
            'bukti_pembayaran' => UploadedFile::fake()->image('bukti.jpg'),
        ])
        ->assertRedirect();

    $bukti = Pembayaran::firstOrFail()->bukti_pembayaran;

    expect($bukti)->toStartWith('bukti-pembayaran/');
    Storage::disk(config('filesystems.uploads'))->assertExists($bukti);
    Storage::disk('public')->assertMissing($bukti);
});

test('file urls are expiring links, not permanent paths', function () {
    Storage::fake(config('filesystems.uploads'));

    $user = User::factory()->create(['photo' => 'photos/avatar.jpg']);
    $pembayaran = Pembayaran::factory()->create(['bukti_pembayaran' => 'bukti-pembayaran/bukti.jpg']);
    $rps = Rps::factory()->create(['file_path' => 'rps/dokumen.pdf']);

    expect($user->photo_url)->toContain('expiration=')
        ->and($pembayaran->bukti_pembayaran_url)->toContain('expiration=')
        ->and($rps->file_url)->toContain('expiration=');
});

test('file urls are null when no file is attached', function () {
    Storage::fake(config('filesystems.uploads'));

    expect(User::factory()->create(['photo' => null])->photo_url)->toBeNull();
    expect(Rps::factory()->create(['file_path' => null])->file_url)->toBeNull();
});

test('replacing a photo deletes the previous file from the uploads disk', function () {
    $disk = Storage::fake(config('filesystems.uploads'));

    $admin = User::factory()->create(['role' => 'admin']);
    $disk->put('photos/lama.jpg', 'isi lama');

    $target = User::factory()->create(['role' => 'dosen', 'photo' => 'photos/lama.jpg']);
    Dosen::factory()->create(['user_id' => $target->id]);

    $this->actingAs($admin)
        ->put(route('admin.user.update', $target), [
            'name' => $target->name,
            'email' => $target->email,
            'role' => 'dosen',
            'photo' => UploadedFile::fake()->image('baru.jpg'),
        ])
        ->assertRedirect();

    $disk->assertMissing('photos/lama.jpg');
    $disk->assertExists($target->fresh()->photo);
});

test('a page renders the signed photo url instead of a storage path', function () {
    Storage::fake(config('filesystems.uploads'));

    $admin = User::factory()->create(['role' => 'admin', 'photo' => 'photos/avatar.jpg']);

    $this->actingAs($admin)
        ->get(route('admin.user.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/user/index')
            ->where('users.data.0.photo_url', fn (?string $url) => str_contains((string) $url, 'expiration='))
        );
});

test('the shared auth user carries a signed photo url for the sidebar avatar', function () {
    Storage::fake(config('filesystems.uploads'));

    $user = User::factory()->create(['role' => 'admin', 'photo' => 'photos/avatar.jpg']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('auth.user.photo_url', fn (?string $url) => str_contains((string) $url, 'expiration='))
        );
});

test('the shared auth user has a null photo url when no photo is set', function () {
    Storage::fake(config('filesystems.uploads'));

    $user = User::factory()->create(['role' => 'admin', 'photo' => null]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('auth.user.photo_url', null));
});
