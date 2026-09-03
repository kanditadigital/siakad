<?php

use App\Http\Controllers\Dosen\BimbinganAkademikController;
use App\Http\Controllers\Dosen\BimbinganTugasAkhirController;
use App\Http\Controllers\Dosen\DosenProfileController;
use App\Http\Controllers\Dosen\KrsPaController;
use App\Http\Controllers\Dosen\MahasiswaAsuhController;
use App\Http\Controllers\Dosen\PengaturanNilaiController;
use App\Http\Controllers\Dosen\PerkuliahanController;
use App\Http\Controllers\Dosen\RiwayatPendidikanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:dosen'])->prefix('dosen')->name('dosen.')->group(function () {
    // Profil
    Route::get('profil', [DosenProfileController::class, 'show'])->name('profil.show');
    Route::get('profil/edit', [DosenProfileController::class, 'edit'])->name('profil.edit');
    Route::put('profil', [DosenProfileController::class, 'update'])->name('profil.update');

    // Riwayat Pendidikan
    Route::post('riwayat-pendidikan', [RiwayatPendidikanController::class, 'store'])->name('riwayat-pendidikan.store');
    Route::put('riwayat-pendidikan/{riwayatPendidikan}', [RiwayatPendidikanController::class, 'update'])->name('riwayat-pendidikan.update');
    Route::delete('riwayat-pendidikan/{riwayatPendidikan}', [RiwayatPendidikanController::class, 'destroy'])->name('riwayat-pendidikan.destroy');

    // Pengaturan Nilai — bobot komponen penilaian, berlaku untuk semua kelas yang diampu
    Route::get('pengaturan-nilai', [PengaturanNilaiController::class, 'show'])->name('pengaturan-nilai.show');
    Route::put('pengaturan-nilai', [PengaturanNilaiController::class, 'update'])->name('pengaturan-nilai.update');

    // Perkuliahan
    Route::get('perkuliahan', [PerkuliahanController::class, 'index'])->name('perkuliahan.index');
    Route::get('perkuliahan/{kelasId}/export-mahasiswa', [PerkuliahanController::class, 'exportMahasiswa'])->name('perkuliahan.export-mahasiswa');
    Route::post('perkuliahan/presensi', [PerkuliahanController::class, 'storePresensi'])->name('perkuliahan.presensi.store');
    Route::put('perkuliahan/presensi/{presensi}', [PerkuliahanController::class, 'updatePresensi'])->name('perkuliahan.presensi.update');
    Route::post('perkuliahan/materi', [PerkuliahanController::class, 'storeMateri'])->name('perkuliahan.materi.store');
    Route::put('perkuliahan/materi/{materi}', [PerkuliahanController::class, 'updateMateri'])->name('perkuliahan.materi.update');
    Route::delete('perkuliahan/materi/{materi}', [PerkuliahanController::class, 'destroyMateri'])->name('perkuliahan.materi.destroy');
    Route::put('perkuliahan/nilai/{krs}', [PerkuliahanController::class, 'updateNilai'])->name('perkuliahan.nilai.update');
    Route::post('perkuliahan/{kelasId}/rps', [PerkuliahanController::class, 'uploadRps'])->name('perkuliahan.rps.upload');

    // Mahasiswa Asuh
    Route::get('mahasiswa-asuh', [MahasiswaAsuhController::class, 'index'])->name('mahasiswa-asuh.index');
    Route::get('mahasiswa-asuh/{mahasiswa}', [MahasiswaAsuhController::class, 'show'])->name('mahasiswa-asuh.show');
    Route::put('mahasiswa-asuh/{mahasiswa}', [MahasiswaAsuhController::class, 'update'])->name('mahasiswa-asuh.update');
    Route::delete('mahasiswa-asuh/{mahasiswa}', [MahasiswaAsuhController::class, 'destroy'])->name('mahasiswa-asuh.destroy');
    Route::post('mahasiswa-asuh/{mahasiswa}/bimbingan', [BimbinganAkademikController::class, 'store'])->name('mahasiswa-asuh.bimbingan.store');

    // KRS (Pembimbing Akademik) — approve/reject/revisi independen dari Admin Prodi
    Route::get('krs-pa', [KrsPaController::class, 'index'])->name('krs-pa.index');
    Route::get('krs-pa/{krs}', [KrsPaController::class, 'show'])->name('krs-pa.show');
    Route::patch('krs-pa/{krs}/approve', [KrsPaController::class, 'approve'])->name('krs-pa.approve');
    Route::patch('krs-pa/{krs}/reject', [KrsPaController::class, 'reject'])->name('krs-pa.reject');
    Route::patch('krs-pa/{krs}/revisi', [KrsPaController::class, 'requestRevision'])->name('krs-pa.revisi');

    // Bimbingan Tugas Akhir
    Route::get('bimbingan-tugas-akhir', [BimbinganTugasAkhirController::class, 'index'])->name('bimbingan-tugas-akhir.index');
    Route::post('bimbingan-tugas-akhir', [BimbinganTugasAkhirController::class, 'store'])->name('bimbingan-tugas-akhir.store');
    Route::put('bimbingan-tugas-akhir/{bimbinganTugasAkhir}', [BimbinganTugasAkhirController::class, 'update'])->name('bimbingan-tugas-akhir.update');
});
