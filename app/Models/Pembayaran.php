<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Pembayaran extends Model
{
    use HasFactory;

    protected $table = 'pembayaran';

    protected $fillable = [
        'uuid',
        'mahasiswa_id',
        'tagihan_ukt_id',
        'jumlah_bayar',
        'tanggal_bayar',
        'metode_pembayaran',
        'bukti_pembayaran',
        'status',
        'keterangan',
    ];

    protected static function booted(): void
    {
        static::creating(function (Pembayaran $model): void {
            if (empty($model->uuid)) {
                $model->uuid = Str::uuid7();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    public function tagihanUkt(): BelongsTo
    {
        return $this->belongsTo(TagihanUkt::class, 'tagihan_ukt_id');
    }
}
