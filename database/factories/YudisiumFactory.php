<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\Yudisium;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Yudisium>
 */
class YudisiumFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ipk = fake()->randomFloat(2, 2.5, 4.0);
        $predikat = match (true) {
            $ipk >= 3.8 => 'Cum Laude',
            $ipk >= 3.5 => 'Sangat Memuaskan',
            $ipk >= 3.0 => 'Memuaskan',
            default => 'Cukup',
        };

        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'tanggal_yudisium' => fake()->dateTimeBetween('-1 year', 'now'),
            'ipk' => $ipk,
            'total_sks' => fake()->randomElement([140, 144, 148, 152]),
            'judul_skripsi' => fake()->sentence(8),
            'status' => fake()->randomElement(['lulus', 'tidak lulus']),
            'predikat' => $predikat,
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
