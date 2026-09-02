<?php

namespace App\Models;

use Database\Factories\KrsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $uuid
 * @property int $mahasiswa_id
 * @property int $kelas_id
 * @property int $academic_year_semester_id
 * @property string $status
 * @property string|null $catatan
 * @property-read Mahasiswa|null $mahasiswa
 * @property-read Kelas|null $kelas
 * @property-read Nilai|null $nilai
 */
#[Fillable([
    'mahasiswa_id',
    'kelas_id',
    'academic_year_semester_id',
    'status',
    'catatan',
])]
class Krs extends Model
{
    /** @use HasFactory<KrsFactory> */
    use HasFactory;

    /**
     * Fallback batas SKS bila belum diatur di Pengaturan Sistem.
     */
    public const DEFAULT_MAX_SKS = 24;

    public const DEFAULT_MIN_SKS = 12;

    /**
     * Batas maksimal SKS yang boleh diambil mahasiswa dalam satu periode akademik.
     */
    public static function maxSks(): int
    {
        return (int) Setting::get('krs.sks_maks', self::DEFAULT_MAX_SKS);
    }

    /**
     * Batas minimal SKS yang wajib diambil mahasiswa saat mengajukan KRS.
     */
    public static function minSks(): int
    {
        return (int) Setting::get('krs.sks_min', self::DEFAULT_MIN_SKS);
    }

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

    /**
     * @return HasOne<Nilai, $this>
     */
    public function nilai(): HasOne
    {
        return $this->hasOne(Nilai::class);
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
            ->sum(fn (Krs $krs) => $krs->kelas?->mataKuliah->sks ?? 0);
    }

    /**
     * Whether taking $kelasBaru would clash on day/time with a kelas the
     * mahasiswa already has approved in the same academic period.
     *
     * Returns false (no clash detected) when $kelasBaru has no schedule set
     * yet — an unscheduled kelas can't be checked, and PA review shouldn't
     * block on data the admin hasn't entered.
     */
    public static function adaBentrokJadwal(int $mahasiswaId, int $academicYearSemesterId, Kelas $kelasBaru): bool
    {
        if (! $kelasBaru->hari || ! $kelasBaru->jam_mulai || ! $kelasBaru->jam_selesai) {
            return false;
        }

        return static::where('mahasiswa_id', $mahasiswaId)
            ->where('academic_year_semester_id', $academicYearSemesterId)
            ->where('status', 'disetujui')
            ->whereHas('kelas', function ($query) use ($kelasBaru): void {
                $query->where('id', '!=', $kelasBaru->id)
                    ->where('hari', $kelasBaru->hari)
                    ->where('jam_mulai', '<', $kelasBaru->jam_selesai)
                    ->where('jam_selesai', '>', $kelasBaru->jam_mulai);
            })
            ->exists();
    }

    /**
     * Whether the mahasiswa has already passed $mataKuliah's prerequisite
     * (grade recorded and not D/E). True when the mata kuliah has no
     * prerequisite set.
     */
    public static function prasyaratTerpenuhi(int $mahasiswaId, MataKuliah $mataKuliah): bool
    {
        if ($mataKuliah->prasyarat_mata_kuliah_id === null) {
            return true;
        }

        return static::where('mahasiswa_id', $mahasiswaId)
            ->whereHas('kelas', fn ($query) => $query->where('mata_kuliah_id', $mataKuliah->prasyarat_mata_kuliah_id))
            ->whereHas('nilai', fn ($query) => $query->whereNotNull('nilai')->whereNotIn('grade', ['D', 'E']))
            ->exists();
    }

    /**
     * Maximum SKS a mahasiswa may take this period based on their previous
     * semester's IPS — a stricter, IPS-aware ceiling on top of the flat
     * `maxSks()` setting. $ips is null when there is no prior graded
     * semester yet (e.g. a new mahasiswa), in which case the flat setting
     * applies instead.
     */
    public static function maxSksUntukIps(?float $ips): int
    {
        return match (true) {
            $ips === null => self::maxSks(),
            $ips >= 3.00 => 24,
            $ips >= 2.50 => 21,
            $ips >= 2.00 => 18,
            default => 15,
        };
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
