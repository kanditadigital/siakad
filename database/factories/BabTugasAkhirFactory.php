<?php

namespace Database\Factories;

use App\Models\BabTugasAkhir;
use App\Models\BimbinganTugasAkhir;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BabTugasAkhir>
 */
class BabTugasAkhirFactory extends Factory
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
            'nama' => 'Bab '.fake()->numberBetween(1, 5),
            'urutan' => fake()->numberBetween(0, 4),
            'selesai' => false,
            'selesai_pada' => null,
        ];
    }
}
