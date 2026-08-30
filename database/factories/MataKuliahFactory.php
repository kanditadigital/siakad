<?php

namespace Database\Factories;

use App\Models\MataKuliah;
use App\Models\ProgramStudi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MataKuliah>
 */
class MataKuliahFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kode_mk' => fake()->unique()->numerify('MK####'),
            'nama_mk' => fake()->words(3, true),
            'program_studi_id' => ProgramStudi::factory(),
            'jenis' => fake()->randomElement(['Wajib', 'Pilihan']),
            'sks' => fake()->randomElement([1, 2, 3, 4]),
            'semester' => fake()->numberBetween(1, 8),
            'status' => 'aktif',
        ];
    }
}
