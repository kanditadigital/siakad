---
paths:
  - app/Models/Mahasiswa.php
  - app/Models/ProgramStudi.php
---

# Models

## Mahasiswa.batas_semester_normal can be null — guard partial selects
`Mahasiswa::semester_saat_ini` (added 2026-09-02) tracks the student's current semester explicitly — it is NOT derived from KRS history. It only advances via the bulk "Naikkan Semester" action (`Admin\MahasiswaController::naikkanSemester`, `AdminProdi\MahasiswaController::naikkanSemester`), scoped to `status = 'aktif'` mahasiswa of one program studi. Never recalculate it from KRS counts.

`batas_semester_normal` (appended accessor) = `programStudi.lama_studi * 2` (S1=8, D3=6, ...). It returns **null**, not the computed value, whenever a query selects specific columns without `program_studi_id` (e.g. `Mahasiswa::get(['id','nim','nama'])` for lightweight pickers in `Dosen/BimbinganTugasAkhirController` and `AdminProdi/DosenPaController`) — accessing `->programStudi` without that FK column present throws. Any new partial-column Mahasiswa query must either include `program_studi_id` or accept a null `batas_semester_normal` on the frontend.

## NIM format: {kode wajib prodi 3 digit}{tahun}{01 tetap}{nomor urut}
`ProgramStudi::generateNim()` builds NIM as `{nim_prefix}{yearSuffix}{"01" literal, hardcoded}{paddedCounter}`, e.g. 1492501001 = 149 (nim_prefix, numeric 3-digit "kode wajib" per prodi) + 25 (tahun masuk) + 01 (literal, tidak merepresentasikan apa pun — jangan dibuat configurable) + 001 (nomor urut).
`nim_prefix` validasinya `digits:3` (bukan lagi huruf bebas seperti "TIF") di `Admin/ProgramStudiController::store/update`.
`Mahasiswa::angkatan()` masih benar tanpa perubahan karena ia membaca yearSuffix langsung setelah `nim_prefix`, sebelum segmen "01".
