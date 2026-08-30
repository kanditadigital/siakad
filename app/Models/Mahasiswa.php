<?php

namespace App\Models;

use Database\Factories\MahasiswaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $user_id
 * @property int $program_studi_id
 * @property string $nim
 * @property string $nama
 * @property Carbon $tanggal_lahir
 * @property-read User $user
 * @property-read ProgramStudi $programStudi
 */
#[Fillable([
    'user_id',
    'program_studi_id',
    'pa_dosen_id',
    'nim',
    'no_ktp',
    'nama',
    'tempat_lahir',
    'tanggal_lahir',
    'jenis_kelamin',
    'email_orang_tua',
    'no_hp_orang_tua',
    'alamat',
    'kode_domisili',
    'status',
])]
class Mahasiswa extends Model
{
    /** @use HasFactory<MahasiswaFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'mahasiswa';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'aktif',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
        ];
    }

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
     * @return BelongsTo<Dosen, $this>
     */
    public function paDosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class, 'pa_dosen_id');
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
        static::creating(function (Mahasiswa $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });

        static::saved(function (Mahasiswa $mahasiswa): void {
            $mahasiswa->user?->forceFill([
                'nim' => $mahasiswa->nim,
                'role' => $mahasiswa->user->role,
            ])->saveQuietly();

            if ($mahasiswa->user !== null && $mahasiswa->user->nim !== $mahasiswa->nim) {
                $mahasiswa->user->forceFill(['nim' => $mahasiswa->nim])->saveQuietly();
            }
        });
    }
}
