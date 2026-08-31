<?php

use App\Http\Controllers\Admin\AcademicYearSemesterController;
use App\Http\Controllers\Admin\DosenController;
use App\Http\Controllers\Admin\KrsController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\MahasiswaController;
use App\Http\Controllers\Admin\MataKuliahController;
use App\Http\Controllers\Admin\NilaiController;
use App\Http\Controllers\Admin\PembayaranController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\PenjadwalanController;
use App\Http\Controllers\Admin\ProgramStudiController;
use App\Http\Controllers\Admin\RuangController;
use App\Http\Controllers\Admin\TagihanUktController;
use App\Http\Controllers\Admin\TendikController;
use App\Http\Controllers\Admin\UktSchemeController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\YudisiumController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // User Management
    Route::resource('user', UserController::class)->except(['show']);

    // Data Akademik
    Route::get('data-akademik', [AcademicYearSemesterController::class, 'index'])->name('data-akademik.index');
    Route::get('data-akademik/create', [AcademicYearSemesterController::class, 'create'])->name('data-akademik.create');
    Route::post('data-akademik', [AcademicYearSemesterController::class, 'store'])->name('data-akademik.store');
    Route::get('data-akademik/{academicYearSemester}', [AcademicYearSemesterController::class, 'show'])->name('data-akademik.show');
    Route::get('data-akademik/{academicYearSemester}/edit', [AcademicYearSemesterController::class, 'edit'])->name('data-akademik.edit');
    Route::put('data-akademik/{academicYearSemester}', [AcademicYearSemesterController::class, 'update'])->name('data-akademik.update');
    Route::delete('data-akademik/{academicYearSemester}', [AcademicYearSemesterController::class, 'destroy'])->name('data-akademik.destroy');
    Route::patch('data-akademik/{academicYearSemester}/status', [AcademicYearSemesterController::class, 'updateStatus'])->name('data-akademik.update-status');

    // Program Studi
    Route::get('program-studi', [ProgramStudiController::class, 'index'])->name('program-studi.index');
    Route::get('program-studi/create', [ProgramStudiController::class, 'create'])->name('program-studi.create');
    Route::post('program-studi', [ProgramStudiController::class, 'store'])->name('program-studi.store');
    Route::get('program-studi/{programStudi}', [ProgramStudiController::class, 'show'])->name('program-studi.show');
    Route::get('program-studi/{programStudi}/edit', [ProgramStudiController::class, 'edit'])->name('program-studi.edit');
    Route::put('program-studi/{programStudi}', [ProgramStudiController::class, 'update'])->name('program-studi.update');
    Route::delete('program-studi/{programStudi}', [ProgramStudiController::class, 'destroy'])->name('program-studi.destroy');

    // Mahasiswa
    Route::get('mahasiswa', [MahasiswaController::class, 'index'])->name('mahasiswa.index');
    Route::get('mahasiswa/create', [MahasiswaController::class, 'create'])->name('mahasiswa.create');
    Route::post('mahasiswa', [MahasiswaController::class, 'store'])->name('mahasiswa.store');
    Route::get('mahasiswa/{mahasiswa}', [MahasiswaController::class, 'show'])->name('mahasiswa.show');
    Route::get('mahasiswa/{mahasiswa}/edit', [MahasiswaController::class, 'edit'])->name('mahasiswa.edit');
    Route::put('mahasiswa/{mahasiswa}', [MahasiswaController::class, 'update'])->name('mahasiswa.update');
    Route::delete('mahasiswa/{mahasiswa}', [MahasiswaController::class, 'destroy'])->name('mahasiswa.destroy');

    // Dosen
    Route::get('dosen', [DosenController::class, 'index'])->name('dosen.index');
    Route::get('dosen/create', [DosenController::class, 'create'])->name('dosen.create');
    Route::post('dosen', [DosenController::class, 'store'])->name('dosen.store');
    Route::get('dosen/{dosen}', [DosenController::class, 'show'])->name('dosen.show');
    Route::get('dosen/{dosen}/edit', [DosenController::class, 'edit'])->name('dosen.edit');
    Route::put('dosen/{dosen}', [DosenController::class, 'update'])->name('dosen.update');
    Route::delete('dosen/{dosen}', [DosenController::class, 'destroy'])->name('dosen.destroy');

    // Tendik
    Route::get('tendik', [TendikController::class, 'index'])->name('tendik.index');
    Route::get('tendik/create', [TendikController::class, 'create'])->name('tendik.create');
    Route::post('tendik', [TendikController::class, 'store'])->name('tendik.store');
    Route::get('tendik/{tendik}', [TendikController::class, 'show'])->name('tendik.show');
    Route::get('tendik/{tendik}/edit', [TendikController::class, 'edit'])->name('tendik.edit');
    Route::put('tendik/{tendik}', [TendikController::class, 'update'])->name('tendik.update');
    Route::delete('tendik/{tendik}', [TendikController::class, 'destroy'])->name('tendik.destroy');

    // Mata Kuliah
    Route::get('mata-kuliah', [MataKuliahController::class, 'index'])->name('mata-kuliah.index');
    Route::get('mata-kuliah/create', [MataKuliahController::class, 'create'])->name('mata-kuliah.create');
    Route::post('mata-kuliah', [MataKuliahController::class, 'store'])->name('mata-kuliah.store');
    Route::get('mata-kuliah/{mataKuliah}', [MataKuliahController::class, 'show'])->name('mata-kuliah.show');
    Route::get('mata-kuliah/{mataKuliah}/edit', [MataKuliahController::class, 'edit'])->name('mata-kuliah.edit');
    Route::put('mata-kuliah/{mataKuliah}', [MataKuliahController::class, 'update'])->name('mata-kuliah.update');
    Route::delete('mata-kuliah/{mataKuliah}', [MataKuliahController::class, 'destroy'])->name('mata-kuliah.destroy');

    // Penjadwalan (Kelas)
    Route::get('penjadwalan', [PenjadwalanController::class, 'index'])->name('penjadwalan.index');
    Route::get('penjadwalan/create', [PenjadwalanController::class, 'create'])->name('penjadwalan.create');
    Route::post('penjadwalan', [PenjadwalanController::class, 'store'])->name('penjadwalan.store');
    Route::get('penjadwalan/{kelas}', [PenjadwalanController::class, 'show'])->name('penjadwalan.show');
    Route::get('penjadwalan/{kelas}/edit', [PenjadwalanController::class, 'edit'])->name('penjadwalan.edit');
    Route::put('penjadwalan/{kelas}', [PenjadwalanController::class, 'update'])->name('penjadwalan.update');
    Route::delete('penjadwalan/{kelas}', [PenjadwalanController::class, 'destroy'])->name('penjadwalan.destroy');

    // Ruang
    Route::get('ruang', [RuangController::class, 'index'])->name('ruang.index');
    Route::get('ruang/create', [RuangController::class, 'create'])->name('ruang.create');
    Route::post('ruang', [RuangController::class, 'store'])->name('ruang.store');
    Route::get('ruang/{ruang}', [RuangController::class, 'show'])->name('ruang.show');
    Route::get('ruang/{ruang}/edit', [RuangController::class, 'edit'])->name('ruang.edit');
    Route::put('ruang/{ruang}', [RuangController::class, 'update'])->name('ruang.update');
    Route::delete('ruang/{ruang}', [RuangController::class, 'destroy'])->name('ruang.destroy');

    // KRS
    Route::get('krs', [KrsController::class, 'index'])->name('krs.index');
    Route::get('krs/create', [KrsController::class, 'create'])->name('krs.create');
    Route::post('krs', [KrsController::class, 'store'])->name('krs.store');
    Route::get('krs/{krs}', [KrsController::class, 'show'])->name('krs.show');
    Route::get('krs/{krs}/edit', [KrsController::class, 'edit'])->name('krs.edit');
    Route::put('krs/{krs}', [KrsController::class, 'update'])->name('krs.update');
    Route::delete('krs/{krs}', [KrsController::class, 'destroy'])->name('krs.destroy');

    // Data Nilai
    Route::get('nilai', [NilaiController::class, 'index'])->name('nilai.index');
    Route::get('nilai/create', [NilaiController::class, 'create'])->name('nilai.create');
    Route::post('nilai', [NilaiController::class, 'store'])->name('nilai.store');
    Route::get('nilai/export', [NilaiController::class, 'exportExcel'])->name('nilai.export');
    Route::post('nilai/import', [NilaiController::class, 'importExcel'])->name('nilai.import');
    Route::get('nilai/{nilai}', [NilaiController::class, 'show'])->name('nilai.show');
    Route::get('nilai/{nilai}/edit', [NilaiController::class, 'edit'])->name('nilai.edit');
    Route::put('nilai/{nilai}', [NilaiController::class, 'update'])->name('nilai.update');
    Route::delete('nilai/{nilai}', [NilaiController::class, 'destroy'])->name('nilai.destroy');

    // Yudisium
    Route::get('yudisium', [YudisiumController::class, 'index'])->name('yudisium.index');
    Route::get('yudisium/create', [YudisiumController::class, 'create'])->name('yudisium.create');
    Route::post('yudisium', [YudisiumController::class, 'store'])->name('yudisium.store');
    Route::get('yudisium/{yudisium}', [YudisiumController::class, 'show'])->name('yudisium.show');
    Route::get('yudisium/{yudisium}/edit', [YudisiumController::class, 'edit'])->name('yudisium.edit');
    Route::put('yudisium/{yudisium}', [YudisiumController::class, 'update'])->name('yudisium.update');
    Route::delete('yudisium/{yudisium}', [YudisiumController::class, 'destroy'])->name('yudisium.destroy');

    // Tagihan UKT
    Route::get('tagihan-ukt', [TagihanUktController::class, 'index'])->name('tagihan-ukt.index');
    Route::get('tagihan-ukt/create', [TagihanUktController::class, 'create'])->name('tagihan-ukt.create');
    Route::post('tagihan-ukt', [TagihanUktController::class, 'store'])->name('tagihan-ukt.store');
    Route::get('tagihan-ukt/{tagihanUkt}', [TagihanUktController::class, 'show'])->name('tagihan-ukt.show');
    Route::get('tagihan-ukt/{tagihanUkt}/edit', [TagihanUktController::class, 'edit'])->name('tagihan-ukt.edit');
    Route::put('tagihan-ukt/{tagihanUkt}', [TagihanUktController::class, 'update'])->name('tagihan-ukt.update');
    Route::delete('tagihan-ukt/{tagihanUkt}', [TagihanUktController::class, 'destroy'])->name('tagihan-ukt.destroy');

    // Skema UKT
    Route::get('ukt-scheme', [UktSchemeController::class, 'index'])->name('ukt-scheme.index');
    Route::get('ukt-scheme/create', [UktSchemeController::class, 'create'])->name('ukt-scheme.create');
    Route::post('ukt-scheme', [UktSchemeController::class, 'store'])->name('ukt-scheme.store');
    Route::get('ukt-scheme/{uktScheme}', [UktSchemeController::class, 'show'])->name('ukt-scheme.show');
    Route::get('ukt-scheme/{uktScheme}/edit', [UktSchemeController::class, 'edit'])->name('ukt-scheme.edit');
    Route::put('ukt-scheme/{uktScheme}', [UktSchemeController::class, 'update'])->name('ukt-scheme.update');
    Route::delete('ukt-scheme/{uktScheme}', [UktSchemeController::class, 'destroy'])->name('ukt-scheme.destroy');

    // Pembayaran
    Route::get('pembayaran', [PembayaranController::class, 'index'])->name('pembayaran.index');
    Route::get('pembayaran/create', [PembayaranController::class, 'create'])->name('pembayaran.create');
    Route::post('pembayaran', [PembayaranController::class, 'store'])->name('pembayaran.store');
    Route::get('pembayaran/{pembayaran}', [PembayaranController::class, 'show'])->name('pembayaran.show');
    Route::patch('pembayaran/{pembayaran}/verify', [PembayaranController::class, 'verify'])->name('pembayaran.verify');
    Route::patch('pembayaran/{pembayaran}/reject', [PembayaranController::class, 'reject'])->name('pembayaran.reject');
    Route::get('pembayaran/{pembayaran}/kuitansi', [PembayaranController::class, 'exportKuitansi'])->name('pembayaran.kuitansi');

    // Laporan
    Route::get('laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('laporan/export-mahasiswa', [LaporanController::class, 'exportMahasiswa'])->name('laporan.export-mahasiswa');
    Route::get('laporan/export-nilai', [LaporanController::class, 'exportNilai'])->name('laporan.export-nilai');
    Route::get('laporan/export-keuangan', [LaporanController::class, 'exportKeuangan'])->name('laporan.export-keuangan');

    // Pengaturan Sistem
    Route::get('pengaturan', [PengaturanController::class, 'index'])->name('pengaturan.index');
    Route::put('pengaturan', [PengaturanController::class, 'update'])->name('pengaturan.update');
});
