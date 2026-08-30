<?php

use App\Http\Controllers\Mahasiswa\KhsController;
use App\Http\Controllers\Mahasiswa\KrsController;
use App\Http\Controllers\Mahasiswa\ProfilController;
use App\Http\Controllers\Mahasiswa\TagihanUktController;
use App\Http\Controllers\Mahasiswa\TranskripNilaiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:mahasiswa'])->prefix('mahasiswa')->name('mahasiswa.')->group(function () {
    // Profil
    Route::get('profil', [ProfilController::class, 'index'])->name('profil');

    // KRS
    Route::get('krs', [KrsController::class, 'index'])->name('krs');

    // KHS
    Route::get('khs', [KhsController::class, 'index'])->name('khs');

    // Transkrip Nilai
    Route::get('transkrip-nilai', [TranskripNilaiController::class, 'index'])->name('transkrip-nilai');

    // Tagihan UKT
    Route::get('tagihan-ukt', [TagihanUktController::class, 'index'])->name('tagihan-ukt');
});
