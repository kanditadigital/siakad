---
paths:
  - 'resources/js/pages/**'
---

# Pages

## Never send PUT/PATCH with multipart/form-data (files) — spoof via POST
Inertia's `put()`/`patch()` send a real HTTP PUT/PATCH verb. When the payload includes a File (or `forceFormData: true` forces multipart), some production PHP/nginx setups silently drop the entire request body on non-POST methods, so Laravel sees every field as missing and rejects with "field is required" — even though it works fine locally. This bit `admin/pengaturan`, `admin/dosen edit`, `admin-prodi/dosen edit`, `admin/mahasiswa edit`, and the materi-edit form in `dosen/perkuliahan`.

Fix: whenever a form's data can include a File (or uses `forceFormData: true`), submit via `post()` with the method spoofed, not `put()`/`patch()`:
```ts
transform((data) => ({ ...data, _method: 'put' }));
post(url, { forceFormData: true });
```
`resources/js/pages/admin/user/edit.tsx` already did this manually with `FormData` + `formData.append('_method', 'PUT')` — that's the reference pattern. Plain JSON forms with no file field are unaffected and can keep using `put()`/`patch()` directly.
