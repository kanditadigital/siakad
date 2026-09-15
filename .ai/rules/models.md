---
paths:
  - app/Models/Mahasiswa.php
  - app/Models/ProgramStudi.php
  - app/Models/Dosen.php
---

# Models

## Mahasiswa.batas_semester_normal can be null — guard partial selects
`Mahasiswa::semester_saat_ini` (added 2026-09-02) tracks the student's current semester explicitly — it is NOT derived from KRS history. It only advances via the bulk "Naikkan Semester" action (`Admin\MahasiswaController::naikkanSemester`, `AdminProdi\MahasiswaController::naikkanSemester`), scoped to `status = 'aktif'` mahasiswa of one program studi. Never recalculate it from KRS counts.

`batas_semester_normal` (appended accessor) = `programStudi.lama_studi * 2` (S1=8, D3=6, ...). It returns **null**, not the computed value, whenever a query selects specific columns without `program_studi_id` (e.g. `Mahasiswa::get(['id','nim','nama'])` for lightweight pickers in `Dosen/BimbinganTugasAkhirController` and `AdminProdi/DosenPaController`) — accessing `->programStudi` without that FK column present throws. Any new partial-column Mahasiswa query must either include `program_studi_id` or accept a null `batas_semester_normal` on the frontend.

## NIM format: {tanggal+bulan berdiri PT, "149"}{tahun masuk}{kode prodi 2 digit}{nomor urut}
`ProgramStudi::generateNim()` builds NIM as `{TANGGAL_BERDIRI_PT}{BULAN_BERDIRI_PT}{yearSuffix}{nim_prefix}{paddedCounter}`, e.g. 1492601001 = "149" (tanggal berdiri PT "14" + bulan berdiri PT "9", fixed, not zero-padded) + 26 (tahun masuk) + 01 (nim_prefix, numeric 2-digit **kode prodi**, e.g. PBA=01) + 001 (nomor urut).
`TANGGAL_BERDIRI_PT`/`BULAN_BERDIRI_PT` are hardcoded private constants on `ProgramStudi` — same for every prodi, not configurable per prodi (this differs from the old format where the fixed literal "01" sat between year and counter and meant nothing). `ProgramStudi::kodeBerdiriPt()` (public static) exposes the combined "149" fixed segment.
`nim_prefix` validation is `digits:2` (was `digits:3`) in `Admin/ProgramStudiController::store/update` — it's now the per-prodi NIM code, not an arbitrary "kode wajib".
`Mahasiswa::angkatan()` reads the year digits starting at offset `strlen(ProgramStudi::kodeBerdiriPt())`, not `strlen($prodi->nim_prefix)`, since the fixed segment now comes before the year instead of the prodi code.
Frontend NIM previews (`resources/js/pages/admin/program-studi/{create,edit,show}.tsx`, `resources/js/pages/admin/mahasiswa/create.tsx`) hardcode the matching `'149'` literal — keep in sync if the founding date ever changes.

## Dosen rank is two separate, both-optional fields: jabatan_fungsional and golongan
`dosen.pangkat_golongan` (single required string, PNS-golongan-formatted) was split 2026-09-12 into `jabatan_fungsional` (nullable, academic functional rank: Tenaga Pengajar/Asisten Ahli/Lektor/Lektor Kepala/Guru Besar — applies to every dosen) and `golongan` (nullable, PNS civil-servant rank like "Penata Muda III/a" — only applicable to dosen who are PNS, which most private/swasta campuses don't have). Both are optional now; neither is required.

Option lists live as `JABATAN_FUNGSIONAL`/`GOLONGAN` constants on `Admin\DosenController` and `AdminProdi\DosenController` (duplicated, same pattern as `RiwayatPendidikanController::JENJANG` — see [[dosen]]), and as matching frontend arrays in each create/edit page. Keep both controllers and all four pages in sync if the option lists change.

`Dosen\DosenProfileController::update` deliberately does not expose either field — pangkat/golongan/jabatan stays an admin/admin-prodi-only edit (institutional record), same as before the split.
