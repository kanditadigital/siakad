<?php

namespace Database\Factories;

use App\Models\Krs;
use App\Models\Nilai;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Nilai>
 */
class NilaiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nilai = fake()->randomFloat(2, 0, 100);
        $grade = match (true) {
            $nilai >= 85 => 'A',
            $nilai >= 75 => 'B',
            $nilai >= 65 => 'C',
            $nilai >= 50 => 'D',
            default => 'E',
        };

        return [
            'krs_id' => Krs::factory(),
            'nilai' => $nilai,
            'grade' => $grade,
            'status' => fake()->randomElement(['belum', 'tercatat']),
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
