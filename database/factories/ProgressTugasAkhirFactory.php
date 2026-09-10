<?php

namespace Database\Factories;

use App\Models\BimbinganTugasAkhir;
use App\Models\ProgressTugasAkhir;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProgressTugasAkhir>
 */
class ProgressTugasAkhirFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bimbingan_tugas_akhir_id' => BimbinganTugasAkhir::factory(),
            'tahap' => 'pengajuan_judul',
            'tipe' => 'catatan',
            'catatan' => fake()->sentence(),
            'dibuat_oleh_user_id' => null,
        ];
    }
}
