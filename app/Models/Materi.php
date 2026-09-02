<?php

namespace App\Models;

use App\Concerns\InteractsWithUploads;
use Database\Factories\MateriFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string|null $file_path
 * @property string|null $file_name
 * @property-read string|null $file_url
 * @property-read string|null $file_download_url
 */
class Materi extends Model
{
    /** @use HasFactory<MateriFactory> */
    use HasFactory, InteractsWithUploads;

    /**
     * @var string
     */
    protected $table = 'materi';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'kelas_id',
        'judul',
        'deskripsi',
        'file_path',
        'file_name',
    ];

    /**
     * @var list<string>
     */
    protected $appends = [
        'file_url',
        'file_download_url',
    ];

    /**
     * @return BelongsTo<Kelas, $this>
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Expiring URL that opens the PDF inline for previewing in the browser.
     */
    public function getFileUrlAttribute(): ?string
    {
        return static::uploadUrl($this->file_path, [
            'ResponseContentType' => 'application/pdf',
            'ResponseContentDisposition' => 'inline; filename="'.$this->downloadFilename().'"',
        ]);
    }

    /**
     * Expiring URL that forces the browser to download the PDF under its
     * original filename, rather than the random key it is stored under.
     */
    public function getFileDownloadUrlAttribute(): ?string
    {
        return static::uploadUrl($this->file_path, [
            'ResponseContentDisposition' => 'attachment; filename="'.$this->downloadFilename().'"',
        ]);
    }

    /**
     * A safe filename for the Content-Disposition header: falls back to the
     * judul when no original filename was recorded, and strips quotes so a
     * crafted filename can't break out of the header value.
     */
    private function downloadFilename(): string
    {
        $name = $this->file_name ?: $this->judul.'.pdf';

        return str_replace('"', '', $name);
    }
}
