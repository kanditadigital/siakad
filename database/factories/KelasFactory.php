<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\MataKuliah;
use App\Models\Ruang;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kelas>
 */
class KelasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_kelas' => strtoupper(fake()->unique()->bothify('??####')),
            'nama_kelas' => 'Kelas '.fake()->randomLetter().fake()->numberBetween(1, 5),
            'mata_kuliah_id' => MataKuliah::factory(),
            'dosen_id' => Dosen::factory(),
            'ruang_id' => Ruang::factory(),
            'kapasitas' => fake()->randomElement([20, 25, 30, 35, 40]),
            'semester' => (string) fake()->numberBetween(1, 8),
            'tahun_akademik' => '2025/2026',
            'status' => fake()->randomElement(['Aktif', 'Tidak Aktif', 'Selesai']),
        ];
    }
}
