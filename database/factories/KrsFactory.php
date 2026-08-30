<?php

namespace Database\Factories;

use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Krs>
 */
class KrsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'kelas_id' => Kelas::factory(),
            'academic_year_semester_id' => AcademicYearSemester::factory(),
            'status' => fake()->randomElement(['pending', 'disetujui', 'ditolak']),
        ];
    }
}
