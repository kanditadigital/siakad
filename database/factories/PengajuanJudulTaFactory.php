<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\PengajuanJudulTa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PengajuanJudulTa>
 */
class PengajuanJudulTaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'judul' => fake()->sentence(6),
            'status' => 'pending',
            'catatan' => null,
        ];
    }
}
