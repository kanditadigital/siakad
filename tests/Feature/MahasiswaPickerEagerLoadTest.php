<?php

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * `Mahasiswa` appends `batas_semester_normal` to every serialized instance
 * (see Mahasiswa::getBatasSemesterNormalAttribute()), which lazy-loads
 * `programStudi` unless it's eager-loaded — these dropdown pickers list
 * every mahasiswa, so a missing eager load turns into one query per row.
 */
test('yudisium create page eager-loads programStudi for the mahasiswa picker', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Mahasiswa::factory()->count(10)->create();

    DB::enableQueryLog();
    $this->actingAs($admin)->get(route('admin.yudisium.create'))->assertOk();
    $programStudiQueries = collect(DB::getQueryLog())
        ->filter(fn ($q) => str_contains($q['query'], '"program_studi"'))
        ->count();
    DB::disableQueryLog();

    expect($programStudiQueries)->toBe(1);
});

test('tagihan ukt create page eager-loads programStudi for the mahasiswa picker', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    Mahasiswa::factory()->count(10)->create();

    DB::enableQueryLog();
    $this->actingAs($admin)->get(route('admin.tagihan-ukt.create'))->assertOk();
    $programStudiQueries = collect(DB::getQueryLog())
        ->filter(fn ($q) => str_contains($q['query'], '"program_studi"'))
        ->count();
    DB::disableQueryLog();

    expect($programStudiQueries)->toBe(1);
});
