<?php

namespace App\Models;

use Database\Factories\PengajuanJudulTaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'mahasiswa_id',
    'judul',
    'status',
    'catatan',
])]
class PengajuanJudulTa extends Model
{
    /** @use HasFactory<PengajuanJudulTaFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'pengajuan_judul_ta';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'pending',
    ];

    /**
     * @return BelongsTo<Mahasiswa, $this>
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (PengajuanJudulTa $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
