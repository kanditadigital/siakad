<?php

namespace Database\Factories;

use App\Models\ProgramStudi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProgramStudi>
 */
class ProgramStudiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_prodi' => fake()->unique()->lexify('???'),
            'nama_prodi' => fake()->words(3, true),
            'fakultas' => fake()->words(2, true),
            'lama_studi' => 4,
            'jenis_prodi' => 'Sarjana',
            'nim_prefix' => fake()->unique()->lexify('???'),
            'nim_counter' => 0,
            'nim_digit_count' => 3,
            'nim_year_digits' => 2,
        ];
    }
}
