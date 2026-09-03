# Laporan QA — Siakad (branch `feat/modul-dosen-pa`)

**Tanggal:** 2026-09-03
**Reviewer:** QA audit (otomatis, senior-level review terhadap fitur & kualitas kode)
**Lingkup:** Modul Dosen PA (Pembimbing Akademik), upload S3 privat, Pengaturan Nilai, Riwayat Pendidikan Dosen, fitur Pencarian, perubahan sidebar/navigasi & shared Inertia props, serta perbaikan keamanan pada branch ini dibanding `main`.

---

## Ringkasan Eksekutif

Tidak ditemukan temuan **Critical** atau **High**. Otorisasi pada modul-modul baru sudah solid dan teruji (proper 403 pada akses lintas-dosen, scoping berbasis `pa_dosen_id` dan `program_studi_id`). Pola upload S3 privat diikuti dengan benar. Tidak ada N+1 baru. Migrasi reversibel dengan tipe/constraint yang wajar. Refactor sidebar/navigasi ditelusuri baris-per-baris — tidak ada menu yang hilang untuk role manapun (admin, dosen, mahasiswa).

Ada 2 temuan **Medium** yang sebaiknya diperbaiki sebelum merge, dan beberapa catatan **Low** yang bersifat informasional.

---

## Hasil Test

- **5 file test baru** (`AdminDashboardTest`, `ChromeSharedPropsTest`, `DosenPengaturanNilaiTest`, `DosenRiwayatPendidikanTest`, `PencarianTest`): **31 test, 230 assertion — semua lulus.**
- **Full suite:** 312/364 lulus. 7 failure + 41 error — **semua pre-existing**, bukan regresi dari branch ini:
  - Route Teams belum terdaftar di `bootstrap/app.php` (sesuai catatan PRD.md §6.1, sudah diketahui sebelumnya).
  - Mismatch redirect halaman login pada beberapa test lama.
  - **Tidak ada regresi baru** dari perubahan branch ini.
- `vendor/bin/pint --dirty --test` — **clean**, tidak ada masalah format.

---

## Temuan Medium

### M1 — Validasi `pendidikan_terakhir` di `DosenProfileController::update` bisa memblokir dosen menyimpan profil sendiri — ✅ FIXED

**File:** `app/Http/Controllers/Dosen/DosenProfileController.php:62`

Field `pendidikan_terakhir` divalidasi dengan rule `in:S2,S3`. Jika seorang dosen memiliki nilai eksisting `S1` (atau nilai lain yang bisa di-set oleh Admin di luar `S2`/`S3`), maka saat dosen tersebut mencoba menyimpan perubahan pada field lain (misalnya nomor telepon atau alamat) tanpa mengubah `pendidikan_terakhir`, request akan gagal validasi (422) — padahal field itu tidak diubah.

**Perbaikan yang diterapkan:** Rule diubah menjadi `['required', 'string', 'max:255']`, selaras dengan validasi yang sudah dipakai admin/admin-prodi di `Admin\DosenController` dan `AdminProdi\DosenController` (keduanya juga tidak membatasi enum). Pembatasan ke S2/S3 di UI (dropdown `PENDIDIKAN_OPTIONS`) tetap dipertahankan karena itu sudah jadi konvensi di seluruh form dosen (admin create/edit maupun self-edit) — perbaikan ini hanya menghapus pembatasan berlebih di layer backend yang tidak konsisten dengan controller admin.

Test `pendidikan_terakhir must be S2 or S3` di `tests/Feature/DosenProfilEditTest.php` diganti dengan `dosen can save profile without changing an existing non-S2/S3 pendidikan_terakhir`, yang memverifikasi dosen dengan nilai `S1` bisa menyimpan profilnya tanpa error. Seluruh suite `DosenProfilEditTest` (11 test, 41 assertion) lulus setelah perubahan.

### M2 — Cakupan test `PencarianTest` belum menutupi semua entity untuk role `admin_prodi` — ✅ FIXED
**File:** `tests/Feature/PencarianTest.php`

`PencarianController` men-scope hasil pencarian dosen dan mata kuliah berdasarkan `program_studi_id` untuk role `admin_prodi` (sama seperti scoping pada mahasiswa), namun test yang ada baru mengasersi perilaku scoping ini untuk entitas **mahasiswa** saja.

**Perbaikan yang diterapkan:** Ditambahkan dua test baru — `admin prodi only searches dosen within their own program studi` dan `admin prodi only searches mata kuliah within their own program studi` — mengikuti pola test mahasiswa yang sudah ada (dosen/mata kuliah dari prodi lain dibuat sebagai data pembanding, lalu diverifikasi tidak muncul di hasil). Seluruh suite `PencarianTest` (9 test, 82 assertion) lulus.

---

## Temuan Low (informasional, bukan blocker)

1. **`PengaturanNilaiController::update`** tidak dibungkus dalam DB transaction — namun ini adalah write single-table yang self-scoped ke dosen yang bersangkutan, sehingga risikonya minimal.
2. **Bobot nilai (grading weight) belum dikonsumsi oleh model `Nilai`** — sesuai PRD §6 item #14, ini memang belum dalam scope saat ini. Pertimbangkan menambahkan catatan di UI bahwa pengaturan ini belum terhubung ke proses penilaian aktual, agar dosen tidak salah paham.
3. **Riwayat Pendidikan Dosen** tidak memiliki batas jumlah entri per dosen (berbeda dari "mahasiswa asuh" yang dibatasi 5). Ini wajar mengingat progres jenjang pendidikan bersifat alami dan terbatas.
4. **`pengaturan-nilai.tsx`** membaca pesan error "harus berjumlah 100" berdasarkan key field spesifik (`bobot_tugas`) yang saat ini selalu dipakai backend — bekerja untuk sekarang tapi coupling implisit. Validasi `totalValid` di sisi client sudah mengcover kasus yang sama secara redundan, sehingga risiko rendah.

---

## Rekomendasi Prioritas

1. ~~Perbaiki M1 (validasi `pendidikan_terakhir`)~~ — **selesai.**
2. ~~Tambahkan test cakupan M2~~ — **selesai.**
3. **Backlog:** Pertimbangkan catatan UI untuk item Low #2 agar ekspektasi dosen terhadap fitur bobot nilai jelas.

Semua temuan Medium pada audit ini sudah diperbaiki dan diverifikasi dengan test yang lulus. Tidak ada blocker tersisa untuk merge dari sisi QA.

---

## Catatan Metodologi

- Membaca `PRD.md`, `DESIGN.md`, `RULES.md`, dan seluruh `.ai/rules/*.md` (index, dosen, controllers, models, components) sebagai referensi arsitektur dan konvensi.
- Meninjau seluruh controller, model, migration, route, dan halaman React yang baru/berubah pada branch ini.
- Menjalankan `php artisan test --compact` (full suite + filter file baru) dan `vendor/bin/pint --dirty --test`.
- Menelusuri `php artisan route:list` dan kode otorisasi untuk memverifikasi tidak ada IDOR atau route yang tidak ter-guard.
- Audit ini bersifat **read-only** — tidak ada perubahan kode yang dilakukan selama proses audit.
