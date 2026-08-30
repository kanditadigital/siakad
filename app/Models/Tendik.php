<?php

namespace App\Models;

use Database\Factories\TendikFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'user_id',
    'nip',
    'nama',
    'email',
    'no_telepon',
    'jenis_kelamin',
    'jabatan',
    'unit_kerja',
    'pendidikan_terakhir',
    'alamat',
    'status',
])]
class Tendik extends Model
{
    /** @use HasFactory<TendikFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'tendik';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'aktif',
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
        static::creating(function (Tendik $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });

        static::saved(function (Tendik $tendik): void {
            $tendik->user?->forceFill([
                'name' => $tendik->nama,
            ])->saveQuietly();
        });
    }
}
