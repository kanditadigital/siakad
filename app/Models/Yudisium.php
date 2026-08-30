<?php

namespace App\Models;

use Database\Factories\YudisiumFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'mahasiswa_id',
    'tanggal_yudisium',
    'ipk',
    'total_sks',
    'judul_skripsi',
    'status',
    'predikat',
    'keterangan',
])]
class Yudisium extends Model
{
    /** @use HasFactory<YudisiumFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'yudisiums';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_yudisium' => 'date',
            'ipk' => 'decimal:2',
            'total_sks' => 'integer',
        ];
    }

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
        static::creating(function (Yudisium $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
