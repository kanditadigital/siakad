<?php

namespace App\Models;

use Database\Factories\PresensiFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presensi extends Model
{
    /** @use HasFactory<PresensiFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'presensi';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'kelas_id',
        'mahasiswa_id',
        'tanggal',
        'status',
        'keterangan',
    ];

    /**
     * @return BelongsTo<Kelas, $this>
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * @return BelongsTo<Mahasiswa, $this>
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }
}
