<?php

namespace App\Models;

use Database\Factories\MahasiswaFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $user_id
 * @property int $program_studi_id
 * @property string $nim
 * @property string $nama
 * @property Carbon $tanggal_lahir
 * @property int $semester_saat_ini
 * @property-read User $user
 * @property-read ProgramStudi $programStudi
 * @property-read int|null $batas_semester_normal
 */
#[Appends(['batas_semester_normal'])]
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
    'semester_saat_ini',
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
     * Memoized result of `nilaiTerhitung()`, primed in bulk via
     * `primeNilaiTerhitungUntukBanyak()` for list views, or lazily filled
     * on first access otherwise — so a single request never repeats the
     * same Nilai query across `hitungIpk()`, `totalSksLulus()`, etc.
     *
     * @var Collection<int, Nilai>|null
     */
    private ?Collection $nilaiTerhitungCache = null;

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
     * @return HasMany<Krs, $this>
     */
    public function krs(): HasMany
    {
        return $this->hasMany(Krs::class);
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

    /**
     * @return HasOne<BimbinganTugasAkhir, $this>
     */
    public function bimbinganTugasAkhir(): HasOne
    {
        return $this->hasOne(BimbinganTugasAkhir::class);
    }

    /**
     * @return HasMany<PengajuanJudulTa, $this>
     */
    public function pengajuanJudulTa(): HasMany
    {
        return $this->hasMany(PengajuanJudulTa::class);
    }

    /**
     * Normal maximum semester for this mahasiswa's jenjang (S1 = 8, D3 = 6, …),
     * derived from `program_studi.lama_studi` (years) rather than a second
     * stored number that could drift out of sync.
     *
     * Null when `program_studi_id` was left out of a partial column select
     * (e.g. lightweight picker lists) — the relation can't resolve without it,
     * and this attribute is appended to every Mahasiswa instance regardless of
     * which columns were selected.
     */
    public function getBatasSemesterNormalAttribute(): ?int
    {
        if (! isset($this->attributes['program_studi_id'])) {
            return null;
        }

        return $this->programStudi->lama_studi * 2;
    }

    /**
     * Enrollment year, parsed from the year digits `ProgramStudi::generateNim()`
     * embeds in the NIM — not stored separately, so it can never drift out of
     * sync with the NIM actually issued.
     */
    public function angkatan(): ?int
    {
        if (! isset($this->attributes['program_studi_id']) || ! isset($this->attributes['nim'])) {
            return null;
        }

        $prodi = $this->programStudi;
        $yearSuffix = substr($this->nim, strlen($prodi->nim_prefix), $prodi->nim_year_digits);

        if ($yearSuffix === '' || ! ctype_digit($yearSuffix)) {
            return null;
        }

        $currentYear = (string) now()->year;
        $centuryPrefix = substr($currentYear, 0, strlen($currentYear) - $prodi->nim_year_digits);

        return (int) ($centuryPrefix.$yearSuffix);
    }

    /**
     * Cumulative GPA across every graded mata kuliah the mahasiswa has taken.
     *
     * Only graded entries (nilai not null) count toward both the numerator
     * and denominator, so an ungraded course never dilutes the average.
     */
    public function hitungIpk(): float
    {
        return $this->hitungIpsUntukPeriode($this->nilaiTerhitung());
    }

    /**
     * GPA for one academic period (IPS). Defaults to the most recent period
     * that has any graded nilai — the mahasiswa's last completed semester —
     * which is what `Krs::maxSksUntukIps()` needs when reviewing a new KRS.
     */
    public function hitungIps(?int $academicYearSemesterId = null): float
    {
        $academicYearSemesterId ??= $this->academicYearSemesterTerakhirDenganNilai();

        if ($academicYearSemesterId === null) {
            return 0.0;
        }

        $nilais = $this->nilaiTerhitung()->filter(
            fn (Nilai $n) => $n->krs?->academic_year_semester_id === $academicYearSemesterId
        );

        return $this->hitungIpsUntukPeriode($nilais);
    }

    /**
     * Total SKS from mata kuliah the mahasiswa has actually passed (graded,
     * grade not D/E) — the denominator real academic progress is measured
     * against, as opposed to `batas_semester_normal` which only measures time
     * elapsed.
     */
    public function totalSksLulus(): int
    {
        return (int) $this->nilaiTerhitung()
            ->filter(fn (Nilai $n) => $n->nilai !== null && ! in_array($n->grade, ['D', 'E'], true))
            ->sum(fn (Nilai $n) => $n->krs->kelas->mataKuliah->sks ?? 0);
    }

    /**
     * IPS + running cumulative IPK + SKS per academic period, ordered
     * chronologically — lets a dosen PA see whether a mahasiswa's
     * performance is trending up or down semester over semester.
     *
     * @return Collection<int, array{semester_ke: int, periode: string, ips: float, ipk: float, sks: int}>
     */
    public function perkembanganAkademik(): Collection
    {
        $periods = $this->nilaiTerhitung()
            ->groupBy(fn (Nilai $n) => $n->krs->academic_year_semester_id)
            ->sortBy(fn (Collection $group) => $group->first()->krs->academicYearSemester?->tanggal_mulai)
            ->values();

        $result = collect();
        $cumulativeNilai = 0.0;
        $cumulativeSks = 0;

        foreach ($periods as $index => $group) {
            $ays = $group->first()->krs->academicYearSemester;
            $graded = $group->filter(fn (Nilai $n) => $n->nilai !== null);

            $sksSemester = (int) $group->sum(fn (Nilai $n) => $n->krs->kelas->mataKuliah->sks ?? 0);
            $sksGraded = $graded->sum(fn (Nilai $n) => $n->krs->kelas->mataKuliah->sks ?? 0);
            $totalNilaiSemester = $graded->sum(fn (Nilai $n) => $n->nilai * ($n->krs->kelas->mataKuliah->sks ?? 0));
            $ips = $sksGraded > 0 ? round($totalNilaiSemester / $sksGraded, 2) : 0.0;

            $cumulativeNilai += $totalNilaiSemester;
            $cumulativeSks += $sksGraded;
            $ipk = $cumulativeSks > 0 ? round($cumulativeNilai / $cumulativeSks, 2) : 0.0;

            $result->push([
                'semester_ke' => $index + 1,
                'periode' => trim(($ays->nama_tahun_akademik ?? '-').' '.($ays->semester ?? '')),
                'ips' => $ips,
                'ipk' => $ipk,
                'sks' => $sksSemester,
            ]);
        }

        return $result;
    }

    /**
     * Mata kuliah with a D/E grade — belum lulus and needs to be retaken.
     * Prerequisite gaps are checked per-submission via `Krs::prasyaratTerpenuhi()`
     * instead of listed here, since "prasyarat belum terpenuhi" only means
     * something in the context of a specific KRS being reviewed.
     *
     * @return Collection<int, array{mata_kuliah: MataKuliah, grade: string, nilai: float, periode: string}>
     */
    public function mataKuliahBermasalah(): Collection
    {
        return $this->nilaiTerhitung()
            ->filter(fn (Nilai $n) => in_array($n->grade, ['D', 'E'], true))
            ->map(fn (Nilai $n) => [
                'mata_kuliah' => $n->krs->kelas->mataKuliah,
                'grade' => $n->grade,
                'nilai' => (float) $n->nilai,
                'periode' => trim(($n->krs->academicYearSemester->nama_tahun_akademik ?? '-').' '.($n->krs->academicYearSemester->semester ?? '')),
            ])
            ->values();
    }

    /**
     * Attendance summary for one academic period (defaults to the currently
     * active one) — overall percentage plus a breakdown per kelas, so a
     * dosen PA can spot which specific class a mahasiswa is skipping.
     *
     * @return array<string, mixed>
     */
    public function ringkasanPresensi(?int $academicYearSemesterId = null): array
    {
        $academicYearSemesterId ??= AcademicYearSemester::aktif()->first()?->id;

        if ($academicYearSemesterId === null) {
            return ['persentase_hadir' => null, 'per_kelas' => collect()];
        }

        $kelasIds = Krs::where('mahasiswa_id', $this->id)
            ->where('academic_year_semester_id', $academicYearSemesterId)
            ->where('status', 'disetujui')
            ->pluck('kelas_id');

        $presensis = Presensi::with('kelas.mataKuliah')
            ->where('mahasiswa_id', $this->id)
            ->whereIn('kelas_id', $kelasIds)
            ->get();

        $totalCount = $presensis->count();
        $hadirCount = $presensis->where('status', 'hadir')->count();

        $perKelas = $presensis->groupBy('kelas_id')
            ->map(function (Collection $group) {
                /** @var Presensi $first */
                $first = $group->first();
                $total = $group->count();
                $hadir = $group->where('status', 'hadir')->count();

                return [
                    'mata_kuliah' => $first->kelas?->mataKuliah?->nama_mk,
                    'persentase_hadir' => $total > 0 ? round($hadir / $total * 100, 1) : null,
                    'total_pertemuan' => (int) $total,
                ];
            })
            ->values();

        return [
            'persentase_hadir' => $totalCount > 0 ? round($hadirCount / $totalCount * 100, 1) : null,
            'per_kelas' => $perKelas,
        ];
    }

    /**
     * Every Nilai entry the mahasiswa has, regardless of grade status —
     * the single source other IPK/SKS/transkrip calculations build on, so
     * they can never drift out of sync with each other.
     *
     * @return Collection<int, Nilai>
     */
    public function nilaiTerhitung(): Collection
    {
        return $this->nilaiTerhitungCache ??= Nilai::with(['krs.kelas.mataKuliah', 'krs.academicYearSemester'])
            ->whereHas('krs', fn ($query) => $query->where('mahasiswa_id', $this->id))
            ->get();
    }

    /**
     * Bulk-primes `nilaiTerhitung()` for a whole list of mahasiswa in one
     * query, so `hitungIpk()`/`totalSksLulus()`/etc. called per row (e.g. in
     * a paginated index) don't each re-query Nilai individually.
     *
     * @param  Collection<int, Mahasiswa>  $mahasiswas
     */
    public static function primeNilaiTerhitungUntukBanyak(Collection $mahasiswas): void
    {
        $nilaisByMahasiswaId = Nilai::with(['krs.kelas.mataKuliah', 'krs.academicYearSemester'])
            ->whereHas('krs', fn ($query) => $query->whereIn('mahasiswa_id', $mahasiswas->pluck('id')))
            ->get()
            ->groupBy(fn (Nilai $n) => $n->krs->mahasiswa_id);

        $mahasiswas->each(function (Mahasiswa $mahasiswa) use ($nilaisByMahasiswaId): void {
            $mahasiswa->nilaiTerhitungCache = $nilaisByMahasiswaId->get($mahasiswa->id, collect());
        });
    }

    /**
     * @param  Collection<int, Nilai>  $nilais
     */
    private function hitungIpsUntukPeriode(Collection $nilais): float
    {
        $graded = $nilais->filter(fn (Nilai $n) => $n->nilai !== null);
        $gradedSks = $graded->sum(fn (Nilai $n) => $n->krs->kelas->mataKuliah->sks ?? 0);
        $totalNilai = $graded->sum(fn (Nilai $n) => $n->nilai * ($n->krs->kelas->mataKuliah->sks ?? 0));

        return $gradedSks > 0 ? round($totalNilai / $gradedSks, 2) : 0.0;
    }

    private function academicYearSemesterTerakhirDenganNilai(): ?int
    {
        return Krs::where('mahasiswa_id', $this->id)
            ->whereHas('nilai', fn ($query) => $query->whereNotNull('nilai'))
            ->with('academicYearSemester')
            ->get()
            ->sortByDesc(fn (Krs $krs) => $krs->academicYearSemester?->tanggal_mulai)
            ->first()
            ?->academic_year_semester_id;
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
