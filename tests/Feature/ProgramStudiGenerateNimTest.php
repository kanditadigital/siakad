<?php

use App\Models\ProgramStudi;

test('generateNim produces {kode wajib}{tahun}{01 tetap}{nomor urut}', function () {
    $programStudi = ProgramStudi::factory()->create([
        'nim_prefix' => '149',
        'nim_counter' => 0,
        'nim_digit_count' => 3,
        'nim_year_digits' => 2,
    ]);

    $nim = $programStudi->generateNim();

    $yearSuffix = substr((string) now()->year, -2);

    expect($nim)->toBe("149{$yearSuffix}01001");
});

test('generateNim increments the nomor urut per call and keeps the fixed 01 segment', function () {
    $programStudi = ProgramStudi::factory()->create([
        'nim_prefix' => '149',
        'nim_counter' => 0,
        'nim_digit_count' => 3,
        'nim_year_digits' => 2,
    ]);

    $first = $programStudi->generateNim();
    $second = $programStudi->generateNim();

    $yearSuffix = substr((string) now()->year, -2);

    expect($first)->toBe("149{$yearSuffix}01001");
    expect($second)->toBe("149{$yearSuffix}01002");
});
