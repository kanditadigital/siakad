<?php

namespace App\Models;

use Database\Factories\ProgressTugasAkhirFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'bimbingan_tugas_akhir_id',
    'tahap',
    'tipe',
    'catatan',
    'dibuat_oleh_user_id',
])]
class ProgressTugasAkhir extends Model
{
    /** @use HasFactory<ProgressTugasAkhirFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'progress_tugas_akhir';

    /**
     * @return BelongsTo<BimbinganTugasAkhir, $this>
     */
    public function bimbinganTugasAkhir(): BelongsTo
    {
        return $this->belongsTo(BimbinganTugasAkhir::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function dibuatOleh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh_user_id');
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (ProgressTugasAkhir $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
