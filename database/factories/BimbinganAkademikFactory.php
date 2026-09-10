<?php

namespace Database\Factories;

use App\Models\BimbinganAkademik;
use App\Models\Dosen;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BimbinganAkademik>
 */
class BimbinganAkademikFactory extends Factory
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
            'mahasiswa_id' => Mahasiswa::factory(),
            'krs_id' => null,
            'topik' => 'Konsultasi Akademik',
            'catatan' => fake()->sentence(),
        ];
    }
}
