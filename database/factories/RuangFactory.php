<?php

namespace Database\Factories;

use App\Models\Ruang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ruang>
 */
class RuangFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_ruang' => strtoupper(fake()->unique()->bothify('??###')),
            'nama_ruang' => 'Ruang '.fake()->randomLetter().fake()->numberBetween(1, 10),
            'kapasitas' => fake()->randomElement([20, 30, 40, 50, 60]),
            'lantai' => (string) fake()->numberBetween(1, 5),
            'gedung' => fake()->randomElement(['Gedung A', 'Gedung B', 'Gedung C']),
        ];
    }
}
