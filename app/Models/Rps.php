<?php

namespace App\Models;

use Database\Factories\RpsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable(['kelas_id', 'file_path', 'status', 'catatan', 'uploaded_at'])]
class Rps extends Model
{
    /** @use HasFactory<RpsFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'rps';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'belum_upload',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'uploaded_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Kelas, $this>
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (Rps $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
