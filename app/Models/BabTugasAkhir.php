<?php

namespace App\Models;

use Database\Factories\BabTugasAkhirFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'bimbingan_tugas_akhir_id',
    'nama',
    'urutan',
    'selesai',
    'selesai_pada',
])]
class BabTugasAkhir extends Model
{
    /** @use HasFactory<BabTugasAkhirFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'bab_tugas_akhir';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'selesai' => 'boolean',
            'selesai_pada' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<BimbinganTugasAkhir, $this>
     */
    public function bimbinganTugasAkhir(): BelongsTo
    {
        return $this->belongsTo(BimbinganTugasAkhir::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (BabTugasAkhir $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
