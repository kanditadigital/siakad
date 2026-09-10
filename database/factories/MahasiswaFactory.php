<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mahasiswa>
 */
class MahasiswaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'program_studi_id' => ProgramStudi::factory(),
            'nim' => fake()->unique()->numerify('##########'),
            'no_ktp' => fake()->optional()->numerify('##################'),
            'nama' => fake()->name(),
            'tempat_lahir' => fake()->city(),
            'tanggal_lahir' => fake()->dateTimeBetween('-25 years', '-17 years'),
            'jenis_kelamin' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'email_orang_tua' => fake()->optional()->safeEmail(),
            'no_hp_orang_tua' => fake()->optional()->numerify('08##########'),
            'alamat' => fake()->address(),
            'kode_domisili' => fake()->numerify('#####'),
            'status' => 'aktif',
            'semester_saat_ini' => 1,
        ];
    }
}
