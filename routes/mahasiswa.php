<?php

use App\Http\Controllers\Mahasiswa\JadwalController;
use App\Http\Controllers\Mahasiswa\KehadiranController;
use App\Http\Controllers\Mahasiswa\KhsController;
use App\Http\Controllers\Mahasiswa\KrsController;
use App\Http\Controllers\Mahasiswa\PembayaranController;
use App\Http\Controllers\Mahasiswa\PengajuanJudulTaController;
use App\Http\Controllers\Mahasiswa\ProfilController;
use App\Http\Controllers\Mahasiswa\ProgressTugasAkhirController;
use App\Http\Controllers\Mahasiswa\TagihanUktController;
use App\Http\Controllers\Mahasiswa\TranskripNilaiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:mahasiswa'])->prefix('mahasiswa')->name('mahasiswa.')->group(function () {
    // Profil
    Route::get('profil', [ProfilController::class, 'index'])->name('profil');

    // KRS
    Route::get('krs', [KrsController::class, 'index'])->name('krs');
    Route::get('krs/create', [KrsController::class, 'create'])->name('krs.create');
    Route::post('krs', [KrsController::class, 'store'])->name('krs.store');
    Route::get('krs/export-pdf', [KrsController::class, 'exportPdf'])->name('krs.export-pdf');
    Route::delete('krs/{krs}', [KrsController::class, 'destroy'])->name('krs.destroy');

    // Jadwal Perkuliahan
    Route::get('jadwal', [JadwalController::class, 'index'])->name('jadwal');

    // Kehadiran
    Route::get('kehadiran', [KehadiranController::class, 'index'])->name('kehadiran');

    // KHS
    Route::get('khs', [KhsController::class, 'index'])->name('khs');
    Route::get('khs/export-pdf', [KhsController::class, 'exportPdf'])->name('khs.export-pdf');

    // Transkrip Nilai
    Route::get('transkrip-nilai', [TranskripNilaiController::class, 'index'])->name('transkrip-nilai');
    Route::get('transkrip-nilai/export-pdf', [TranskripNilaiController::class, 'exportPdf'])->name('transkrip-nilai.export-pdf');

    // Tagihan UKT
    Route::get('tagihan-ukt', [TagihanUktController::class, 'index'])->name('tagihan-ukt');

    // Pembayaran (upload bukti transfer)
    Route::get('tagihan-ukt/{tagihanUkt}/bayar', [PembayaranController::class, 'create'])->name('pembayaran.create');
    Route::post('tagihan-ukt/{tagihanUkt}/bayar', [PembayaranController::class, 'store'])->name('pembayaran.store');

    // Pengajuan Judul Tugas Akhir (maks. 3 judul aktif)
    Route::get('pengajuan-judul-ta', [PengajuanJudulTaController::class, 'index'])->name('pengajuan-judul-ta.index');
    Route::post('pengajuan-judul-ta', [PengajuanJudulTaController::class, 'store'])->name('pengajuan-judul-ta.store');
    Route::delete('pengajuan-judul-ta/{pengajuanJudulTa}', [PengajuanJudulTaController::class, 'destroy'])->name('pengajuan-judul-ta.destroy');

    // Progress Tugas Akhir — mahasiswa can only add catatan; tahap/revisi/judul stay pembimbing-only
    Route::post('bimbingan-tugas-akhir/progress', [ProgressTugasAkhirController::class, 'store'])->name('bimbingan-tugas-akhir.progress.store');
});
