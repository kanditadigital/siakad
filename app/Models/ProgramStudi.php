<?php

namespace App\Models;

use Database\Factories\ProgramStudiFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable(['kode_prodi', 'nama_prodi', 'fakultas', 'lama_studi', 'jenis_prodi', 'nim_prefix', 'nim_counter', 'nim_digit_count', 'nim_year_digits'])]
class ProgramStudi extends Model
{
    /** @use HasFactory<ProgramStudiFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'program_studi';

    /**
     * @return HasMany<Mahasiswa, $this>
     */
    public function mahasiswas(): HasMany
    {
        return $this->hasMany(Mahasiswa::class);
    }

    /**
     * @return HasMany<Dosen, $this>
     */
    public function dosens(): HasMany
    {
        return $this->hasMany(Dosen::class);
    }

    /**
     * @return HasMany<MataKuliah, $this>
     */
    public function mataKuliahs(): HasMany
    {
        return $this->hasMany(MataKuliah::class);
    }

    /**
     * Tanggal & bulan berdirinya perguruan tinggi (14 September), tetap sama
     * untuk semua prodi dan disisipkan di awal setiap NIM yang digenerate.
     */
    private const TANGGAL_BERDIRI_PT = '14';

    private const BULAN_BERDIRI_PT = '9';

    /**
     * Segmen tetap {tanggal}{bulan} berdiri PT (3 digit: "149") yang mengawali setiap NIM.
     */
    public static function kodeBerdiriPt(): string
    {
        return self::TANGGAL_BERDIRI_PT.self::BULAN_BERDIRI_PT;
    }

    /**
     * Generate NIM baru berdasarkan konfigurasi program studi.
     *
     * Format: {tanggal+bulan berdiri PT}{tahun masuk}{kode prodi}{nomor urut}
     * Contoh: 1492601001 (149=tanggal+bulan berdiri PT, tahun masuk=26, kode prodi=01, nomor urut=001)
     */
    public function generateNim(): string
    {
        $this->increment('nim_counter');

        $counter = $this->nim_counter;
        $paddedCounter = str_pad((string) $counter, $this->nim_digit_count, '0', STR_PAD_LEFT);

        $year = (int) date('Y');
        $yearSuffix = substr((string) $year, -$this->nim_year_digits);

        return self::kodeBerdiriPt().$yearSuffix.$this->nim_prefix.$paddedCounter;
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (ProgramStudi $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
