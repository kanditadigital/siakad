<?php

use App\Models\AcademicYearSemester;
use App\Models\Krs;
use App\Models\TagihanUkt;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Cache::flush();
});

test('the sidebar receives the active academic period and its running week', function () {
    AcademicYearSemester::query()->update(['status' => 'nonaktif']);
    AcademicYearSemester::factory()->create([
        'nama_tahun_akademik' => '2026/2027',
        'semester' => 'Ganjil',
        'status' => 'aktif',
        'tanggal_mulai' => now()->subWeeks(3),
    ]);

    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('chrome.periode.label', '2026/2027 — Ganjil')
            ->where('chrome.periode.pekan', 4)
        );
});

test('staff see pending-work counts in the chrome', function () {
    Krs::factory()->count(2)->create(['status' => 'pending']);
    TagihanUkt::factory()->count(3)->create(['status' => 'belum']);
    TagihanUkt::factory()->create(['status' => 'lunas']);

    $this->actingAs(User::factory()->create(['role' => 'admin']))
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('chrome.tugas.krs_pending', 2)
            ->where('chrome.tugas.tagihan_belum_lunas', 3)
        );
});

test('non-staff roles get no institution-wide counts', function (string $role) {
    Krs::factory()->create(['status' => 'pending']);

    $this->actingAs(User::factory()->create(['role' => $role]))
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('chrome.tugas', null));
})->with(['dosen', 'mahasiswa']);
