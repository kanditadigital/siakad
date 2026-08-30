<?php

namespace App\Models;

use Database\Factories\UktSchemeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

#[Fillable([
    'nama',
    'jumlah',
    'keterangan',
    'aktif',
])]
class UktScheme extends Model
{
    /** @use HasFactory<UktSchemeFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'ukt_schemes';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'jumlah' => 'decimal:2',
            'aktif' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (UktScheme $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
