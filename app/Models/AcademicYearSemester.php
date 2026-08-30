<?php

namespace App\Models;

use Database\Factories\AcademicYearSemesterFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

#[Fillable([
    'nama_tahun_akademik',
    'semester',
    'tanggal_mulai',
    'tanggal_selesai',
    'status',
    'periode_krs',
    'periode_input_nilai',
])]
class AcademicYearSemester extends Model
{
    /** @use HasFactory<AcademicYearSemesterFactory> */
    use HasFactory;

    /**
     * @var array<string, string>
     */
    protected $attributes = [
        'status' => 'nonaktif',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
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
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    #[Scope]
    protected function byTahun(Builder $query, string $tahun): Builder
    {
        return $query->where('nama_tahun_akademik', $tahun);
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected static function booted(): void
    {
        static::creating(function (AcademicYearSemester $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid7();
            }
        });
    }
}
