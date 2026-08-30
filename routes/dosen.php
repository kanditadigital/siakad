<?php

use App\Http\Controllers\Dosen\DosenProfileController;
use App\Http\Controllers\Dosen\MahasiswaAsuhController;
use App\Http\Controllers\Dosen\PerkuliahanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:dosen'])->prefix('dosen')->name('dosen.')->group(function () {
    // Profil
    Route::get('profil', [DosenProfileController::class, 'show'])->name('profil.show');
    Route::get('profil/edit', [DosenProfileController::class, 'edit'])->name('profil.edit');
    Route::put('profil', [DosenProfileController::class, 'update'])->name('profil.update');

    // Perkuliahan
    Route::get('perkuliahan', [PerkuliahanController::class, 'index'])->name('perkuliahan.index');
    Route::post('perkuliahan/presensi', [PerkuliahanController::class, 'storePresensi'])->name('perkuliahan.presensi.store');
    Route::put('perkuliahan/presensi/{presensi}', [PerkuliahanController::class, 'updatePresensi'])->name('perkuliahan.presensi.update');
    Route::post('perkuliahan/materi', [PerkuliahanController::class, 'storeMateri'])->name('perkuliahan.materi.store');
    Route::put('perkuliahan/materi/{materi}', [PerkuliahanController::class, 'updateMateri'])->name('perkuliahan.materi.update');
    Route::delete('perkuliahan/materi/{materi}', [PerkuliahanController::class, 'destroyMateri'])->name('perkuliahan.materi.destroy');
    Route::put('perkuliahan/nilai/{krs}', [PerkuliahanController::class, 'updateNilai'])->name('perkuliahan.nilai.update');

    // Mahasiswa Asuh
    Route::get('mahasiswa-asuh', [MahasiswaAsuhController::class, 'index'])->name('mahasiswa-asuh.index');
    Route::put('mahasiswa-asuh/{mahasiswa}', [MahasiswaAsuhController::class, 'update'])->name('mahasiswa-asuh.update');
    Route::delete('mahasiswa-asuh/{mahasiswa}', [MahasiswaAsuhController::class, 'destroy'])->name('mahasiswa-asuh.destroy');
});
