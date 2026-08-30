<?php

namespace App\Models;

use Database\Factories\RuangFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable(['kode_ruang', 'nama_ruang', 'kapasitas', 'lantai', 'gedung'])]
class Ruang extends Model
{
    /** @use HasFactory<RuangFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'ruang';

    /**
     * @return HasMany<Kelas, $this>
     */
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (Ruang $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
