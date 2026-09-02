<?php

namespace App\Models;

use App\Concerns\InteractsWithUploads;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property string|null $bukti_pembayaran
 * @property-read string|null $bukti_pembayaran_url
 */
#[Appends(['bukti_pembayaran_url'])]
class Pembayaran extends Model
{
    use HasFactory, InteractsWithUploads;

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

    /**
     * Expiring URL for the uploaded proof of payment.
     */
    public function getBuktiPembayaranUrlAttribute(): ?string
    {
        return static::uploadUrl($this->bukti_pembayaran);
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
