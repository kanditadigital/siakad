<?php

namespace App\Models;

use Database\Factories\KrsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'mahasiswa_id',
    'kelas_id',
    'academic_year_semester_id',
    'status',
])]
class Krs extends Model
{
    /** @use HasFactory<KrsFactory> */
    use HasFactory;

    /**
     * Batas maksimal SKS yang boleh disetujui untuk satu mahasiswa dalam satu periode akademik.
     */
    public const MAX_SKS = 24;

    /**
     * @var string
     */
    protected $table = 'krs';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'pending',
    ];

    /**
     * @return BelongsTo<Mahasiswa, $this>
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    /**
     * @return BelongsTo<Kelas, $this>
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * @return BelongsTo<AcademicYearSemester, $this>
     */
    public function academicYearSemester(): BelongsTo
    {
        return $this->belongsTo(AcademicYearSemester::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Total SKS yang sudah disetujui untuk mahasiswa pada satu periode akademik.
     */
    public static function totalSksDisetujui(int $mahasiswaId, int $academicYearSemesterId, ?int $excludingKrsId = null): int
    {
        return static::query()
            ->where('mahasiswa_id', $mahasiswaId)
            ->where('academic_year_semester_id', $academicYearSemesterId)
            ->where('status', 'disetujui')
            ->when($excludingKrsId, fn ($query) => $query->where('id', '!=', $excludingKrsId))
            ->with('kelas.mataKuliah')
            ->get()
            ->sum(fn (Krs $krs) => $krs->kelas?->mataKuliah?->sks ?? 0);
    }

    protected static function booted(): void
    {
        static::creating(function (Krs $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
