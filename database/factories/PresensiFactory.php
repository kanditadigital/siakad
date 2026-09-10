<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\Mahasiswa;
use App\Models\Presensi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Presensi>
 */
class PresensiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kelas_id' => Kelas::factory(),
            'mahasiswa_id' => Mahasiswa::factory(),
            'tanggal' => fake()->dateTimeBetween('-2 months', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['hadir', 'izin', 'sakit', 'alpha']),
            'keterangan' => null,
        ];
    }
}
