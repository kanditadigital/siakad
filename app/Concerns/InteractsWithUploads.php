<?php

namespace App\Concerns;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Single point of contact between the application and the uploads disk.
 *
 * Uploads live in a private bucket, so a stored path is never a URL: it is
 * only ever exchanged for a short-lived pre-signed URL at render time. Keeping
 * that in one trait means the disk (and the fact that it is private) can be
 * changed without touching the controllers and models that use it.
 */
trait InteractsWithUploads
{
    /**
     * The disk every user upload is written to and read from.
     */
    protected static function uploadDisk(): Filesystem
    {
        return Storage::disk(config('filesystems.uploads'));
    }

    /**
     * Store an uploaded file and return its path, or null when nothing was uploaded.
     */
    protected static function storeUpload(?UploadedFile $file, string $directory): ?string
    {
        if ($file === null) {
            return null;
        }

        return $file->store($directory, config('filesystems.uploads')) ?: null;
    }

    /**
     * Delete a previously stored upload, tolerating a null or already-missing path.
     */
    protected static function deleteUpload(?string $path): void
    {
        if ($path === null || $path === '') {
            return;
        }

        static::uploadDisk()->delete($path);
    }

    /**
     * Build a temporary, expiring URL for a stored upload.
     *
     * Returns null for an empty path so callers never hit the disk — and so a
     * developer without S3 credentials can still render pages for records that
     * have no file attached.
     *
     * $options is forwarded to the S3 GetObject command (e.g.
     * `ResponseContentDisposition` to force a download with a chosen filename,
     * or `ResponseContentType` to control how the browser renders a preview).
     * The local disk used in development silently ignores unknown options.
     *
     * @param  array<string, string>  $options
     */
    protected static function uploadUrl(?string $path, array $options = []): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        return static::uploadDisk()->temporaryUrl(
            $path,
            now()->addMinutes((int) config('filesystems.upload_url_ttl')),
            $options,
        );
    }
}
