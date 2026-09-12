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
     * Kode tetap yang disisipkan di antara tahun masuk dan nomor urut pada NIM.
     * Tidak merepresentasikan apa pun yang bervariasi per prodi atau mahasiswa.
     */
    private const KODE_TETAP = '01';

    /**
     * Generate NIM baru berdasarkan konfigurasi program studi.
     *
     * Format: {kode wajib prodi}{tahun}{kode tetap "01"}{nomor urut}
     * Contoh: 1492501001 (kode wajib=149, tahun=2025, tetap=01, nomor urut=001)
     */
    public function generateNim(): string
    {
        $this->increment('nim_counter');

        $counter = $this->nim_counter;
        $paddedCounter = str_pad((string) $counter, $this->nim_digit_count, '0', STR_PAD_LEFT);

        $year = (int) date('Y');
        $yearSuffix = substr((string) $year, -$this->nim_year_digits);

        return $this->nim_prefix.$yearSuffix.self::KODE_TETAP.$paddedCounter;
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
