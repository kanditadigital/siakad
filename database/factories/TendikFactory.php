<?php

namespace Database\Factories;

use App\Models\Tendik;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tendik>
 */
class TendikFactory extends Factory
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
            'nip' => fake()->unique()->numerify('##################'),
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'no_telepon' => fake()->numerify('08##########'),
            'jenis_kelamin' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'jabatan' => fake()->randomElement(['Staf Administrasi', 'Staf Keuangan', 'Staf Akademik', 'Operator Komputer', 'Pustakawan', 'Teknisi']),
            'unit_kerja' => fake()->randomElement(['BAAK', 'Keuangan', 'Perpustakaan', 'TU', 'Humas', 'IT']),
            'pendidikan_terakhir' => fake()->randomElement(['S1', 'S2', 'SMA', 'SMK']),
            'alamat' => fake()->address(),
            'status' => 'aktif',
        ];
    }
}
