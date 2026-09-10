<?php

namespace App\Models;

use Database\Factories\BimbinganTugasAkhirFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'mahasiswa_id',
    'judul',
    'pembimbing_1_id',
    'pembimbing_2_id',
    'status',
    'catatan',
    'tahap_saat_ini',
    'selesai_pada',
    'acc_pembimbing_1_pada',
    'acc_pembimbing_2_pada',
])]
class BimbinganTugasAkhir extends Model
{
    /** @use HasFactory<BimbinganTugasAkhirFactory> */
    use HasFactory;

    /**
     * Fixed tahapan penyusunan tugas akhir, in order. `tahap_saat_ini` on
     * this model is always one of these keys.
     *
     * @var array<string, string>
     */
    public const TAHAPAN = [
        'pengajuan_judul' => 'Pengajuan Judul',
        'penyusunan_proposal' => 'Penyusunan Proposal',
        'seminar_proposal' => 'Seminar Proposal',
        'penyusunan_bab' => 'Penyusunan Bab',
        'penelitian' => 'Penelitian',
        'seminar_hasil' => 'Seminar Hasil',
        'sidang' => 'Sidang',
    ];

    /**
     * Default checklist seeded into `bab_tugas_akhir` the moment a bimbingan
     * reaches the `penyusunan_bab` tahap. The pembimbing can add more or
     * remove any of these afterwards — this is just a starting point.
     *
     * @var list<string>
     */
    public const DEFAULT_BAB = ['Bab 1', 'Bab 2', 'Bab 3', 'Bab 4', 'Bab 5'];

    /**
     * TAHAPAN as a list of [key, label] tuples — a PHP associative array
     * JSON-encodes as an object, not the array the frontend stepper expects,
     * so every controller sending tahapan to Inertia must go through this.
     *
     * @return list<array{0: string, 1: string}>
     */
    public static function tahapanList(): array
    {
        return collect(self::TAHAPAN)
            ->map(fn (string $label, string $key): array => [$key, $label])
            ->values()
            ->all();
    }

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
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'selesai_pada' => 'datetime',
            'acc_pembimbing_1_pada' => 'datetime',
            'acc_pembimbing_2_pada' => 'datetime',
        ];
    }

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

    /**
     * @return HasMany<ProgressTugasAkhir, $this>
     */
    public function progress(): HasMany
    {
        return $this->hasMany(ProgressTugasAkhir::class);
    }

    /**
     * @return HasMany<BabTugasAkhir, $this>
     */
    public function babTugasAkhir(): HasMany
    {
        return $this->hasMany(BabTugasAkhir::class)->orderBy('urutan');
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
