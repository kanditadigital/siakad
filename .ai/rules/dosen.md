---
paths:
  - 'app/Http/Controllers/Dosen/**'
---

# Dosen

## Dosen PA module: KRS approval, bimbingan akademik, academic calc methods
Dosen PA (pembimbing akademik) can approve/reject/request-revision KRS for their own mahasiswa asuh (`pa_dosen_id`), independently and in parallel with Admin Prodi (`AdminProdi\KrsController`) — either approver finalizes a pending KRS first, there is no two-stage workflow. See `Dosen\KrsPaController`.

`Krs.status` includes `'revisi'` (besides pending/disetujui/ditolak) — a plain string column, no DB enum, so a new status only needs `in:` validation lists updated, no migration. `Krs.catatan` holds the latest reviewer note (same pattern as `Rps.catatan`); full history lives in `bimbingan_akademik` (dosen_id, mahasiswa_id, krs_id nullable, topik, catatan) — one unified table for both KRS-review notes and standalone PA consultation notes.

Academic calculations live on `Mahasiswa` (RULES.md: don't inline in controllers): `hitungIpk()`, `hitungIps($academicYearSemesterId=null)`, `totalSksLulus()`, `angkatan()` (derived from NIM year digits, not a stored column), `perkembanganAkademik()`, `mataKuliahBermasalah()` (D/E grades), `ringkasanPresensi()`. On `Krs`: `adaBentrokJadwal()` (uses `kelas.hari`/`jam_mulai`/`jam_selesai`, which DO exist since migration `2026_09_01_071511_add_jadwal_fields_to_kelas_table` — don't assume they're missing), `prasyaratTerpenuhi()` (uses `mata_kuliah.prasyarat_mata_kuliah_id`, single-prerequisite only, not a graph), `maxSksUntukIps()` (hardcoded 4-tier default: IPS≥3.00→24, 2.50-2.99→21, 2.00-2.49→18, <2.00→15 — advisory only, not enforced at approve time).

Mahasiswa can withdraw (`DELETE mahasiswa/krs/{krs}`) only `pending`/`revisi` KRS entries, to resubmit after a PA requests revision — there's no in-place edit for a submitted KRS.

## Nilai grading weights are set by dosen, not admin
Grading-component weights (bobot_tugas/uts/uas/partisipasi/kehadiran) live on the `dosen` table (one set per dosen, applies to every class they teach) and are self-edited via `Dosen\PengaturanNilaiController` (`dosen/pengaturan-nilai`), validated to sum to 100. Admin's `Pengaturan Nilai` card only keeps `nilai.periode_input_dibuka` (the institution-wide input-period toggle) — the old `nilai.bobot_*` Setting keys were removed from `Admin\PengaturanController`. Don't reintroduce a global admin-level weight setting; per-class overrides were explicitly declined in favor of per-dosen.

## Riwayat pendidikan is a dosen-owned, multi-row CRUD, not a single field
`Dosen.pendidikan_terakhir` (single string, admin/dosen-profile editable) is separate from `riwayat_pendidikan_dosen` (jenjang/nama_institusi/fakultas_prodi, one-to-many via `Dosen::riwayatPendidikan()`), which the dosen manages themselves on `dosen/profil/show` through `Dosen\RiwayatPendidikanController` (store/update/destroy, uuid route-bound, ownership checked via `dosen_id === $dosen->id` → 403). jenjang is constrained to `RiwayatPendidikanController::JENJANG` (SMA/SMK, D3, D4, S1, S2, S3); fakultas_prodi is nullable. Don't collapse this back into the single `pendidikan_terakhir` column.
