<?php

namespace App\Models;

use Database\Factories\NilaiFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'krs_id',
    'nilai',
    'grade',
    'status',
    'keterangan',
])]
class Nilai extends Model
{
    /** @use HasFactory<NilaiFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'nilai';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'belum',
    ];

    /**
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'nilai' => 'decimal:2',
        ];
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
        static::creating(function (Nilai $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
