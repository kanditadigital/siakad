<?php

namespace App\Models;

use Database\Factories\DosenFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'user_id',
    'program_studi_id',
    'nidn',
    'nuptk',
    'nama',
    'email',
    'no_telepon',
    'jenis_kelamin',
    'pangkat_golongan',
    'pendidikan_terakhir',
    'alamat',
    'status',
])]
class Dosen extends Model
{
    /** @use HasFactory<DosenFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'dosen';

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
        static::creating(function (Dosen $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });

        static::saved(function (Dosen $dosen): void {
            $dosen->user?->forceFill(['nidn' => $dosen->nidn])->saveQuietly();
        });
    }
}
