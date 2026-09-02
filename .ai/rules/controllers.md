---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## All user uploads go to the private uploads disk via InteractsWithUploads
Never call `->store($dir, 'public')` or `Storage::disk('public')` for user uploads. Use the `App\Concerns\InteractsWithUploads` trait: `static::storeUpload($request->file('x'), 'photos')`, `static::deleteUpload($oldPath)`, `static::uploadUrl($path)`.

The uploads disk (config `filesystems.uploads`, default the `uploads` S3 disk) is PRIVATE. A stored path is never a URL — the frontend must receive a pre-signed URL built by `uploadUrl()`, which expires after `filesystems.upload_url_ttl` minutes. Never build `/storage/${path}` in React again.

Models expose these as appended accessors: `User::photo_url`, `Rps::file_url`, `Pembayaran::bukti_pembayaran_url`. Add a new one the same way (`getXUrlAttribute()` + `#[Appends]`) when a new upload field appears — note the `Attribute::get()` cast form trips a larastan invariance bug here, so use the classic `getXAttribute()` accessor.

In tests use `Storage::fake(config('filesystems.uploads'))`.
