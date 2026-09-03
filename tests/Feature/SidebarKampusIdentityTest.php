<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('the sidebar receives the campus name set in pengaturan sistem', function () {
    Storage::fake(config('filesystems.uploads'));
    Setting::set('identitas.nama_kampus', 'STIT Daarurrahmah Sepadan');

    $user = User::factory()->create(['role' => 'admin']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('kampus.nama', 'STIT Daarurrahmah Sepadan')
        );
});

test('the campus name falls back to the app name before any setting is saved', function () {
    Storage::fake(config('filesystems.uploads'));

    $user = User::factory()->create(['role' => 'admin']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('kampus.nama', config('app.name')));
});

test('an uploaded logo reaches the sidebar as an expiring signed url', function () {
    Storage::fake(config('filesystems.uploads'));
    Setting::set('identitas.logo', 'logo/kampus.png');

    $user = User::factory()->create(['role' => 'mahasiswa']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('kampus.logo_url', fn (?string $url) => str_contains((string) $url, 'expiration='))
        );
});

test('the logo url is null when no logo has been uploaded', function () {
    Storage::fake(config('filesystems.uploads'));

    $user = User::factory()->create(['role' => 'admin']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('kampus.logo_url', null));
});

test('campus identity reaches every role, not just admin', function (string $role) {
    Storage::fake(config('filesystems.uploads'));
    Setting::set('identitas.nama_kampus', 'Kampus Uji');
    Setting::set('identitas.logo', 'logo/kampus.png');

    $user = User::factory()->create(['role' => $role]);

    // admin_prodi has its own dashboard route; follow the redirect so every
    // role is asserted on the page it actually lands on.
    $this->actingAs($user)
        ->followingRedirects()
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('kampus.nama', 'Kampus Uji')
            ->where('kampus.logo_url', fn (?string $url) => str_contains((string) $url, 'expiration='))
        );
})->with(['admin', 'admin_prodi', 'dosen', 'mahasiswa', 'pimpinan']);

test('uploading a new logo in pengaturan replaces what the sidebar shows', function () {
    $disk = Storage::fake(config('filesystems.uploads'));
    $disk->put('logo/lama.png', 'logo lama');
    Setting::set('identitas.logo', 'logo/lama.png');

    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->put(route('admin.pengaturan.update'), [
            'identitas' => [
                'nama_kampus' => 'Kampus Baru',
                'alamat' => 'Alamat',
                'website' => 'contoh.ac.id',
                'logo' => UploadedFile::fake()->image('baru.png'),
            ],
            'krs' => ['sks_maks' => 24, 'sks_min' => 12, 'dibuka' => true],
            'nilai' => [
                'periode_input_dibuka' => true,
            ],
            'notifikasi' => ['email_aktif' => true, 'tagihan_aktif' => true],
        ])
        ->assertRedirect();

    $disk->assertMissing('logo/lama.png');

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page
            ->where('kampus.nama', 'Kampus Baru')
            ->where('kampus.logo_url', fn (?string $url) => str_contains((string) $url, 'expiration='))
        );
});
