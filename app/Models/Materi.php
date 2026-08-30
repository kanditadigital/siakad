<?php

namespace App\Models;

use Database\Factories\MateriFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Materi extends Model
{
    /** @use HasFactory<MateriFactory> */
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'materi';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'kelas_id',
        'judul',
        'deskripsi',
        'file_path',
    ];

    /**
     * @return BelongsTo<Kelas, $this>
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }
}
