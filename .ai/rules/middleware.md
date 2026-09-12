---
paths:
  - app/Http/Middleware/ForcePasswordChange.php
---

# Middleware

## First-login forced password change (must_change_password flag)
`users.must_change_password` (boolean, default false) is set to `true` whenever `Admin\DosenController`, `AdminProdi\DosenController`, or `Admin\MahasiswaController` create a new account (dosen password = NIDN, mahasiswa password = generated NIM).
`ForcePasswordChange` middleware is appended globally to the `web` group (bootstrap/app.php) and redirects any authenticated request to `password.force-change.edit` while the flag is true — exempt routes are `password.force-change.*` and `logout`. It runs on every request regardless of the `auth` middleware being present on that route.
`App\Http\Controllers\Auth\ForcePasswordChangeController` (routes in `routes/web.php`, page `resources/js/pages/auth/force-password-change.tsx`) reuses `App\Http\Requests\Settings\PasswordUpdateRequest` and clears the flag on success. Don't reintroduce a hardcoded default password (`bcrypt('password')`) for dosen/mahasiswa — see [[dosen account password rule]] and [[mahasiswa account password rule]].
