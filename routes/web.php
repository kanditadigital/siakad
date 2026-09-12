<?php

use App\Http\Controllers\Auth\ForcePasswordChangeController;
use App\Http\Controllers\ChromeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PencarianController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('password/force-change', [ForcePasswordChangeController::class, 'edit'])
        ->name('password.force-change.edit');
    Route::put('password/force-change', [ForcePasswordChangeController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.force-change.update');
});

Route::middleware(['auth', 'verified', 'role:admin,admin_prodi'])->group(function () {
    Route::get('pencarian', [PencarianController::class, 'index'])->name('pencarian');
});

Route::middleware(['auth', 'verified', 'role:admin,admin_prodi,pimpinan'])->group(function () {
    Route::get('chrome/tugas', [ChromeController::class, 'tugas'])->name('chrome.tugas');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/dosen.php';
