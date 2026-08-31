# RULES.md — Aturan Penulisan Kode SIAKAD

Aturan wajib untuk semua kode backend (PHP/Laravel) dan frontend (React/Inertia/TypeScript) di project ini. Ini melengkapi `CLAUDE.md` (Laravel Boost guidelines) — jika ada konflik, `CLAUDE.md` yang menang untuk hal-hal proses (Artisan, testing, Pint). Dokumen ini fokus ke **kualitas dan keamanan kode**.

---

## 1. Keamanan

### 1.1 Validasi & Mass Assignment
- Semua input dari request **wajib** divalidasi lewat `$request->validate()` atau `FormRequest` sebelum dipakai — tidak ada `$request->all()` langsung masuk ke `Model::create()`/`update()`.
- `$fillable` di setiap model harus eksplisit dan minimal — jangan pakai `$guarded = []`. Field sensitif (`role`, `status`, `id`, foreign key kepemilikan) tidak boleh bisa ditimpa dari input mentah pengguna; set field itu secara terpisah di controller setelah validasi field lain.
- Route model binding (`{mahasiswa}`, `{dosen}`, dst) dipakai untuk menghindari lookup manual berulang — tapi tetap harus disertai **authorization check** (lihat 1.2) karena binding tidak otomatis mengecek kepemilikan.

### 1.2 Otorisasi
- Middleware `role:{peran}` di level route group adalah lapisan pertama, **bukan satu-satunya**. Untuk data yang scoped ke individu (mahasiswa hanya boleh lihat KRS miliknya sendiri, dosen hanya boleh input nilai kelas yang diampunya), tambahkan Policy (`php artisan make:policy`) atau scoping query eksplisit (`->where('mahasiswa_id', $request->user()->mahasiswa->id)`), jangan mengandalkan asumsi bahwa URL yang benar berarti akses yang benar.
- Aksi state-changing yang sensitif (verifikasi pembayaran, approve KRS, penetapan yudisium) wajib memakai method HTTP yang sesuai (`PATCH`/`PUT`/`POST`, bukan `GET`) dan idealnya dicatat di log aktivitas (lihat §4 di `PRD.md`).

### 1.3 File Upload
- Validasi file selalu memakai aturan `image:jpeg,jpg,png`/`mimes:` + `max:2048` (2MB) sesuai pola yang sudah ada di `photo-upload-pattern.md` — jangan menerima ekstensi bebas.
- File lama **wajib dihapus** (`Storage::disk('public')->delete(...)`) saat diganti, agar storage tidak menumpuk file yatim. Pola ini sudah konsisten diterapkan di `DosenController`, `MahasiswaController`, `TendikController`, `UserController` — ikuti pola yang sama untuk modul baru (mis. upload materi perkuliahan, bukti transfer pembayaran).
- Jangan pernah menyimpan path upload dari input pengguna secara langsung (`$request->photo_path`) — path selalu hasil dari `$request->file(...)->store(...)`, tidak pernah string mentah dari client.

### 1.4 Query & Injeksi
- Tidak ada raw SQL dengan interpolasi variabel (`DB::raw("... {$var}")`, `whereRaw("col = '$val'")`). Gunakan query builder/Eloquent dengan parameter binding, atau `DB::raw()` hanya untuk ekspresi statis tanpa input pengguna (seperti contoh `DB::raw('count(*) as total')` di `UserController`).
- Search/filter dari input pengguna (`like "%{$search}%"`) tetap aman selama lewat query builder binding (seperti yang sudah diterapkan) — jangan diubah jadi raw string concatenation.

### 1.5 Data Sensitif
- Tidak ada credential, token, atau kunci API yang di-commit ke repo (`.env` selalu di-gitignore). Konfigurasi baru selalu lewat `config/*.php` + `env()`, dibaca lewat `config()`, tidak `env()` langsung di luar file config.
- Data pribadi (NIK, foto, data orang tua, kontak darurat) hanya di-load (`->load()`, `->with()`) saat memang ditampilkan di halaman itu — jangan eager load relasi sensitif ke response yang tidak membutuhkannya.

---

## 2. Arsitektur: Model, Controller, View

### 2.1 Model dan Controller TIDAK boleh dipanggil langsung dari View
- **Blade view** (`resources/views/**`, termasuk `resources/views/pdf/*.blade.php`) **tidak boleh** memanggil Eloquent model langsung (`Mahasiswa::all()`, `User::find(...)`) maupun memanggil controller. Semua data yang dibutuhkan view harus **sudah disiapkan penuh** oleh controller dan dikirim lewat `view('...', $data)` atau `Pdf::loadView('...', $data)` — Blade hanya bertugas merender data yang sudah jadi.
  - ❌ `{{ App\Models\Mahasiswa::count() }}` di dalam Blade.
  - ✅ Controller menghitung `$stats = [...]`, lalu `Pdf::loadView('pdf.laporan-mahasiswa', ['stats' => $stats])`.
- Halaman Inertia (React di `resources/js/pages/**`) juga tidak pernah memanggil endpoint/model secara implisit di luar props yang dikirim `Inertia::render()`. Semua data awal halaman datang dari controller lewat props — fetching tambahan di client (jika memang perlu) memakai route API eksplisit yang jelas kontraknya, bukan query ad-hoc.
- Alasan: pemisahan ini menjaga agar logic otorisasi, query, dan transformasi data terpusat di controller (satu tempat untuk diaudit dan ditest), dan view/komponen tetap murni presentasional — konsisten dengan pola Inertia yang sudah dipakai di seluruh project.

### 2.2 Controller Ramping (Thin Controller)
- Controller bertugas: validasi input → panggil model/service → siapkan data → render. Logic bisnis yang kompleks (perhitungan IPK/IPS, penentuan predikat kelulusan, validasi syarat yudisium) dipindah ke method di Model (mis. `Mahasiswa::hitungIpk()`) atau ke Service/Action class jika dipakai di banyak controller — jangan ditulis inline panjang di dalam method controller.
- Query kompleks yang dipakai berulang (mis. filter mahasiswa aktif per prodi) sebaiknya jadi **local scope** di model (`scopeAktif`, `scopePerProdi`) agar terbaca jelas di controller: `Mahasiswa::aktif()->perProdi($id)->get()`.
- Satu method controller = satu tanggung jawab. Jika sebuah `index()` method mulai memuat >30 baris logic filter/kalkulasi, itu sinyal untuk diekstrak.

### 2.3 View Composer / Global Data
- Jangan menyuntikkan data global lewat `View::share()` yang query ke database di setiap request tanpa cache — ini sumber N+1 tersembunyi yang jalan di semua halaman.

---

## 3. Menghindari N+1 Query

N+1 adalah masalah performa paling sering muncul di aplikasi dengan banyak relasi seperti SIAKAD (Mahasiswa → ProgramStudi → Dosen PA → Kelas → MataKuliah → Nilai). Aturan wajib:

### 3.1 Eager Loading adalah Default
- Setiap kali sebuah query akan menampilkan relasi (langsung atau lewat field turunan di frontend), relasi itu **wajib** di-eager-load dengan `->with([...])` atau `->load([...])` — tidak ada akses relasi (`$mahasiswa->programStudi->nama_prodi`) di dalam loop tanpa eager load sebelumnya.
  - Pola yang sudah benar dan harus ditiru: `Pembayaran::with(['mahasiswa', 'tagihanUkt.academicYearSemester'])`, `Mahasiswa::with(['programStudi'])`.
- Nested relation dieager-load dengan dot notation (`'krs.mahasiswa'`, `'krs.kelas.mataKuliah'`) — bukan loop manual yang query per item.

### 3.2 Wajib Diperiksa Sebelum Merge
- Setiap `index()`/`export*()`/`show()` baru yang menampilkan data dengan relasi **wajib dicek** dengan `DB::enableQueryLog()` di test, atau eyeball langsung: jumlah query harus konstan terlepas dari jumlah baris data, bukan bertambah seiring jumlah baris.
- Untuk method export/laporan yang mengambil banyak baris (`LaporanController::exportMahasiswa`, `exportNilai`, `exportKeuangan`) — ini paling rawan N+1 karena diakses jarang sehingga sering luput dari review manual. Pastikan `->with()` mencakup **semua** relasi yang dipakai di Blade PDF-nya, termasuk relasi yang dipakai di `@foreach` bersarang.

### 3.3 Hindari Query di Accessor/Computed yang Dipakai dalam Loop
- Accessor model (`getXxxAttribute` / Attribute cast) yang melakukan query (mis. hitung SKS total dari relasi) aman dipakai untuk satu record (`show()`), tapi **berbahaya** dipakai di listing (`index()`) tanpa eager load relasi yang mendasarinya — pastikan relasi yang dipakai accessor tersebut ikut di-`with()`.

### 3.4 Select Kolom Secukupnya untuk Query Besar
- Untuk listing dengan volume besar (laporan, export), gunakan `select()` untuk membatasi kolom yang benar-benar dipakai, terutama menghindari `select *` yang menarik kolom besar (path file, teks panjang) yang tidak ditampilkan.

---

## 4. Server-Side Rendering (SSR)

- Aplikasi memakai Inertia v3 dengan SSR aktif via `@inertiajs/vite` — **jangan menonaktifkan SSR** untuk halaman publik/terindeks (Home, Login) demi kemudahan development; gunakan `npm run dev`/`composer run dev` yang sudah menjalankan SSR otomatis di mode dev sesuai konvensi Inertia v3 (`CLAUDE.md`).
- Setiap komponen halaman baru (`resources/js/pages/**`) harus bisa dirender di server tanpa error — hindari akses API browser-only (`window`, `document`, `localStorage`) langsung di badan komponen/saat render pertama. Bungkus akses semacam itu di `useEffect` (hanya jalan di client setelah hydration), bukan di top-level component body, agar SSR tidak crash.
- Komponen yang secara inheren tidak bisa/tidak perlu di-SSR (mis. chart interaktif berat, editor rich text) dimuat lazy di client dengan pengecekan `typeof window !== 'undefined'`, bukan dengan mematikan SSR untuk seluruh halaman.
- Deferred props (`Inertia::defer()`) dipakai untuk data yang boleh menyusul setelah render awal (bukan untuk data inti halaman) — selaras dengan aturan "tampilkan skeleton untuk deferred props" di `CLAUDE.md`.

---

## 5. Clean Code & Kerapian

### 5.1 PHP
- Ikuti seluruh aturan `php rules` di `CLAUDE.md`: curly brace wajib, constructor promotion, return type & param type eksplisit, TitleCase untuk Enum.
- Nama method/variabel deskriptif dan dalam bahasa yang konsisten dengan domain (istilah akademik dalam Bahasa Indonesia — `hitungIpk`, `generateNim`, `verifikasiPembayaran` — bukan campur `calculateGpa` di satu file dan `hitungIpk` di file lain).
- Tidak ada magic string berulang untuk status (`'lunas'`, `'belum'`, `'approved'`) tersebar di banyak file tanpa satu sumber kebenaran — pertimbangkan PHP Enum (`TitleCase` sesuai `CLAUDE.md`) untuk status yang dipakai di ≥3 tempat, agar typo seperti kasus `belum_lunas` vs `belum` (pernah terjadi di project ini) tidak terulang.
- Jalankan `vendor/bin/pint --dirty --format agent` sebelum menganggap perubahan PHP selesai (wajib, sudah diatur di `CLAUDE.md`).

### 5.2 TypeScript / React
- Props halaman Inertia selalu diberi `type`/`interface` eksplisit yang mencerminkan struktur data dari controller — jangan `any` atau props tanpa tipe untuk halaman baru.
- Komponen UI dasar diambil dari `resources/js/components/ui/*` (lihat `DESIGN.md` §6) — tidak menulis ulang elemen dasar (button, card, table) per halaman.
- Tidak ada logic transformasi data berat (kalkulasi, agregasi) diulang identik di banyak komponen — ekstrak ke helper (`resources/js/lib/*`) jika dipakai ≥2 tempat.
- Hindari `useEffect` untuk sinkronisasi data yang sebenarnya bisa didapat langsung dari props Inertia — Inertia sudah menyediakan data server-rendered lewat props, jangan fetch ulang di client tanpa alasan.

### 5.3 Umum
- Tidak ada kode yang di-comment-out dibiarkan menumpuk — hapus, jangan disimpan "siapa tahu dipakai lagi" (riwayatnya ada di git).
- Tidak ada TODO tanpa konteks (`// TODO: fix later`) — TODO harus menjelaskan apa yang kurang dan idealnya terhubung ke item di `PRD.md` §6 (gap list).
- Tidak ada stub yang berpura-pura berfungsi (contoh yang harus dihindari: method `update()` yang memvalidasi input lalu redirect sukses tanpa benar-benar menyimpan apa pun — ini menyesatkan pengguna bahwa data tersimpan padahal tidak).

---

## 6. Testing (ringkasan, detail lengkap di `CLAUDE.md`)

- Setiap fitur baru/perubahan logic wajib disertai Pest test yang relevan (`php artisan make:test --pest`), dan dijalankan sebelum dianggap selesai (`php artisan test --compact --filter=...`).
- Test untuk endpoint yang menampilkan relasi sebaiknya menyertakan assertion jumlah query (lihat §3.2) agar regresi N+1 tertangkap otomatis, bukan hanya lolos manual testing sekali saat ditulis.
- Test otorisasi (§1.2) wajib untuk endpoint scoped-by-user — pastikan ada test yang memverifikasi peran/pemilik lain **tidak bisa** mengakses data yang bukan miliknya (403/404), bukan hanya test bahwa pemilik yang benar bisa akses.

---

## 7. Aturan Tambahan yang Sering Terlewat

Poin-poin ini sering luput karena tidak langsung terlihat sebagai "bug" saat development, tapi jadi masalah nyata di produksi atau saat data mulai besar.

### 7.1 Transaksi & Konsistensi Data
- Operasi yang menulis ke **lebih dari satu tabel sekaligus** (buat `Mahasiswa` + `User` sekaligus, verifikasi `Pembayaran` yang harus mengubah status `TagihanUkt`) wajib dibungkus `DB::transaction()` — jika salah satu gagal, semua di-rollback. Pola ini sudah dipakai di `MahasiswaController`/`DosenController`/`TendikController`, tapi **belum** diterapkan di `PembayaranController::verify/reject` — pastikan begitu update tagihan disambungkan, keduanya dalam satu transaksi.
- Operasi yang rawan **race condition** (dua mahasiswa mengambil kuota kelas terakhir bersamaan saat pengajuan KRS, dua admin memverifikasi pembayaran yang sama secara bersamaan) wajib memakai row locking (`lockForUpdate()`) di dalam transaksi, atau constraint unik di level database — jangan hanya mengandalkan pengecekan `if (!exists)` di PHP sebelum insert, karena itu tidak atomik.

### 7.2 Integritas Referensial & Penghapusan Data
- Data akademik yang jadi rujukan historis (`Nilai`, `Krs`, `TagihanUkt`, `Pembayaran`, `Yudisium`) **tidak boleh** dihapus permanen (`->delete()` hard delete) — gunakan **soft delete** (`SoftDeletes` trait) agar riwayat akademik tidak pernah benar-benar hilang meski "dihapus" dari tampilan. Data master yang boleh hard-delete hanya yang tidak historis dan tidak direferensikan (mis. `Ruang` yang belum pernah dipakai jadwal).
- Sebelum menghapus data master yang direferensikan (`ProgramStudi`, `MataKuliah`, `Dosen`), cek dulu apakah masih ada relasi aktif (mahasiswa terdaftar, kelas terjadwal) — tolak dengan pesan jelas, jangan biarkan foreign key constraint melempar error database mentah ke pengguna.
- Migration wajib mendefinisikan `foreignId()->constrained()` dengan `onDelete()` eksplisit (`cascade`/`restrict`) sesuai kebutuhan di atas — jangan biarkan default MySQL/`RESTRICT` implisit tanpa dipikirkan.

### 7.3 Index Database
- Kolom yang sering dipakai di `where()`/`orderBy()` di listing besar wajib punya index: `status` (di `Krs`, `TagihanUkt`, `Pembayaran`), foreign key yang tidak otomatis ter-index tanpa `constrained()`, dan kolom unik seperti `Pembayaran.uuid` (dipakai sebagai route key — **saat ini belum `unique()`**, harus ditambahkan lewat migration baru).
- Composite index untuk kombinasi filter yang sering dipakai bersamaan (mis. `mahasiswa_id + academic_year_semester_id` di `Krs`) mempercepat query listing yang di-scope per semester.

### 7.4 Error Handling & Logging
- Jangan menangkap exception hanya untuk menyembunyikannya (`try { ... } catch (\Exception $e) {}` kosong) — minimal log via `Log::error()` dengan konteks (user id, payload relevan tanpa data sensitif).
- Proses yang bisa gagal karena faktor eksternal (generate PDF besar, import Excel) harus memberi pesan error yang bisa ditindaklanjuti pengguna ("Baris ke-14 kolom NIM kosong"), bukan generic "Terjadi kesalahan".
- Jangan tampilkan stack trace atau pesan exception mentah ke pengguna di production (`APP_DEBUG=false` wajib di server produksi) — pesan ke pengguna selalu bahasa manusia, detail teknis hanya di log.

### 7.5 Pekerjaan Berat → Queue
- Proses yang berpotensi lambat dan tidak butuh respons instan (generate laporan PDF untuk ratusan/ribuan baris, kirim notifikasi email/WA massal, import Excel besar) **wajib** dijalankan lewat Queue Job (`php artisan make:job`), bukan sinkron di request-response cycle — request HTTP yang menggantung lama berisiko timeout dan memblokir worker PHP-FPM.
- `LaporanController::export*` saat ini sinkron (`Pdf::loadView(...)->download(...)`) — ini masih aman untuk skala data sekarang, tapi begitu volume mahasiswa/nilai membesar, pindahkan ke job + notifikasi "laporan siap diunduh" agar tidak timeout.

### 7.6 Pagination & Volume Data
- Listing yang berpotensi besar (mahasiswa, nilai, riwayat pembayaran) **wajib** `paginate()`, bukan `->get()` semua baris — pola ini sudah benar di `UserController::index` (`paginate(10)`), tapi beberapa controller baru (`PembayaranController::index`, `LaporanController`) masih memakai `->get()` tanpa batas. Terapkan pagination begitu data produksi mulai tumbuh, jangan tunggu sampai halaman jadi lambat.
- Export PDF/Excel boleh mengambil semua baris (tidak dipaginate) karena memang tujuannya dokumen lengkap — tapi tetap terapkan §8.5 (queue) begitu volumenya besar.

### 7.7 Rate Limiting & Brute Force
- Endpoint login, reset password, dan verifikasi OTP/2FA wajib dibatasi rate limit (`throttle:` middleware) — Fortify sudah menyediakan ini secara default, jangan dinonaktifkan.
- Aksi yang bisa disalahgunakan untuk spam (submit KRS berulang, upload bukti pembayaran berulang) sebaiknya dibatasi jumlah percobaan per menit per user.

### 7.8 Konsistensi Waktu & Lokal
- `config('app.timezone')` harus konsisten `Asia/Jakarta` di seluruh aplikasi — jangan campur `now()` server default dengan asumsi WIB manual di frontend. Semua tanggal akademik (periode KRS, jatuh tempo UKT) dibandingkan lewat objek `Carbon`, bukan string tanggal mentah.
- Format tanggal yang ditampilkan ke pengguna selalu format Indonesia (`d F Y`, mis. "31 Agustus 2026"), konsisten dengan `Intl.NumberFormat('id-ID', ...)` yang sudah dipakai untuk mata uang (lihat `DESIGN.md` §2.2).

### 7.9 Environment & Secrets
- Tidak ada perbedaan behavior kode antara environment yang dicek lewat `if (config('app.env') === 'local')` tersebar di banyak file — gunakan feature flag/config terpusat jika memang perlu behavior berbeda per environment.
- Kredensial pihak ketiga (payment gateway saat modul Pembayaran online dikembangkan, SMTP, WA gateway) selalu lewat `.env` + `config/services.php`, tidak pernah hardcoded meski untuk keperluan testing sementara.

### 7.10 Aksesibilitas (a11y) Dasar
- Semua form input punya `<label>` terasosiasi (via `htmlFor`/`id`), bukan hanya `placeholder` sebagai label — penting karena banyak pengguna (dosen, staf BAAK) mengakses lewat browser lama/perangkat terbatas.
- Kontras warna teks-di-atas-warna (terutama teks putih di atas `--sidebar` hijau, dan badge status) memenuhi rasio kontras WCAG AA minimal — jangan turunkan opacity teks pada latar gelap demi estetika sampai sulit terbaca.
- Elemen interaktif (tombol ikon-only di tabel, lihat `DESIGN.md` §3.2) wajib punya `aria-label`/`title`, tidak hanya ikon visual tanpa teks alternatif.

---

## 8. Checklist Sebelum Commit/PR

- [ ] Tidak ada model/query langsung di Blade view — semua data lewat controller.
- [ ] Semua relasi yang ditampilkan sudah di-`with()`/`load()` — tidak ada N+1 baru.
- [ ] Input tervalidasi, `$fillable` eksplisit, tidak ada mass assignment field sensitif.
- [ ] Otorisasi scoped-by-user sudah diperiksa, bukan hanya middleware role di level route.
- [ ] File upload lama dihapus saat diganti; validasi tipe & ukuran file konsisten.
- [ ] Halaman baru aman di-SSR (tidak akses `window`/`document` di render awal).
- [ ] `vendor/bin/pint --dirty --format agent` sudah dijalankan dan lolos.
- [ ] Pest test ditambahkan/diperbarui dan lolos untuk perubahan yang dilakukan.
- [ ] Operasi multi-tabel dibungkus `DB::transaction()`; operasi rawan race condition memakai locking.
- [ ] Data historis/akademik memakai soft delete, bukan hard delete.
- [ ] Listing besar dipaginate; proses berat (PDF/Excel massal) dipertimbangkan lewat queue.
- [ ] Tidak ada exception yang ditelan diam-diam tanpa logging.
