<?php

use App\Http\Controllers\AdminProdi\DashboardController;
use App\Http\Controllers\AdminProdi\DosenController;
use App\Http\Controllers\AdminProdi\KrsController;
use App\Http\Controllers\AdminProdi\MahasiswaController;
use App\Http\Controllers\AdminProdi\NilaiController;
use App\Http\Controllers\AdminProdi\PenjadwalanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin_prodi'])->prefix('admin-prodi')->name('admin-prodi.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Mahasiswa (read-only)
    Route::get('mahasiswa', [MahasiswaController::class, 'index'])->name('mahasiswa.index');
    Route::get('mahasiswa/{mahasiswa}', [MahasiswaController::class, 'show'])->name('mahasiswa.show');

    // Dosen (read-only)
    Route::get('dosen', [DosenController::class, 'index'])->name('dosen.index');
    Route::get('dosen/{dosen}', [DosenController::class, 'show'])->name('dosen.show');

    // Penjadwalan (read-only)
    Route::get('penjadwalan', [PenjadwalanController::class, 'index'])->name('penjadwalan.index');
    Route::get('penjadwalan/{kelas}', [PenjadwalanController::class, 'show'])->name('penjadwalan.show');

    // KRS (read-only)
    Route::get('krs', [KrsController::class, 'index'])->name('krs.index');
    Route::get('krs/{krs}', [KrsController::class, 'show'])->name('krs.show');

    // Nilai (read-only)
    Route::get('nilai', [NilaiController::class, 'index'])->name('nilai.index');
    Route::get('nilai/{nilai}', [NilaiController::class, 'show'])->name('nilai.show');
});
