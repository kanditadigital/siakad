<?php

use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

function validSettingsPayload(array $overrides = []): array
{
    return array_replace_recursive([
        'identitas' => [
            'nama_kampus' => 'STIT Daarurrahmah Sepadan',
            'alamat' => 'Sepadan, Kec. Rundeng, Kota Subulussalam, Aceh',
            'website' => 'stit-daras.ac.id',
        ],
        'krs' => [
            'sks_maks' => 24,
            'sks_min' => 12,
            'dibuka' => true,
        ],
        'nilai' => [
            'bobot_tugas' => 20,
            'bobot_uts' => 25,
            'bobot_uas' => 30,
            'bobot_partisipasi' => 10,
            'bobot_kehadiran' => 15,
            'periode_input_dibuka' => true,
        ],
        'notifikasi' => [
            'email_aktif' => true,
            'tagihan_aktif' => true,
        ],
    ], $overrides);
}

test('pengaturan page shows sensible defaults before anything is saved', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->get(route('admin.pengaturan.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/pengaturan/index')
        ->where('settings.identitas.nama_kampus', 'STIT Daarurrahmah Sepadan')
        ->where('settings.krs.sks_maks', 24)
    );
});

test('admin can persist settings and they are read back on the next request', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->put(route('admin.pengaturan.update'), validSettingsPayload([
        'identitas' => ['nama_kampus' => 'Kampus Baru'],
    ]));

    $response->assertRedirect(route('admin.pengaturan.index'));

    $this->assertDatabaseHas('settings', ['key' => 'identitas.nama_kampus', 'value' => 'Kampus Baru']);

    $second = $this->actingAs($admin)->get(route('admin.pengaturan.index'));
    $second->assertInertia(fn ($page) => $page->where('settings.identitas.nama_kampus', 'Kampus Baru'));
});

test('nilai bobot must total 100 percent', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->put(route('admin.pengaturan.update'), validSettingsPayload([
        'nilai' => ['bobot_tugas' => 50],
    ]));

    $response->assertSessionHasErrors('nilai.bobot_tugas');
    $this->assertDatabaseMissing('settings', ['key' => 'nilai.bobot_tugas', 'value' => '50']);
});

test('a corrupted settings cache entry self-heals instead of throwing', function () {
    Setting::set('identitas.nama_kampus', 'Kampus Dari DB');

    // Simulate a stale/corrupted cache entry (e.g. unserialize() producing
    // something other than a Collection) sitting under the cache key.
    Cache::forever('settings.all', new stdClass);

    $settings = Setting::allSettings();

    expect($settings)->toBeInstanceOf(Collection::class);
    expect($settings->get('identitas.nama_kampus'))->toBe('Kampus Dari DB');
});

test('uploading a new logo replaces and deletes the old one', function () {
    Storage::fake(config('filesystems.uploads'));
    $admin = User::factory()->create(['role' => 'admin']);

    Setting::set('identitas.logo', 'logo/old.png');
    Storage::disk(config('filesystems.uploads'))->put('logo/old.png', 'fake');

    $response = $this->actingAs($admin)->put(route('admin.pengaturan.update'), array_merge(
        validSettingsPayload(),
        ['identitas' => array_merge(validSettingsPayload()['identitas'], [
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])],
    ));

    $response->assertRedirect(route('admin.pengaturan.index'));

    Storage::disk(config('filesystems.uploads'))->assertMissing('logo/old.png');
    $newLogo = Setting::get('identitas.logo');
    expect($newLogo)->not->toBe('logo/old.png');
    Storage::disk(config('filesystems.uploads'))->assertExists($newLogo);
});
