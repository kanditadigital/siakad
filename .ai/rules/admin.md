---
paths:
  - app/Http/Controllers/Admin/MahasiswaController.php
---

# Admin

## Mahasiswa account password defaults to the generated NIM
`Admin\MahasiswaController::store` sets `password = bcrypt($nim)` (the NIM just generated via `ProgramStudi::generateNim()`), not a hardcoded literal — same convention as dosen accounts using NIDN (see [[dosen account password rule]] in `.ai/rules/controllers.md`). Login field for mahasiswa is already NIM, so a freshly created account logs in with NIM as both username and password. `AdminProdi\MahasiswaController` has no `store()` (admin_prodi is read-only for mahasiswa), so nothing to mirror there.
