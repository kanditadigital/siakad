<?php

namespace App\Models;

use Database\Factories\TagihanUktFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

#[Fillable([
    'mahasiswa_id',
    'academic_year_semester_id',
    'ukt_scheme_id',
    'jumlah_tagihan',
    'jumlah_bayar',
    'jatuh_tempo',
    'status',
    'keterangan',
])]
class TagihanUkt extends Model
{
    /** @use HasFactory<TagihanUktFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'tagihan_ukts';

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'belum',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'jumlah_tagihan' => 'decimal:2',
            'jumlah_bayar' => 'decimal:2',
            'jatuh_tempo' => 'date',
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
     * @return BelongsTo<AcademicYearSemester, $this>
     */
    public function academicYearSemester(): BelongsTo
    {
        return $this->belongsTo(AcademicYearSemester::class);
    }

    /**
     * @return BelongsTo<UktScheme, $this>
     */
    public function uktScheme(): BelongsTo
    {
        return $this->belongsTo(UktScheme::class);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (TagihanUkt $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
