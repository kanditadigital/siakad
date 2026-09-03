<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PencarianController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth', 'verified', 'role:admin,admin_prodi'])->group(function () {
    Route::get('pencarian', [PencarianController::class, 'index'])->name('pencarian');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
require __DIR__.'/dosen.php';
