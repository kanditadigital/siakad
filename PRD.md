# PRD — SIAKAD (Sistem Informasi Akademik Terintegrasi)

**Institusi:** STIT Daarurrahmah Sepadan — Sepadan, Kec. Rundeng, Kota Subulussalam, Aceh
**Stack:** Laravel 12 (PHP 8.4) + Inertia v3 + React + TypeScript + Tailwind CSS v4
**Status dokumen:** hidup — diperbarui seiring implementasi. Ditulis berdasarkan `siakad.json` (spesifikasi awal) dan kondisi kode aktual per 2026-08-31.

---

## 1. Latar Belakang & Tujuan

Kampus membutuhkan satu platform yang menyatukan data mahasiswa, dosen, perkuliahan, nilai, KRS/KHS, penjadwalan, dan keuangan (UKT), menggantikan proses administrasi manual yang lambat dan rawan inkonsistensi data.

**Tujuan produk:**
- Satu sumber data akademik yang akurat dan konsisten lintas modul (tidak ada input ulang).
- Alur kerja per peran (role-based) yang sederhana — setiap pengguna hanya melihat menu yang relevan dengan tugasnya.
- Proses akademik inti (KRS → Perkuliahan → Nilai → KHS/Transkrip → Yudisium) berjalan end-to-end di dalam sistem.
- Proses keuangan (UKT) tervalidasi dan terlacak dari tagihan sampai konfirmasi pembayaran.
- Sistem dapat diakses dari desktop, tablet, dan ponsel.

**Prinsip desain sistem** (dari `siakad.json`, bagian E): Sederhana, Mudah Digunakan, Terintegrasi, Akurat, Aman, Responsif, Fleksibel, Terukur & Terdokumentasi.

---

## 2. Peran Pengguna (Roles)

Kolom `users.role` mendukung: `admin`, `admin_prodi`, `dosen`, `mahasiswa`, `pimpinan`.

| Peran | Login | Cakupan |
|---|---|---|
| **Admin** (BAAK) | Email + password | Kelola seluruh data master, akademik, keuangan, laporan, pengguna, dan pengaturan sistem lintas program studi. |
| **Admin Prodi (Kaprodi)** | Email + password | Sama seperti Admin tapi dibatasi ke satu program studi (`program_studi_id`) — mahasiswa, dosen, penjadwalan, KRS, nilai. |
| **Dosen** | NIDN atau Email + password | Perkuliahan yang diampu, presensi, materi, input nilai, mahasiswa asuh (PA), bimbingan tugas akhir. |
| **Mahasiswa** | NIM + password | Profil, KRS, KHS, transkrip, jadwal, tagihan UKT & pembayaran. |
| **Pimpinan** | Email + password | Monitoring akademik & keuangan, laporan ringkas — read-only, tidak mengelola data. |

Autorisasi diterapkan lewat middleware `role:{peran}` per group route (lihat `routes/admin.php`, `routes/admin-prodi.php`, `routes/dosen.php`, `routes/mahasiswa.php`).

---

## 3. Modul & Fitur

Legenda status: ✅ Sudah ada di kode · 🟡 Ada kerangka tapi belum lengkap/fungsional · ⬜ Belum ada, perlu dibangun.

### 3.1 Home & Autentikasi
| Fitur | Status | Catatan |
|---|---|---|
| Halaman login dengan identitas kampus, logo, tema hijau-kuning | ✅ | `resources/js/pages/auth` |
| Login dosen via NIDN atau Email | ⬜ | Perlu custom guard/resolver: cek input sebagai NIDN dulu, fallback ke email |
| Login mahasiswa via NIM | ⬜ | Sama — resolver NIM → email/username |
| Reset password, verifikasi email, 2FA | ✅ | Ditangani modul Fortify (`app/Actions/Fortify`) |
| Manajemen keamanan akun (ganti password, sesi aktif) | ✅ | `Settings/SecurityController` |

### 3.2 Dashboard (per peran)
| Fitur | Status | Catatan |
|---|---|---|
| Dashboard Admin — ringkasan mahasiswa, dosen, kelas, mata kuliah, prodi, KRS pending, tagihan belum lunas | ✅ | `DashboardController` |
| Dashboard Admin Prodi — ringkasan terbatas ke prodi sendiri | ✅ | `AdminProdi/DashboardController` |
| Dashboard Dosen | ✅ | Diimplementasikan 2026-08-31 — sebelumnya halaman placeholder kosong. Sekarang menampilkan kelas diampu, mahasiswa diampu (distinct dari KRS disetujui), mahasiswa asuh (PA), materi terbaru. "Jadwal hari ini" tidak dibuat karena tabel `kelas` tidak punya kolom hari/jam (lihat catatan skema jadwal di §6.1) |
| Dashboard Mahasiswa — ringkasan KRS, nilai, tagihan | ✅ | `dashboard/mahasiswa.tsx` |
| Dashboard Pimpinan — monitoring akademik & keuangan | ⬜ | Route/menu ada di sidebar (`/pimpinan/...`) tapi controller & halaman belum dibuat |

### 3.3 Data Master (Admin)
| Fitur | Status |
|---|---|
| CRUD Program Studi | ✅ |
| CRUD Mahasiswa (dengan foto, generate NIM otomatis per prodi) | ✅ |
| CRUD Dosen (dengan foto) | ✅ |
| CRUD Tendik (tenaga kependidikan, dengan foto) | ✅ |
| CRUD Mata Kuliah (kode, nama, prodi, jenis wajib/pilihan, semester, SKS, status aktif) | ✅ |
| CRUD Ruang Kelas | ✅ |
| Manajemen User & Role (termasuk foto profil) | ✅ | `Admin/UserController` |

### 3.4 Akademik
| Fitur | Status | Catatan |
|---|---|---|
| Tahun Akademik & Semester (CRUD + status aktif) | ✅ | `AcademicYearSemesterController` |
| Penjadwalan Kelas (mata kuliah × dosen × ruang × waktu) | ✅ | `PenjadwalanController` |
| Pengajuan & Persetujuan KRS (Mahasiswa → Dosen PA/BAAK) | ✅ | `Admin/KrsController`, `Mahasiswa/KrsController`, `AdminProdi/KrsController` |
| Batas SKS maksimal per pengajuan KRS | ✅ | Diimplementasikan 2026-08-31 — `Krs::MAX_SKS` (24) + `Krs::totalSksDisetujui()`, divalidasi di `Admin/KrsController::store`/`update` saat status diset `disetujui`. Diuji di `tests/Feature/KrsSksLimitTest.php`. **Batas minimal tidak diimplementasikan** — lihat catatan di §6.1, butuh alur pengajuan mandiri oleh mahasiswa yang belum ada |
| Cetak KRS (PDF) | ✅ | Sudah ada sebelumnya (`Mahasiswa/KrsController::exportPdf` + `resources/views/pdf/krs.blade.php`) — status 🟡 sebelumnya salah, tidak terverifikasi saat ditulis |
| Input & Rekapitulasi Nilai (komponen: Tugas, UTS, UAS, Partisipasi, Kehadiran — total bobot 100%) | ✅ | `NilaiController` (Admin, Admin Prodi) |
| Import/Export Nilai via Excel | ✅ | Selesai 2026-08-31 — user menyetujui penambahan `maatwebsite/excel` (^4.0). `App\Exports\NilaiExport` (download `.xlsx`), `App\Imports\NilaiImport` (cocokkan baris via kolom `nim` + `kode_kelas` ke KRS berstatus disetujui, `updateOrCreate` Nilai; baris yang tidak cocok dilewati & dilaporkan by-row lewat flash message, bukan gagal total). Diuji di `tests/Feature/NilaiExcelTest.php` |
| KHS (Kartu Hasil Studi) per semester — IPS, IPK, predikat | ✅ | `Mahasiswa/KhsController` |
| Unduh KHS (PDF) | ✅ | Sudah ada sebelumnya (`Mahasiswa/KhsController::exportPdf` + `resources/views/pdf/khs.blade.php`) — status 🟡 sebelumnya salah |
| Transkrip Nilai (seluruh riwayat studi) | ✅ | `Mahasiswa/TranskripNilaiController` |
| Unduh Transkrip (PDF) | ✅ | Sudah ada sebelumnya (`Mahasiswa/TranskripNilaiController::exportPdf` + `resources/views/pdf/transkrip-nilai.blade.php`) — status 🟡 sebelumnya salah |
| Yudisium (penetapan kelulusan) | ✅ | `YudisiumController` — perlu verifikasi validasi syarat kelulusan (IPK min., nilai bermasalah, administrasi) |
| Output Berita Acara & SK Yudisium (PDF) | ⬜ | |

### 3.5 Modul Dosen
| Fitur | Status | Catatan |
|---|---|---|
| Profil Dosen (Biodata, Riwayat Pendidikan, Pengalaman, Mata Kuliah Diampu — tab) | ✅ | Diverifikasi 2026-08-31 — 4 dari 5 tab di spek `siakad.json` sudah ada dan fungsional (`resources/js/pages/dosen/profil/show.tsx`). Tab "Jabatan" tidak ada sebagai tab terpisah (datanya tumpang tindih dengan `pangkat_golongan` di Biodata) — gap minor, bukan blocker |
| Perkuliahan — daftar kelas per Tahun Akademik/Semester | ✅ | `Dosen/PerkuliahanController` |
| Daftar Mahasiswa per kelas + pencarian + export Excel | ✅ | Selesai 2026-08-31. Pencarian NIM/nama ditambahkan ke query `krss` di `PerkuliahanController::index` (tab "Nilai" di halaman Perkuliahan, yang berfungsi sebagai daftar mahasiswa per kelas). Export lewat `App\Exports\DaftarMahasiswaKelasExport` + `PerkuliahanController::exportMahasiswa`, dibatasi hanya untuk kelas milik dosen yang login (403 jika bukan). Diuji di `tests/Feature/DaftarMahasiswaExportTest.php` |
| Presensi (Hadir/Izin/Sakit/Alpha) per pertemuan, rekap, export Excel | ✅ | `Presensi` model ada |
| Materi Perkuliahan (upload PDF/PPT/Word/video/tautan, pertemuan 1–16) | ✅ | `Materi` model ada |
| RPS (upload, status Belum/Sudah Upload/Perlu Revisi/Disetujui) | ⬜ | Belum ada model/kolom terkait RPS |
| Input Nilai per kelas | ✅ | Terhubung ke `NilaiController` |
| Mahasiswa Asuh (PA) — 5 mahasiswa per dosen, bimbingan & catatan, riwayat, rekap, export | ✅ | `Dosen/MahasiswaAsuhController` |
| Bimbingan Tugas Akhir (status Aktif/Revisi/Lainnya) | ⬜ | Menu ada di sidebar (`/dosen/bimbingan-tugas-akhir`), controller/model belum ada |

### 3.6 Modul Mahasiswa
| Fitur | Status |
|---|---|
| Profil (data pribadi, akademik, orang tua, kontak darurat, dokumen) + cetak profil | ✅ (cetak profil perlu verifikasi) |
| KRS — pilih MK, keranjang, ajukan, cetak PDF | ✅ |
| KHS per semester | ✅ |
| Transkrip nilai lengkap + filter semester | ✅ |
| Jadwal Perkuliahan | ✅ | Diimplementasikan 2026-08-31 — `Mahasiswa/JadwalController`, halaman baru `resources/js/pages/mahasiswa/jadwal.tsx`, menu baru di sidebar. Menampilkan daftar kelas dari KRS berstatus `disetujui` (mata kuliah, dosen, ruang). **Bukan jadwal hari/jam** — skema `kelas` tidak punya kolom hari/jam sama sekali (lihat §6.1) |
| Tagihan UKT — lihat tagihan & riwayat pembayaran, bayar sekarang, cara pembayaran, unduh invoice PDF | ✅ | `Mahasiswa/TagihanUktController` |

### 3.7 Modul Keuangan (Admin)
| Fitur | Status | Catatan |
|---|---|---|
| Skema UKT (per prodi/angkatan) | ✅ | `UktSchemeController` |
| Tagihan UKT — kelola seluruh tagihan (status: `belum`, `lunas`, `terlambat`) | ✅ | `TagihanUktController` |
| Pembayaran — input pembayaran, upload bukti transfer, verifikasi/tolak, cetak kuitansi | ✅ | Selesai 2026-08-31. `Admin/PembayaranController`: index/show/**create/store** (catat pembayaran tunai manual, langsung `verified` + rekonsiliasi tagihan)/verify/reject/**exportKuitansi**. `Mahasiswa/PembayaranController` baru: upload bukti transfer (`create`/`store`, scoped ke tagihan milik sendiri — 403 jika bukan miliknya) dari tombol "Bayar Sekarang" di halaman Tagihan UKT mahasiswa. Logic rekonsiliasi tagihan diekstrak ke method privat `reconcileTagihan()` dipakai bersama oleh `verify()` dan `store()` admin. Diuji di `tests/Feature/PembayaranManualAndKuitansiTest.php` (5 test) |
| Cetak Kuitansi (PDF) | ✅ | `resources/views/pdf/kuitansi.blade.php` + `PembayaranController::exportKuitansi` — hanya bisa diunduh untuk pembayaran berstatus `verified` (404 untuk `pending`/`rejected`) |
| Biaya baku: pendaftaran Rp1.500.000 (sekali), UKT Rp2.000.000/semester (berlaku TA 2025/2026) | ✅ (data), disimpan sebagai skema UKT, bukan hardcode |

### 3.8 Laporan (Admin)
| Fitur | Status |
|---|---|
| Ringkasan statistik (mahasiswa, KRS, nilai, tagihan) | ✅ `LaporanController@index` |
| Export Laporan Mahasiswa (PDF) | ✅ |
| Export Laporan Nilai (PDF) | ✅ |
| Export Laporan Keuangan (PDF, dengan total lunas/belum lunas) | ✅ |
| Laporan Sumber Daya (dosen, tendik, ruang) | ⬜ | Disebut di `siakad.json` (`kategori_laporan`), belum ada di `LaporanController` |

### 3.9 Pengaturan Sistem (Admin)
| Fitur | Status | Catatan |
|---|---|---|
| Identitas Kampus, logo, info sistem | ⬜ | `PengaturanController` saat ini hanya mengembalikan config `app.*` (nama, url, locale, timezone) — **tidak benar-benar tersimpan**, `update()` adalah stub |
| Tahun Akademik & Semester Aktif | ✅ | Sudah dikelola lewat modul Data Akademik terpisah |
| Pengaturan KRS (periode buka/tutup, batas SKS) | ⬜ | |
| Pengaturan Nilai (periode input, bobot default) | ⬜ | |
| Pengaturan UKT & Pembayaran | ⬜ | (skema UKT sudah ada sebagai modul terpisah — bukan bagian "pengaturan") |
| Pengaturan Notifikasi | ⬜ | |
| Hak Akses & Keamanan | ✅ | Ditangani lewat `role` di `users` + middleware |
| Backup & Restore | ⬜ | |
| Log Aktivitas | ⬜ | Perlu audit trail (mis. `spatie/laravel-activitylog` atau tabel `activity_logs` sendiri) |

**Rekomendasi:** modul Pengaturan Sistem butuh tabel `settings` (key-value) agar `PengaturanController::update` benar-benar persisten, bukan hanya membaca `config()`.

### 3.10 Modul Pimpinan
| Fitur | Status |
|---|---|
| Monitoring Akademik (mahasiswa aktif, kelas, KRS, presensi, perkembangan akademik) | ⬜ |
| Monitoring Keuangan (tagihan, pembayaran, tunggakan, % pembayaran) | ⬜ |
| Laporan Ringkas (akademik, mahasiswa, nilai/yudisium, keuangan) | ⬜ |

Seluruh modul Pimpinan baru ada sebagai entri menu di sidebar; belum ada route, controller, maupun halaman.

---

## 4. Data & Model Domain (ringkasan)

Entity inti yang sudah ada: `User`, `ProgramStudi`, `Mahasiswa`, `Dosen`, `Tendik`, `MataKuliah`, `Kelas`, `Ruang`, `AcademicYearSemester`, `Krs`, `Nilai`, `Presensi`, `Materi`, `UktScheme`, `TagihanUkt`, `Pembayaran`, `Yudisium`, plus modul Teams (`Team`, `TeamInvitation`, `Membership`) yang tampaknya infrastruktur multi-tenant bawaan starter kit — perlu diklarifikasi apakah dipakai SIAKAD atau sisa boilerplate yang harus dilepas.

**Status enum yang perlu konsisten di seluruh layer (backend, frontend, dokumen):**
- `Mahasiswa.status`: `aktif`, `cuti`, `nonaktif`, `lulus`
- `Dosen.status` / `Tendik.status`: `aktif`, `cuti`, `pensiun`
- `Krs.status`: `pending`, `disetujui`, `ditolak` (bukan `approved`/`rejected` — sempat jadi bug di 5 tempat: `DashboardController`, `LaporanController`, `Mahasiswa/KrsController`, `mahasiswa/krs.tsx`, `dashboard/mahasiswa.tsx`, sudah diperbaiki 2026-08-31)
- `TagihanUkt.status`: `belum`, `lunas`, `terlambat` (bukan `belum_lunas` — sempat jadi bug, sudah diperbaiki)
- `Pembayaran.status`: `pending`, `verified`, `rejected`

---

## 5. Non-Functional Requirements

- **Keamanan:** hak akses berbasis peran di setiap route group; data pribadi (foto, NIK, dsb.) hanya bisa diakses pemilik/peran berwenang. Semua input tervalidasi di `FormRequest`/`validate()` sebelum disimpan.
- **Konsistensi data:** satu record dipakai lintas modul tanpa duplikasi (mis. `User` sebagai identitas login untuk `Mahasiswa`/`Dosen`/`Tendik`).
- **Responsif:** UI harus tetap terpakai baik di layar desktop, tablet, maupun ponsel (lihat DESIGN.md).
- **Auditability:** proses penting (approve KRS, verifikasi pembayaran, penetapan nilai/yudisium) idealnya tercatat riwayatnya (log aktivitas) — lihat gap di §3.9.
- **Testing:** setiap fitur baru wajib disertai Pest test (feature test untuk controller, sesuai `CLAUDE.md`).

---

## 6. Prioritas Pengembangan Berikutnya (Gap List)

Urutan disarankan berdasarkan dampak terhadap alur inti sistem. Status ✅ = selesai & diuji, ⬜ = belum dikerjakan.

1. ✅ **Sambungkan `Pembayaran::verify` → update status `TagihanUkt`** — selesai 2026-08-31. `PembayaranController::verify` sekarang mengakumulasi `jumlah_bayar` pada `TagihanUkt` dan menghitung ulang status (`lunas` jika total bayar ≥ tagihan, `terlambat` jika lewat jatuh tempo, selain itu `belum`), dibungkus `DB::transaction()` dengan `lockForUpdate()` pada `Pembayaran` dan `TagihanUkt` (mencegah race condition & double-counting saat dua admin memverifikasi bersamaan). `verify`/`reject` sekarang menolak (`422`) pembayaran yang statusnya bukan `pending` (idempotent, sesuai RULES.md §7.1). Migration baru `add_unique_to_pembayaran_uuid` menambahkan constraint unik yang sebelumnya hilang di kolom route-key `uuid`. Diuji lewat `tests/Feature/PembayaranVerificationTest.php` (5 test: lunas penuh, pembayaran parsial, reject tidak mengubah saldo, tidak bisa diverifikasi dua kali, non-admin ditolak 403).
2. ⬜ **Login via NIDN/NIM** — saat ini asumsinya login pakai email untuk semua peran; ini menyimpang dari spesifikasi.
3. ⬜ **Modul Pimpinan** (monitoring + laporan ringkas) — sama sekali belum ada implementasi.
4. ⬜ **Pengaturan Sistem yang benar-benar persisten** (tabel `settings`, bukan stub).
5. ⬜ **Bimbingan Tugas Akhir** untuk Dosen — model & controller belum ada.
6. ⬜ **RPS (Rencana Pembelajaran Semester)** dengan status approval.
7. ⬜ **Log Aktivitas / audit trail** lintas modul kritikal (nilai, KRS, pembayaran, yudisium).
8. ⬜ **Cetak PDF individual**: KHS, Transkrip, Kuitansi Pembayaran, Berita Acara/SK Yudisium (laporan massal PDF sudah ada, tinggal per-dokumen).
9. ⬜ **`PembayaranController::index` masih `->get()` tanpa pagination** — ditandai saat mengerjakan item #1, sengaja tidak diubah karena halaman React (`admin/pembayaran/index.tsx`) mengasumsikan array datar; mengubah ke `paginate()` butuh penyesuaian frontend sekaligus (bukan perubahan backend-only).
10. ✅ **Dependency `maatwebsite/excel` (^4.0)** — disetujui user 2026-08-31, terpasang, dipakai untuk Import/Export Nilai Excel dan export Daftar Mahasiswa per kelas (lihat §3.4/§3.5).
11. ⬜ **Skema jadwal (hari/jam) tidak ada di tabel `kelas`** — modul "Penjadwalan" saat ini hanya assign dosen/ruang/semester, tanpa hari/jam. Ini membatasi "Jadwal Perkuliahan" mahasiswa (§3.6, sudah dibuat tapi hanya daftar kelas, bukan jadwal waktu) dan "jadwal hari ini" di Dashboard Dosen (§3.2). Butuh keputusan desain: tambah kolom `hari`/`jam_mulai`/`jam_selesai` ke `kelas`, atau tabel `jadwal` terpisah untuk mendukung kelas yang jadwalnya berubah per minggu.
12. ⬜ **Alur pengajuan KRS mandiri oleh mahasiswa belum ada** — `siakad.json` mendeskripsikan alur "Pilih mata kuliah → Keranjang KRS → Ajukan KRS → Disetujui Dosen PA/BAAK", tapi implementasi saat ini KRS 100% dibuat oleh Admin (`Admin/KrsController::store`). Mahasiswa hanya bisa **melihat** KRS miliknya (`Mahasiswa/KrsController@index`), tidak mengajukan. Ini juga sebabnya "batas SKS minimal" (§3.4) tidak bisa diimplementasikan — tidak ada momen "submit" untuk divalidasi.

### 6.1 Bug infrastruktur pre-existing yang ditemukan & diperbaiki saat mengerjakan #1

Ditemukan saat menjalankan test suite untuk memverifikasi perbaikan di atas — seluruhnya blocker yang menghentikan *semua* Pest test berjalan, bukan spesifik ke modul Pembayaran, jadi diperbaiki sekalian agar `php artisan test` bisa dipakai untuk validasi ke depannya:

- **`User` model tidak memakai trait `HasTeams`** meski trait itu sudah lengkap ada di `app/Concerns/HasTeams.php` dan dipakai `UserFactory`, `Teams/TeamController`, dst — menyebabkan `switchTeam()` undefined dan setiap `User::factory()->create()` gagal. Sudah ditambahkan `use HasTeams` di `app/Models/User.php`.
- **Migration `add_nuptk_to_dosen_table` dan `add_uuid_to_admin_models_table`** memakai `SHOW INDEX FROM ...` (raw SQL khusus MySQL) yang membuat migration gagal total di SQLite (dipakai test suite). Diganti dengan Schema Builder (`$table->unique()`) yang portable lintas driver.
- **Migration `two_factor_secret`/`two_factor_recovery_codes`/`two_factor_confirmed_at` tidak pernah ada** padahal `User` model (via Fortify) mengasumsikan kolom itu ada — kemungkinan di DB produksi kolom ini ditambahkan manual/di luar migration. Ditambahkan migration `add_two_factor_columns_to_users_table` yang idempotent (aman dijalankan meski kolom sudah ada).
- **`ProgramStudiFactory` dan `AcademicYearSemesterFactory` adalah stub kosong** (`return [];`), menyebabkan setiap test yang membuat `Mahasiswa`/`TagihanUkt` via factory gagal karena kolom `NOT NULL` tidak terisi. Sudah diisi sesuai skema tabel masing-masing.
- **Ditemukan, belum diperbaiki (di luar scope perbaikan Pembayaran):** `php artisan test` penuh menunjukkan modul Teams (`routes/teams.php` atau setara) **tidak pernah didaftarkan** di `bootstrap/app.php` — seluruh `tests/Feature/Teams/*` gagal dengan "Route not defined". Juga ada mismatch redirect setelah login (`LoginTest` mengharapkan `/dashboard/admin`, aktual `/dashboard`) dan Inertia component path (`dashboard` vs `dashboard/`). Ini menguatkan catatan di §4 bahwa status modul Teams (dipakai atau dilepas) perlu diputuskan — dan menambah item baru: **audit redirect pasca-login per role** perlu disamakan dengan test yang sudah ada (`tests/Feature/Auth/LoginTest.php`).

### 6.2 Bug tambahan ditemukan & diperbaiki saat mengerjakan fitur 🟡 (2026-08-31)

- **`Krs.status` — mismatch `approved`/`rejected` vs nilai asli `disetujui`/`ditolak`** ditemukan di 5 tempat (lihat §4). Ini bug fungsional nyata: sebelum diperbaiki, kartu "KRS Disetujui" di dashboard mahasiswa selalu menunjukkan 0, total SKS di halaman KRS & PDF cetak KRS selalu 0, dan laporan admin `krs_approved` selalu 0 — meski data KRS yang disetujui benar-benar ada di database. Semua sudah diperbaiki dan tercakup test yang lolos.
- **`Kelas` model tidak punya relasi `academicYearSemester`** (kelas hanya punya kolom string `semester`/`tahun_akademik`, bukan foreign key ke `academic_year_semesters`) — tapi `Dosen/PerkuliahanController::index` dan `Dosen/DosenProfileController::show` memanggil `Kelas::with([..., 'academicYearSemester'])`, yang melempar `RelationNotFoundException` (HTTP 500) setiap kali dosen membuka halaman Perkuliahan atau Profil. **Ini blocker penuh** — dua halaman inti modul Dosen sama sekali tidak bisa diakses sebelum perbaikan ini. Diperbaiki dengan menghapus eager-load relasi yang tidak ada dan menyesuaikan frontend (`dosen/perkuliahan/index.tsx`, `dosen/profil/show.tsx`) untuk memakai kolom `semester`/`tahun_akademik` langsung. Diuji di `tests/Feature/DosenProfilePerkuliahanTest.php`.
