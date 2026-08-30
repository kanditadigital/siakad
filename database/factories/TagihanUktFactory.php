<?php

namespace Database\Factories;

use App\Models\AcademicYearSemester;
use App\Models\Mahasiswa;
use App\Models\TagihanUkt;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TagihanUkt>
 */
class TagihanUktFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jumlahTagihan = fake()->randomElement([2500000, 3000000, 3500000, 4000000, 4500000]);
        $status = fake()->randomElement(['belum', 'lunas', 'terlambat']);
        $jumlahBayar = $status === 'lunas' ? $jumlahTagihan : ($status === 'terlambat' ? fake()->randomFloat(2, 0, $jumlahTagihan) : 0);

        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'academic_year_semester_id' => AcademicYearSemester::factory(),
            'jumlah_tagihan' => $jumlahTagihan,
            'jumlah_bayar' => $jumlahBayar,
            'jatuh_tempo' => fake()->dateTimeBetween('+1 month', '+3 month'),
            'status' => $status,
            'keterangan' => fake()->optional()->sentence(),
        ];
    }
}
