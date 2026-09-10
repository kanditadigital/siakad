<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\RiwayatPendidikanDosen;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RiwayatPendidikanDosen>
 */
class RiwayatPendidikanDosenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'dosen_id' => Dosen::factory(),
            'jenjang' => fake()->randomElement(['S1', 'S2', 'S3']),
            'nama_institusi' => fake()->company().' University',
            'fakultas_prodi' => fake()->word(),
        ];
    }
}
