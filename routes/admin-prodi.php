<?php

use App\Http\Controllers\AdminProdi\DashboardController;
use App\Http\Controllers\AdminProdi\DosenController;
use App\Http\Controllers\AdminProdi\DosenPaController;
use App\Http\Controllers\AdminProdi\KrsController;
use App\Http\Controllers\AdminProdi\MahasiswaController;
use App\Http\Controllers\AdminProdi\MataKuliahController;
use App\Http\Controllers\AdminProdi\NilaiController;
use App\Http\Controllers\AdminProdi\PenjadwalanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin_prodi'])->prefix('admin-prodi')->name('admin-prodi.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Mahasiswa (read-only, plus dosen PA assignment)
    Route::get('mahasiswa', [MahasiswaController::class, 'index'])->name('mahasiswa.index');
    Route::post('mahasiswa/naikkan-semester', [MahasiswaController::class, 'naikkanSemester'])->name('mahasiswa.naikkan-semester');
    Route::get('mahasiswa/{mahasiswa}', [MahasiswaController::class, 'show'])->name('mahasiswa.show');
    Route::patch('mahasiswa/{mahasiswa}/dosen-pa', [MahasiswaController::class, 'updateDosenPa'])->name('mahasiswa.dosen-pa.update');

    // Dosen PA (overview of all mahasiswa with their assigned dosen PA)
    Route::get('dosen-pa', [DosenPaController::class, 'index'])->name('dosen-pa.index');

    // Dosen (full CRUD, scoped to this admin's program studi)
    Route::get('dosen', [DosenController::class, 'index'])->name('dosen.index');
    Route::get('dosen/create', [DosenController::class, 'create'])->name('dosen.create');
    Route::post('dosen', [DosenController::class, 'store'])->name('dosen.store');
    Route::get('dosen/{dosen}', [DosenController::class, 'show'])->name('dosen.show');
    Route::get('dosen/{dosen}/edit', [DosenController::class, 'edit'])->name('dosen.edit');
    Route::put('dosen/{dosen}', [DosenController::class, 'update'])->name('dosen.update');
    Route::delete('dosen/{dosen}', [DosenController::class, 'destroy'])->name('dosen.destroy');

    // Mata Kuliah (full CRUD, scoped to this admin's program studi)
    Route::get('mata-kuliah', [MataKuliahController::class, 'index'])->name('mata-kuliah.index');
    Route::get('mata-kuliah/create', [MataKuliahController::class, 'create'])->name('mata-kuliah.create');
    Route::post('mata-kuliah', [MataKuliahController::class, 'store'])->name('mata-kuliah.store');
    Route::get('mata-kuliah/{mataKuliah}', [MataKuliahController::class, 'show'])->name('mata-kuliah.show');
    Route::get('mata-kuliah/{mataKuliah}/edit', [MataKuliahController::class, 'edit'])->name('mata-kuliah.edit');
    Route::put('mata-kuliah/{mataKuliah}', [MataKuliahController::class, 'update'])->name('mata-kuliah.update');
    Route::delete('mata-kuliah/{mataKuliah}', [MataKuliahController::class, 'destroy'])->name('mata-kuliah.destroy');

    // Penjadwalan (full CRUD, scoped to this admin's program studi)
    Route::get('penjadwalan', [PenjadwalanController::class, 'index'])->name('penjadwalan.index');
    Route::get('penjadwalan/create', [PenjadwalanController::class, 'create'])->name('penjadwalan.create');
    Route::post('penjadwalan', [PenjadwalanController::class, 'store'])->name('penjadwalan.store');
    Route::get('penjadwalan/{kelas}', [PenjadwalanController::class, 'show'])->name('penjadwalan.show');
    Route::get('penjadwalan/{kelas}/edit', [PenjadwalanController::class, 'edit'])->name('penjadwalan.edit');
    Route::put('penjadwalan/{kelas}', [PenjadwalanController::class, 'update'])->name('penjadwalan.update');
    Route::delete('penjadwalan/{kelas}', [PenjadwalanController::class, 'destroy'])->name('penjadwalan.destroy');

    // KRS (view + approve/reject, scoped to this admin's program studi)
    Route::get('krs', [KrsController::class, 'index'])->name('krs.index');
    Route::get('krs/{krs}', [KrsController::class, 'show'])->name('krs.show');
    Route::patch('krs/{krs}/approve', [KrsController::class, 'approve'])->name('krs.approve');
    Route::patch('krs/{krs}/reject', [KrsController::class, 'reject'])->name('krs.reject');

    // Nilai (read-only)
    Route::get('nilai', [NilaiController::class, 'index'])->name('nilai.index');
    Route::get('nilai/{nilai}', [NilaiController::class, 'show'])->name('nilai.show');
});
