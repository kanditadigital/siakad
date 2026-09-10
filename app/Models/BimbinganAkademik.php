<?php

namespace App\Models;

use Database\Factories\BimbinganAkademikFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * A dated academic-guidance note from a dosen PA to their mahasiswa asuh —
 * either standalone ("Kurangi SKS semester ini") or attached to a KRS review
 * action (krs_id set), so guidance is recorded in SIAKAD rather than only
 * happening over chat.
 */
#[Fillable(['dosen_id', 'mahasiswa_id', 'krs_id', 'topik', 'catatan'])]
class BimbinganAkademik extends Model
{
    /** @use HasFactory<BimbinganAkademikFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'bimbingan_akademik';

    /**
     * @return BelongsTo<Dosen, $this>
     */
    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }

    /**
     * @return BelongsTo<Mahasiswa, $this>
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    /**
     * @return BelongsTo<Krs, $this>
     */
    public function krs(): BelongsTo
    {
        return $this->belongsTo(Krs::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (BimbinganAkademik $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
