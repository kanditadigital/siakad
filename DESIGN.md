# DESIGN.md — Panduan UI/UX SIAKAD

Panduan ini mengatur bagaimana antarmuka SIAKAD dibangun dengan Tailwind CSS v4 agar terasa seperti **produk kampus yang dirancang serius**, bukan template dashboard generik hasil AI (kartu putih seragam, shadow lembut di mana-mana, gradient ungu-biru, ikon emoji besar di tengah, spasi seragam tanpa hierarki). Setiap aturan di sini punya alasan — bukan preferensi kosmetik.

---

## 1. Filosofi

> Instansi pendidikan Islam yang serius, bukan startup SaaS. Sistem ini dipakai berulang setiap hari oleh admin BAAK yang menatap tabel, dosen yang menginput nilai, dan mahasiswa yang mengecek tagihan. Desainnya harus **cepat dibaca, cepat dipindai (scannable), dan tidak melelahkan mata** — bukan "wah" sesaat.

Yang dihindari secara eksplisit (ciri khas "generic AI dashboard"):
- Kartu (`card`) putih polos ber-`shadow-md` yang ditumpuk seragam tanpa hierarki visual apa pun.
- Ikon bulat berwarna pastel di kiri atas setiap kartu statistik, tanpa makna kontekstual.
- Gradient dekoratif (`bg-gradient-to-r from-purple-500 to-blue-500`) yang tidak merepresentasikan apa pun di data.
- Border-radius seragam besar (`rounded-2xl`) di semua elemen tanpa variasi skala.
- Font-weight yang sama untuk judul dan isi, dibedakan hanya lewat ukuran.
- Empty state dengan ilustrasi generik bertema "cloud" atau "rocket" yang tidak relevan dengan konteks akademik.
- Warna aksen sembarang (indigo/violet) yang tidak berhubungan dengan identitas kampus.
- Glassmorphism (`bg-white/20` + `backdrop-blur` di atas panel berwarna) — dibersihkan total dari aplikasi 2026-09-01, jangan diperkenalkan kembali.
- Gradient dekoratif apa pun (`bg-gradient-to-*`), termasuk gradient "halus" seperti `from-green-50 to-white` pada kartu KPI — solid + border + shadow-sm sudah cukup memberi kedalaman. Pita KPI dashboard memakai **empat fill solid** dari token `--color-kpi-*`, bukan gradient.

---

## 2. Identitas Visual

### 2.1 Palet Warna
Sumber kebenaran: `resources/css/app.css` (`@theme` dan `:root`). **Jangan** menambahkan warna aksen baru di luar token yang sudah didefinisikan tanpa alasan kuat — semua warna kustom didaftarkan sebagai CSS variable, bukan hex literal di JSX.

| Token | Nilai | Peran |
|---|---|---|
| `--primary` / `primary` | `#166534` (green-800) | Aksi utama, brand, sidebar aktif |
| `--background` | `#f3f5f3` | Latar area kerja (hijau-abu redup) — kartu/tabel butuh "tanah" untuk berpijak. Sempat `#f3f6fa` (biru-abu) selama fase Midone; dikembalikan saat sidebar kembali hijau karena latar dingin di bawah panel hijau terasa sumbang |
| `--sidebar` | `var(--color-green-800)` `#166534` | Latar sidebar. Sejak 2026-09-05 sidebar **hijau institusi** — nilainya sama dengan `--primary`, jadi panel memakai warna merek sendiri, bukan warna pinjaman. Menggantikan fase biru Midone (`#2947b8`) yang hanya bertahan sehari, dan sidebar putih 2026-09-02 |
| `--sidebar-accent` / `-accent-foreground` | `#ffffff` / `#1f2937` | Item menu aktif: pil putih + label gelap + ikon hijau (`text-sidebar`). Hover item non-aktif memakai `bg-white/10`, bukan token ini |
| `--color-kpi-*` (`mahasiswa`/`pegawai`/`akademik`/`keuangan`) | hijau / teal / biru / oranye | **Khusus pita KPI dashboard**: empat ukuran berbeda harus bisa dibedakan sekilas. Di luar KPI dashboard, jangan pakai empat warna ini |
| `--accent` | `#dcfce7` (green-100) | Highlight lembut, badge status positif |
| `--destructive` | `#dc2626` | Error, status "belum lunas"/"ditolak" |
| `--muted` | `#f5f5f5` | Latar sekunder, baris tabel alternatif |
| skala `green-50…950` | — | Satu-satunya skala warna aksen kustom; dipakai konsisten, bukan campur dengan Tailwind default indigo/violet/purple |
| `--color-siak-pine` / `-pine-deep` | `green-800` / `green-900` | Alias untuk panel/header bermerek non-sidebar (mis. panel foto di halaman profil) — dipakai bukan `--primary` langsung karena perannya spesifik (blok warna solid, bukan aksi) |
| `--color-siak-mist` / `-sage` / `-moss` / `-fern` | lihat `app.css` | Dipakai khusus oleh `Table` (header wash, label uppercase) dan `nav-main` (indikator aktif) — **jangan hapus tanpa memeriksa kedua komponen itu**, sempat tidak terdefinisi sama sekali (2026-09-01) sehingga highlight sidebar aktif dan header tabel senyap total tanpa warna |
| `--color-gold` / `-gold-soft` | `#a9822f` / `#d9c48c` | Aksen emas institusi (dipakai di halaman login) — token, bukan hex literal berulang |

Tema institusi: **hijau & kuning** (`siakad.json`). Kuning/emas dipakai secara **sangat selektif** — untuk badge/aksen "perlu perhatian" (mis. status "menunggu konfirmasi", RPS "perlu revisi") — bukan sebagai warna latar besar. Jangan campur hijau institusi dengan hijau "sukses" generik Tailwind (`emerald`/`teal`) — pakai skala `green` yang sudah didefinisikan agar identitas konsisten.

**Status color mapping** (dipakai lintas modul, harus konsisten):
```
aktif / lunas / approved / verified / disetujui   → green (primary/accent)
cuti / pending / menunggu konfirmasi / perlu revisi → amber/yellow (khas institusi)
nonaktif / belum / terlambat / rejected / ditolak   → destructive (red-600)
lulus / selesai                                     → primary, dengan badge "outline" bukan solid (status akhir, tidak butuh urgensi visual)
```
Jangan gunakan warna berbeda untuk status yang secara semantik sama di dua halaman berbeda (mis. "lunas" hijau di satu tempat, biru di tempat lain).

### 2.2 Tipografi
- Font: `Instrument Sans` (sudah dikonfigurasi di `--font-sans`). Jangan ganti tanpa alasan — konsistensi lintas 40+ halaman lebih penting daripada preferensi font per komponen.
- Hierarki wajib punya minimal **3 tingkat kontras**, bukan cuma beda ukuran:
  - Judul halaman: `text-2xl font-semibold tracking-tight` — bukan `font-bold` di semua judul (terlalu berat, generik).
  - Label section/kartu: `text-sm font-medium text-muted-foreground uppercase tracking-wide` untuk label kategori (mis. "STATUS AKADEMIK"), bukan `text-lg font-bold` seperti judul biasa.
  - Angka statistik besar (KPI): `text-3xl font-bold tabular-nums` — `tabular-nums` wajib untuk semua angka (uang, SKS, IPK) agar rata kanan rapi saat berdampingan.
  - Body/isi tabel: `text-sm`, bukan `text-base` — tabel data padat butuh kepadatan lebih tinggi daripada halaman marketing.
- Data uang (Rupiah) selalu diformat via `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })` — jangan hardcode "Rp" + string manual (rawan salah format ribuan).

### 2.3 Border Radius & Skala
Radius sudah ditentukan lewat `--radius: 0.375rem` (6px, diturunkan dari 8px 2026-09-05 mengikuti referensi Midone) dan turunannya (`--radius-lg/md/sm`). **Jangan** memakai `rounded-2xl`/`rounded-3xl` di kartu — itu ciri khas template AI generik. Skala radius kita:
- Kartu, modal, dropdown: `rounded-lg` (var `--radius-lg`)
- Button, input, badge: `rounded-md`
- Avatar/foto profil bulat: `rounded-full` (satu-satunya pengecualian penuh)

---

## 3. Komponen

### 3.1 Kartu Statistik (Dashboard KPI)
Hindari pola "ikon bulat pastel + angka besar + label" yang seragam di semua kartu tanpa hierarki. Sebagai gantinya:
- Kartu KPI **paling penting** di setiap dashboard (mis. "Tagihan Belum Lunas" untuk admin keuangan) diberi treatment berbeda — border kiri tebal `border-l-4 border-l-primary`, bukan sama rata dengan kartu lain.
- Trend/perbandingan (naik/turun dari periode sebelumnya) ditampilkan sebagai teks kecil dengan panah, bukan cuma angka mentah — data akademik selalu punya konteks waktu (semester berjalan vs lalu).
- Gunakan `border` tipis (`border border-border`) + `shadow-sm` **saja** — bukan `shadow-lg`/`shadow-xl`. Shadow berat membuat halaman terasa "melayang" dan tidak profesional untuk aplikasi kerja harian.

### 3.2 Tabel Data
Tabel adalah komponen paling sering dipakai di SIAKAD (daftar mahasiswa, nilai, tagihan, dst) — kualitasnya menentukan kualitas produk secara keseluruhan.
- Header tabel: `bg-muted text-muted-foreground text-xs font-medium uppercase tracking-wide` — bukan header putih polos tanpa pembeda dari body.
- Baris zebra **opsional**, hanya jika tabel > 15 baris tanpa pagination visual jelas: `even:bg-muted/40`.
- Baris hover: `hover:bg-accent/50 transition-colors` — memberi afordansi bahwa baris bisa diklik (untuk navigasi ke detail).
- Kolom angka (SKS, nilai, nominal) selalu rata kanan (`text-right tabular-nums`), kolom status selalu pakai Badge, bukan teks polos berwarna.
- Aksi per baris (edit/hapus/detail) dikelompokkan di kolom paling kanan, ikon-only dengan `title` tooltip — jangan tulisan "Edit | Hapus" berulang di setiap baris (berisik secara visual pada tabel panjang).
- Search + filter selalu di atas tabel dalam satu baris toolbar (`flex items-center justify-between gap-2`), bukan disebar terpisah.

### 3.3 Badge Status
- Bentuk: `rounded-md px-2 py-0.5 text-xs font-medium` — bukan `rounded-full` besar (pill penuh terlihat seperti dashboard SaaS generik, bukan sistem administrasi formal).
- Warna badge mengikuti status color mapping (§2.1), memakai varian *soft* (background muda + teks tua dari warna yang sama — mis. `bg-green-100 text-green-800`), bukan solid penuh (`bg-green-600 text-white`) kecuali untuk aksi/tombol.

### 3.4 Form
- Layout form panjang (mis. tambah mahasiswa/dosen) dikelompokkan per section dengan judul section (`Data Pribadi`, `Data Akademik`, `Kontak Darurat`) memakai divider (`border-t pt-6`), bukan satu form flat 20 field berurutan tanpa jeda visual.
- Field wajib ditandai `*` merah kecil di label, bukan hanya divalidasi diam-diam saat submit.
- Upload foto: preview lingkaran di kiri (`h-32 w-32 rounded-full object-cover`) + inisial nama sebagai fallback (pola ini **sudah** diterapkan konsisten di modul Dosen/Mahasiswa/Tendik/User — pertahankan, jangan reimplementasi berbeda-beda per halaman).
- Pesan error inline di bawah field (`text-sm text-destructive mt-1`), bukan alert box terpisah di atas form untuk error per-field.
- Tombol submit primer selalu di kanan bawah form, tombol batal/kembali di kirinya dengan varian `outline` — urutan ini konsisten di semua form CRUD.

### 3.5 Navigasi (Sidebar)
Sidebar **hijau institusi gelap** (`--sidebar: var(--color-green-800)` = `#166534`, `--sidebar-border: rgba(255,255,255,.12)`), diputuskan 2026-09-05. Nilainya sengaja sama dengan `--primary`: panel navigasi memakai warna merek kampus sendiri, sehingga tombol utama, tautan, dan sidebar terbaca sebagai satu palet.

Riwayat keputusan (jangan diputar balik tanpa keputusan baru): sidebar hijau solid lama → **putih** (2026-09-02) → **biru Midone** `#2947b8` (2026-09-05) → **hijau institusi** (2026-09-05, sore). Bentuk/struktur hasil fase Midone — brand horizontal, pil putih untuk item aktif, sudut melengkung, lebar 240px — **dipertahankan**; yang berubah hanya warnanya. Jadi jangan menafsirkan "kembali ke hijau" sebagai kembali ke tata letak sebelum 2026-09-05.
- **Lebar 240px** (`--sidebar-width: 15rem`, di-override dari `SidebarProvider` pada `app-shell.tsx`, bukan 16rem bawaan shadcn) — lebih rapat, mendekati pita 220–230px referensi, dan masih cukup untuk label terpanjang ("Bimbingan Tugas Akhir").
- **Transisi curved** di pertemuan sidebar dan top header. Siluetnya adalah **panel konten yang membulatkan sudut kiri-atasnya** dengan warna sidebar di belakangnya — *bukan* gigitan pada sidebar; sisi kanan sidebar tetap lurus. Implementasinya satu elemen dekoratif di `app-sidebar-header.tsx`: kotak `absolute top-0 left-0 size-6 bg-sidebar` berisi `size-full rounded-tl-[1.5rem] bg-card`. Ingat `border-radius` **membuang** material dari sudut yang disebutnya — karena itu yang dibulatkan adalah sudut kiri-atas milik lapisan putih, sehingga warna sidebar muncul di sudut pertemuan. Membulatkan sudut yang salah menghasilkan artefak "pojok terlipat" (pernah terjadi 2026-09-05).
- Elemen itu dipasang pada offset **positif** (`left-0`) di dalam header, jadi aman dari `overflow-x-clip` milik pembungkus konten — versi yang menggantung ke kiri (offset negatif) terpotong diam-diam. Karena ia anak dari header, kurvanya ikut `sticky` saat halaman digulir dan otomatis mengikuti tepi rail saat sidebar collapse ke mode ikon. Hanya desktop (`lg:block`); di mobile sidebar adalah drawer, jadi tidak ada sambungan yang perlu dilembutkan.
- **Tanpa border kanan.** Primitif shadcn membawa `border-r` yang diwarnai aturan global `* { @apply border-border }` memakai `--border` (abu terang) — pas untuk sidebar putih dulu, tapi menjadi garis putih di tepi panel hijau. Dimatikan dari sisi pemanggil (`app-sidebar.tsx`, `className="group-data-[side=left]:border-r-0"`) supaya `components/ui/sidebar.tsx` tetap utuh. Varian `group-data-[side=left]:` **wajib** ikut ditulis: tailwind-merge hanya menggabungkan kelas dengan varian yang sama, dan `border-r-0` polos juga kalah spesifisitas.
- Teks dan ikon default di sidebar memakai `text-sidebar-foreground` (putih tembus, bukan `text-muted-foreground`) — token itu sengaja gelap untuk latar putih lama dan **tidak terbaca** di atas panel gelap. Ini berlaku untuk label grup (`nav-main.tsx`), ikon item, dan chevron submenu.
- **Header sidebar** adalah blok **horizontal** setinggi ±72px: plate `size-9 rounded-lg` (logo kampus dari prop global `kampus`) di kiri, lalu nama kampus (`13px`, `font-semibold`, `line-clamp-2`) dan subjudul "SISTEM INFORMASI AKADEMIK" (`9px`, `tracking-[0.1em]`). Susunan tegak-terpusat yang lama memakan ±150px tinggi sebelum menu pertama — mahal untuk hiasan. Bila logo **belum** diunggah, plate memakai `bg-white/10 ring-white/20` + inisial kampus (dua huruf pertama dari dua kata pertama), **bukan** plate `green-700` seperti dulu: di atas sidebar hijau, plate hijau lenyap ditelan panel di belakangnya. Jangan hapus fallback itu — instalasi baru selalu mulai tanpa logo.
- Label grup menu: **"MENU UTAMA"** dan **"SISTEM"** (`10px`, `font-medium`, `tracking-[0.14em]`, uppercase, `sidebar-foreground/45`). Grup "SISTEM" hanya ada untuk admin (Pengguna, Pengaturan) — memisahkan "yang saya kerjakan" dari "yang saya administrasi". Akun pengguna (nama, role, logout) dibuka lewat avatar di **top header**, bukan dari footer sidebar (lihat §3.6) — sidebar tidak merender blok akun.
- Item menu boleh membawa **lencana angka** (`NavItem.badge`, mis. jumlah tagihan belum lunas pada "Keuangan"). Angkanya datang dari prop global `chrome.tugas` (`HandleInertiaRequests`, di-cache 1 menit, hanya untuk peran staf) — jangan query ulang per halaman.
- Footer sidebar hanya menampilkan kartu **TAHUN AKADEMIK** (dari `chrome.periode`), memakai **putih tembus** (`bg-white/8` + `ring-white/12` + teks putih) — kartu terang seperti `bg-green-50` melubangi panel gelap. Footer **tidak dirender sama sekali** bila `periode` kosong, dan disembunyikan di mode ikon: `SidebarFooter` kosong menyisakan garis `border-t` yang menggantung tanpa isi.
- Grup menu (Data Master, Akademik, Keuangan, dst — lihat `app-sidebar.tsx`) tetap dipertahankan sebagai collapsible group per peran, bukan flat list — struktur ini mencerminkan model mental pengguna (BAAK berpikir per domain, bukan per halaman).
- Submenu (anak dari collapsible group) diberi **rail penanda** — garis vertikal `border-l border-white/15` + `pl-2` — bukan sekadar `ml-4` polos. Rail disembunyikan saat sidebar collapse ke mode ikon.
- Header dan footer dipisahkan dari daftar menu dengan `border-sidebar-border` tipis, bukan shadow.
- Item aktif: pil putih (`bg-sidebar-accent`) + teks gelap (`sidebar-accent-foreground`) + **ikon hijau** (`text-sidebar` — ikon selalu memakai warna panel itu sendiri, jadi ia ikut berubah bila warna sidebar diganti lagi). **Tanpa rail kiri 3px** — rail itu perlu waktu latar aktif masih wash hijau muda; di atas panel gelap pil putih sudah elemen paling keras di sidebar, menambah rail terbaca sebagai kebisingan.
- **Hover** item non-aktif memakai wash `bg-white/10`, bukan pil putih penuh bawaan primitif shadcn (`hover:bg-sidebar-accent`). Menyisakan pil solid khusus untuk item aktif adalah yang membuat panel tetap tenang saat kursor melintasinya — override ini ada di konstanta `ITEM` pada `nav-main.tsx`.
- Di mode ikon, `SidebarGroup` memakai `px-2` (bukan `px-3`) supaya tombol ikon 32px jatuh **terpusat** di rail 48px, tidak menempel ke tepi kiri.
- Ikon sidebar (`lucide-react`) selalu dari satu set ikon konsisten (sudah dimulai di `app-sidebar.tsx`) — jangan campur dengan set ikon lain (Heroicons, Font Awesome) di halaman berbeda.

### 3.6 Header Aplikasi
Bar putih `sticky` di atas area konten (`app-sidebar-header.tsx`): tombol collapse sidebar, kolom pencarian pil kecil, lonceng notifikasi, dan avatar akun — dalam urutan itu dari kiri ke kanan di sisi kanan header, meniru referensi Midone.
- Kolom pencarian (pil, `rounded-full`, `bg-muted`, lebar tetap ~160-176px) menembak `GET /pencarian` (`PencarianController`) — mahasiswa/dosen/mata kuliah, maksimal 5 per kategori, otomatis dibatasi ke prodi sendiri untuk `admin_prodi`. Hanya peran `admin` dan `admin_prodi` yang melihat kolom ini, karena hanya mereka yang punya halaman detail tujuannya.
- Lonceng membuka daftar pekerjaan tertunda (`chrome.tugas`) dengan titik merah bila ada, bukan ikon hiasan tanpa isi.
- **Avatar akun** (`header-user-menu.tsx`) membuka dropdown nama/role/pengaturan/logout — dipindah dari footer sidebar ke sini pada redesign 2026-09-05, isinya tetap memakai `UserMenuContent` yang sama (tidak ditulis ulang).
- Breadcrumb tampil di bawah header **hanya** bila lebih dari satu level — halaman puncak seperti dashboard tidak perlu "Dashboard >".

### 3.7 Empty State
Setiap tabel/list kosong wajib punya empty state kontekstual, bukan tabel kosong tanpa penjelasan:
- Ikon relevan konteks (mis. `GraduationCap` untuk "Belum ada mahasiswa"), bukan ilustrasi generik.
- Satu kalimat penjelas + CTA jika relevan ("Belum ada mahasiswa terdaftar" + tombol "Tambah Mahasiswa" untuk admin, tanpa CTA untuk peran read-only seperti Pimpinan).

---

## 4. Layout & Responsivitas

Wajib mobile-first sesuai prinsip "Responsif" di `siakad.json` — sistem dipakai mahasiswa dari HP untuk cek KRS/tagihan.

- **Breakpoint kerja:** `sm` (mobile besar/tablet potret), `lg` (desktop). Jangan desain 5 breakpoint berbeda — cukup 3 state: mobile stack, tablet 2-kolom, desktop penuh.
- Sidebar: collapsible ke ikon-only di tablet (`collapsible="icon"` — sudah dipakai), dan overlay drawer penuh di mobile.
- Tabel lebar di mobile: **jangan** memaksa scroll horizontal sebagai solusi default. Untuk tabel dengan >5 kolom, sediakan varian "card list" di breakpoint mobile (`sm:hidden` card + `hidden sm:block` table) untuk data yang sering dilihat mahasiswa (KHS, tagihan) — scroll horizontal hanya dapat diterima untuk tabel kerja admin yang memang dioperasikan di desktop (rekap nilai, presensi).
- Dashboard KPI grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` — jangan langsung 4 kolom di mobile (kartu jadi terlalu sempit dan angka terpotong).
- Padding halaman konsisten: `p-4 sm:p-6 lg:p-8` — jangan berbeda-beda per halaman (memberi kesan tiap halaman dibangun terpisah oleh alat berbeda).

---

## 5. Interaksi & Feedback

- Aksi destruktif (hapus data, tolak pembayaran) **selalu** lewat dialog konfirmasi dengan penjelasan konsekuensi, bukan aksi langsung dari klik tombol tabel.
- Flash message sukses/error (`with('success', ...)` di controller Laravel) ditampilkan sebagai toast di pojok, auto-dismiss — bukan alert banner permanen yang mendorong layout ke bawah.
- Loading state Inertia: gunakan progress bar tipis di atas halaman (pola bawaan Inertia), **jangan** skeleton loader generik untuk navigasi antar halaman biasa — skeleton hanya untuk `deferred props` (data yang sengaja dimuat belakangan di halaman yang sama, sesuai konvensi Inertia v3 di `CLAUDE.md`).
- Import/Export Excel dan generate PDF (laporan, kuitansi) memberi indikator progres/loading pada tombol (`disabled` + spinner + teks "Memproses...") karena proses ini bisa memakan waktu beberapa detik.

---

## 6. Aturan Praktis Tailwind

- **Jangan** menulis warna hex/rgb langsung di className (`bg-[#166534]`) — selalu lewat token semantik (`bg-primary`, `text-destructive`) yang sudah didefinisikan di `app.css`. Ini memastikan dark mode dan rebranding warna institusi (jika terjadi) tidak butuh cari-ganti di puluhan file.
- Komponen UI dasar (Button, Card, Badge, Table, Dialog) **wajib** dipakai dari `resources/js/components/ui/*` yang sudah ada (berbasis shadcn) — jangan menulis ulang `<div className="border rounded p-4 shadow">` sebagai "kartu custom" di halaman baru.
- Spacing pakai skala Tailwind standar (`gap-2/4/6/8`), hindari nilai arbitrary (`gap-[13px]`) kecuali menyesuaikan elemen pihak ketiga yang tidak bisa diubah.
- Konsistensi ikon: satu ikon = satu makna di seluruh aplikasi (mis. `Receipt` selalu untuk tagihan/kuitansi, `GraduationCap` selalu untuk data mahasiswa) — jangan ganti-ganti ikon untuk konsep yang sama di halaman berbeda.

---

## 7. Checklist Sebelum Merge Halaman Baru

- [ ] Tidak ada warna hex/gradient baru di luar token `app.css`.
- [ ] Badge status memakai warna sesuai mapping §2.1, konsisten dengan halaman lain yang menampilkan status sama.
- [ ] Tabel punya empty state kontekstual (bukan tabel kosong polos).
- [ ] Layout teruji di lebar mobile (375px) dan desktop — tidak ada elemen terpotong/overflow horizontal tidak sengaja.
- [ ] Angka uang/SKS/IPK pakai `tabular-nums` dan format `Intl.NumberFormat` yang benar.
- [ ] Tidak ada `rounded-2xl`/`shadow-xl`/gradient dekoratif yang tidak merepresentasikan data.
- [ ] Komponen diambil dari `components/ui/*`, bukan ditulis ulang dari nol.
