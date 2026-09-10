<?php

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Materi;
use App\Models\Presensi;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * @return array{0: User, 1: Dosen, 2: Kelas}
 */
function dosenWithKelasAndMahasiswa(): array
{
    $user = User::factory()->create(['role' => 'dosen']);
    $dosen = Dosen::factory()->create(['user_id' => $user->id]);
    $kelas = Kelas::factory()->create(['dosen_id' => $dosen->id]);

    return [$user, $dosen, $kelas];
}

// ---------------------------------------------------------------------
// One-click presensi: upsert semantics
// ---------------------------------------------------------------------

test('clicking a status records presensi for that mahasiswa and date', function () {
    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create(['kelas_id' => $kelas->id, 'mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $this->actingAs($user)
        ->post(route('dosen.perkuliahan.presensi.store'), [
            'kelas_id' => $kelas->id,
            'mahasiswa_id' => $mahasiswa->id,
            'tanggal' => '2026-09-02',
            'status' => 'hadir',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('presensi', [
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-09-02',
        'status' => 'hadir',
    ]);
    $this->assertDatabaseCount('presensi', 1);
});

test('clicking a different status for the same mahasiswa and date corrects the record instead of duplicating it', function () {
    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create(['kelas_id' => $kelas->id, 'mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $submit = fn (string $status) => $this->actingAs($user)->post(route('dosen.perkuliahan.presensi.store'), [
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-09-02',
        'status' => $status,
    ]);

    $submit('hadir')->assertRedirect();
    $submit('sakit')->assertRedirect();
    $submit('alpha')->assertRedirect();

    $this->assertDatabaseCount('presensi', 1);
    $this->assertDatabaseHas('presensi', [
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-09-02',
        'status' => 'alpha',
    ]);
});

test('recording presensi for two different dates keeps both records', function () {
    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create(['kelas_id' => $kelas->id, 'mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $this->actingAs($user)->post(route('dosen.perkuliahan.presensi.store'), [
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-09-01',
        'status' => 'hadir',
    ]);
    $this->actingAs($user)->post(route('dosen.perkuliahan.presensi.store'), [
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-09-02',
        'status' => 'izin',
    ]);

    $this->assertDatabaseCount('presensi', 2);
});

test('the perkuliahan page exposes presensi hari ini keyed by mahasiswa for the selected date', function () {
    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create(['kelas_id' => $kelas->id, 'mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    Presensi::create([
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-09-02',
        'status' => 'hadir',
    ]);
    // A different date must not leak into the selected day's lookup.
    Presensi::create([
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-09-01',
        'status' => 'sakit',
    ]);

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.index', [
        'kelas_id' => $kelas->id,
        'presensi_tanggal' => '2026-09-02',
    ]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('presensiTanggal', '2026-09-02')
        ->where("presensiHariIni.{$mahasiswa->id}.status", 'hadir')
    );
});

test('defaults to today when no date is selected', function () {
    [$user] = dosenWithKelasAndMahasiswa();

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.index'));

    $response->assertInertia(fn ($page) => $page
        ->where('presensiTanggal', now()->toDateString())
    );
});

// ---------------------------------------------------------------------
// Riwayat Presensi: defaults to today, filterable, independent of the
// quick-entry grid's own date.
// ---------------------------------------------------------------------

test('riwayat presensi defaults to showing only today, not the full history', function () {
    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create(['kelas_id' => $kelas->id, 'mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    Presensi::create([
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => now()->toDateString(),
        'status' => 'hadir',
    ]);
    Presensi::create([
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => now()->subDay()->toDateString(),
        'status' => 'sakit',
    ]);

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.index', ['kelas_id' => $kelas->id]));

    $response->assertInertia(fn ($page) => $page
        ->where('riwayatTanggal', now()->toDateString())
        ->has('presensis.data', 1)
        ->where('presensis.data.0.status', 'hadir')
    );
});

test('riwayat presensi can be filtered to a specific past date', function () {
    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create(['kelas_id' => $kelas->id, 'mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    Presensi::create([
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-08-20',
        'status' => 'izin',
    ]);
    Presensi::create([
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => now()->toDateString(),
        'status' => 'hadir',
    ]);

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.index', [
        'kelas_id' => $kelas->id,
        'riwayat_tanggal' => '2026-08-20',
    ]));

    $response->assertInertia(fn ($page) => $page
        ->where('riwayatTanggal', '2026-08-20')
        ->has('presensis.data', 1)
        ->where('presensis.data.0.status', 'izin')
    );
});

test('riwayat presensi can be reset to show every date again', function () {
    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create(['kelas_id' => $kelas->id, 'mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    Presensi::create([
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => '2026-08-20',
        'status' => 'izin',
    ]);
    Presensi::create([
        'kelas_id' => $kelas->id,
        'mahasiswa_id' => $mahasiswa->id,
        'tanggal' => now()->toDateString(),
        'status' => 'hadir',
    ]);

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.index', [
        'kelas_id' => $kelas->id,
        'riwayat_tanggal' => 'all',
    ]));

    $response->assertInertia(fn ($page) => $page
        ->where('riwayatTanggal', 'all')
        ->has('presensis.data', 2)
    );
});

test('the riwayat date filter does not affect the quick-entry grid date', function () {
    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $mahasiswa = Mahasiswa::factory()->create();
    Krs::factory()->create(['kelas_id' => $kelas->id, 'mahasiswa_id' => $mahasiswa->id, 'status' => 'disetujui']);

    $response = $this->actingAs($user)->get(route('dosen.perkuliahan.index', [
        'kelas_id' => $kelas->id,
        'riwayat_tanggal' => '2026-08-20',
    ]));

    $response->assertInertia(fn ($page) => $page
        ->where('riwayatTanggal', '2026-08-20')
        ->where('presensiTanggal', now()->toDateString())
    );
});

// ---------------------------------------------------------------------
// Materi: real PDF upload to the private uploads disk
// ---------------------------------------------------------------------

test('uploading materi stores the pdf on the uploads disk with its original filename', function () {
    $disk = Storage::fake(config('filesystems.uploads'));

    [$user, , $kelas] = dosenWithKelasAndMahasiswa();

    $this->actingAs($user)
        ->post(route('dosen.perkuliahan.materi.store'), [
            'kelas_id' => $kelas->id,
            'judul' => 'Pertemuan 1 - Pengantar',
            'deskripsi' => 'Slide pembuka',
            'file' => UploadedFile::fake()->create('slide-pengantar.pdf', 500, 'application/pdf'),
        ])
        ->assertRedirect();

    $materi = Materi::firstOrFail();

    expect($materi->file_path)->toStartWith('materi/');
    expect($materi->file_name)->toBe('slide-pengantar.pdf');
    $disk->assertExists($materi->file_path);
});

test('materi upload rejects non-pdf files', function () {
    Storage::fake(config('filesystems.uploads'));

    [$user, , $kelas] = dosenWithKelasAndMahasiswa();

    $this->actingAs($user)
        ->post(route('dosen.perkuliahan.materi.store'), [
            'kelas_id' => $kelas->id,
            'judul' => 'Materi',
            'file' => UploadedFile::fake()->create('materi.docx', 100, 'application/msword'),
        ])
        ->assertSessionHasErrors('file');

    $this->assertDatabaseCount('materi', 0);
});

test('materi upload is required', function () {
    Storage::fake(config('filesystems.uploads'));

    [$user, , $kelas] = dosenWithKelasAndMahasiswa();

    $this->actingAs($user)
        ->post(route('dosen.perkuliahan.materi.store'), [
            'kelas_id' => $kelas->id,
            'judul' => 'Materi Tanpa File',
        ])
        ->assertSessionHasErrors('file');

    $this->assertDatabaseCount('materi', 0);
});

test('materi file url and download url are signed and distinct in disposition', function () {
    Storage::fake(config('filesystems.uploads'));

    [, , $kelas] = dosenWithKelasAndMahasiswa();
    $materi = Materi::create([
        'kelas_id' => $kelas->id,
        'judul' => 'Pertemuan 1',
        'file_path' => 'materi/contoh.pdf',
        'file_name' => 'contoh.pdf',
    ]);

    expect($materi->file_url)->toContain('expiration=');
    expect($materi->file_download_url)->toContain('expiration=');
});

test('materi without a file has null preview and download urls', function () {
    Storage::fake(config('filesystems.uploads'));

    [, , $kelas] = dosenWithKelasAndMahasiswa();
    $materi = Materi::create(['kelas_id' => $kelas->id, 'judul' => 'Tanpa File']);

    expect($materi->file_url)->toBeNull();
    expect($materi->file_download_url)->toBeNull();
});

test('updating materi without a new file keeps the existing attachment', function () {
    $disk = Storage::fake(config('filesystems.uploads'));
    $disk->put('materi/lama.pdf', 'isi lama');

    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $materi = Materi::create([
        'kelas_id' => $kelas->id,
        'judul' => 'Judul Lama',
        'file_path' => 'materi/lama.pdf',
        'file_name' => 'lama.pdf',
    ]);

    $this->actingAs($user)
        ->put(route('dosen.perkuliahan.materi.update', $materi), [
            'judul' => 'Judul Baru',
        ])
        ->assertRedirect();

    $materi->refresh();
    expect($materi->judul)->toBe('Judul Baru');
    expect($materi->file_path)->toBe('materi/lama.pdf');
    $disk->assertExists('materi/lama.pdf');
});

test('updating materi with a new file replaces and deletes the old one', function () {
    $disk = Storage::fake(config('filesystems.uploads'));
    $disk->put('materi/lama.pdf', 'isi lama');

    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $materi = Materi::create([
        'kelas_id' => $kelas->id,
        'judul' => 'Judul',
        'file_path' => 'materi/lama.pdf',
        'file_name' => 'lama.pdf',
    ]);

    $this->actingAs($user)
        ->put(route('dosen.perkuliahan.materi.update', $materi), [
            'judul' => 'Judul',
            'file' => UploadedFile::fake()->create('baru.pdf', 100, 'application/pdf'),
        ])
        ->assertRedirect();

    $materi->refresh();
    expect($materi->file_name)->toBe('baru.pdf');
    $disk->assertMissing('materi/lama.pdf');
    $disk->assertExists($materi->file_path);
});

test('deleting materi removes its file from the uploads disk', function () {
    $disk = Storage::fake(config('filesystems.uploads'));
    $disk->put('materi/dihapus.pdf', 'isi');

    [$user, , $kelas] = dosenWithKelasAndMahasiswa();
    $materi = Materi::create([
        'kelas_id' => $kelas->id,
        'judul' => 'Akan Dihapus',
        'file_path' => 'materi/dihapus.pdf',
        'file_name' => 'dihapus.pdf',
    ]);

    $this->actingAs($user)
        ->delete(route('dosen.perkuliahan.materi.destroy', $materi))
        ->assertRedirect();

    $disk->assertMissing('materi/dihapus.pdf');
    $this->assertDatabaseCount('materi', 0);
});
