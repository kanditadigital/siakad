<?php

namespace App\Models;

use Database\Factories\KelasFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'kode_kelas',
    'nama_kelas',
    'mata_kuliah_id',
    'dosen_id',
    'ruang_id',
    'kapasitas',
    'semester',
    'tahun_akademik',
    'status',
])]
class Kelas extends Model
{
    /** @use HasFactory<KelasFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'kelas';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'Aktif',
    ];

    /**
     * @return BelongsTo<MataKuliah, $this>
     */
    public function mataKuliah(): BelongsTo
    {
        return $this->belongsTo(MataKuliah::class);
    }

    /**
     * @return BelongsTo<Dosen, $this>
     */
    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }

    /**
     * @return BelongsTo<Ruang, $this>
     */
    public function ruang(): BelongsTo
    {
        return $this->belongsTo(Ruang::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (Kelas $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
