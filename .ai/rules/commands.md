---
paths:
  - app/Console/Commands/SyncMustChangePasswordFlag.php
---

# Commands

## must_change_password only applies going forward — run the sync command for old accounts
The `users.must_change_password` column defaults to `false`, so every dosen/mahasiswa account created before this feature shipped has it `false` regardless of whether their password is still their NIDN/NIM — the popup/redirect (see [[first-login forced password change rule]]) simply won't trigger for them.
`php artisan users:sync-must-change-password` (`--dry-run` to preview) backfills this: it checks each dosen/mahasiswa whose flag is still `false` and, only if `Hash::check($nidn_or_nim, $user->password)` actually matches, flips the flag to `true`. Accounts that already changed their password are left alone. Run this once after deploying the feature, and again any time a bulk-imported/legacy batch of accounts needs the same check.
