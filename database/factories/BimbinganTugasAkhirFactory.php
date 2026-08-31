<?php

namespace Database\Factories;

use App\Models\BimbinganTugasAkhir;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BimbinganTugasAkhir>
 */
class BimbinganTugasAkhirFactory extends Factory
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
            'pembimbing_1_id' => Dosen::factory(),
            'pembimbing_2_id' => null,
            'status' => fake()->randomElement(['aktif', 'revisi', 'lainnya']),
            'catatan' => fake()->optional()->sentence(),
        ];
    }
}
