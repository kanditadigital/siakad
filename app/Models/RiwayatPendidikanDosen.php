<?php

namespace App\Models;

use Database\Factories\RiwayatPendidikanDosenFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable(['dosen_id', 'jenjang', 'nama_institusi', 'fakultas_prodi'])]
class RiwayatPendidikanDosen extends Model
{
    /** @use HasFactory<RiwayatPendidikanDosenFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'riwayat_pendidikan_dosen';

    /**
     * @return BelongsTo<Dosen, $this>
     */
    public function dosen(): BelongsTo
    {
        return $this->belongsTo(Dosen::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (RiwayatPendidikanDosen $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
