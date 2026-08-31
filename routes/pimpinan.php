<?php

use App\Http\Controllers\Pimpinan\LaporanController;
use App\Http\Controllers\Pimpinan\MonitoringAkademikController;
use App\Http\Controllers\Pimpinan\MonitoringKeuanganController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:pimpinan'])->prefix('pimpinan')->name('pimpinan.')->group(function () {
    Route::get('monitoring-akademik', [MonitoringAkademikController::class, 'index'])->name('monitoring-akademik');
    Route::get('monitoring-keuangan', [MonitoringKeuanganController::class, 'index'])->name('monitoring-keuangan');
    Route::get('laporan', [LaporanController::class, 'index'])->name('laporan');
});
