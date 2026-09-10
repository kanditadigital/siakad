<?php

use App\Events\TugasTertundaDiperbarui;
use App\Models\Krs;
use App\Models\TagihanUkt;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    Cache::flush();
});

test('creating a pending krs broadcasts the refreshed counts', function () {
    Event::fake([TugasTertundaDiperbarui::class]);

    Krs::factory()->count(2)->create(['status' => 'pending']);

    Event::assertDispatched(
        TugasTertundaDiperbarui::class,
        fn (TugasTertundaDiperbarui $event) => $event->tugas === [
            'krs_pending' => 2,
            'tagihan_belum_lunas' => 0,
        ],
    );
});

test('a tagihan ukt status change broadcasts the refreshed counts', function () {
    $tagihan = TagihanUkt::factory()->create(['status' => 'belum']);

    Event::fake([TugasTertundaDiperbarui::class]);

    $tagihan->update(['status' => 'lunas']);

    Event::assertDispatched(
        TugasTertundaDiperbarui::class,
        fn (TugasTertundaDiperbarui $event) => $event->tugas === [
            'krs_pending' => 0,
            'tagihan_belum_lunas' => 0,
        ],
    );
});

test('only staff roles may authorize on the tugas broadcast channel', function (string $role, int $status) {
    // The "null" broadcaster used elsewhere in tests (see phpunit.xml) skips
    // auth entirely, so switch to the real Pusher-protocol signing Reverb
    // uses (local HMAC, no network call) and re-run routes/channels.php,
    // since the channel closures registered on the "null" broadcaster at
    // boot don't carry over to this freshly built driver instance.
    config(['broadcasting.default' => 'reverb']);
    require base_path('routes/channels.php');

    $this->actingAs(User::factory()->create(['role' => $role]))
        ->post('/broadcasting/auth', [
            'channel_name' => 'private-tugas',
            'socket_id' => '1234.5678',
        ])
        ->assertStatus($status);
})->with([
    ['admin', 200],
    ['admin_prodi', 200],
    ['pimpinan', 200],
    ['dosen', 403],
    ['mahasiswa', 403],
]);
