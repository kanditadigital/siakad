<?php

namespace Database\Factories;

use App\Models\AcademicYearSemester;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AcademicYearSemester>
 */
class AcademicYearSemesterFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tahunMulai = fake()->numberBetween(2023, 2026);
        $tanggalMulai = fake()->dateTimeBetween("{$tahunMulai}-01-01", "{$tahunMulai}-06-01");

        return [
            'nama_tahun_akademik' => "{$tahunMulai}/".($tahunMulai + 1),
            'semester' => fake()->randomElement(['Ganjil', 'Genap', 'Summer']),
            'tanggal_mulai' => $tanggalMulai,
            'tanggal_selesai' => (clone $tanggalMulai)->modify('+6 months'),
            'status' => 'nonaktif',
            'periode_krs' => null,
            'periode_input_nilai' => null,
        ];
    }
}
