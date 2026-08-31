<?php

namespace App\Models;

use Database\Factories\BimbinganTugasAkhirFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'mahasiswa_id',
    'judul',
    'pembimbing_1_id',
    'pembimbing_2_id',
    'status',
    'catatan',
])]
class BimbinganTugasAkhir extends Model
{
    /** @use HasFactory<BimbinganTugasAkhirFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'bimbingan_tugas_akhir';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'aktif',
    ];

    /**
     * @return BelongsTo<Mahasiswa, $this>
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    /**
     * @return BelongsTo<Dosen, $this>
     */
    public function pembimbing1(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'pembimbing_1_id');
    }

    /**
     * @return BelongsTo<Dosen, $this>
     */
    public function pembimbing2(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'pembimbing_2_id');
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (BimbinganTugasAkhir $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
