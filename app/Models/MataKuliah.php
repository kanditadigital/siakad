<?php

namespace App\Models;

use Database\Factories\MataKuliahFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'kode_mk',
    'nama_mk',
    'program_studi_id',
    'jenis',
    'sks',
    'semester',
    'status',
])]
class MataKuliah extends Model
{
    /** @use HasFactory<MataKuliahFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'mata_kuliah';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'aktif',
    ];

    /**
     * @return BelongsTo<ProgramStudi, $this>
     */
    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }

    /**
     * @return HasMany<Kelas, $this>
     */
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    #[Scope]
    protected function aktif(Builder $query): Builder
    {
        return $query->where('status', 'aktif');
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (MataKuliah $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
