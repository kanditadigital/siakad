<?php

use App\Models\ProgramStudi;

test('generateNim produces {tanggal+bulan berdiri PT}{tahun masuk}{kode prodi}{nomor urut}', function () {
    $programStudi = ProgramStudi::factory()->create([
        'nim_prefix' => '02',
        'nim_counter' => 0,
        'nim_digit_count' => 3,
        'nim_year_digits' => 2,
    ]);

    $nim = $programStudi->generateNim();

    $yearSuffix = substr((string) now()->year, -2);

    expect($nim)->toBe("149{$yearSuffix}02001");
});

test('generateNim increments the nomor urut per call and keeps the fixed 149 segment', function () {
    $programStudi = ProgramStudi::factory()->create([
        'nim_prefix' => '02',
        'nim_counter' => 0,
        'nim_digit_count' => 3,
        'nim_year_digits' => 2,
    ]);

    $first = $programStudi->generateNim();
    $second = $programStudi->generateNim();

    $yearSuffix = substr((string) now()->year, -2);

    expect($first)->toBe("149{$yearSuffix}02001");
    expect($second)->toBe("149{$yearSuffix}02002");
});
