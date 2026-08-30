<?php

namespace Database\Factories;

use App\Models\Dosen;
use App\Models\ProgramStudi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dosen>
 */
class DosenFactory extends Factory
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
            'nidn' => fake()->unique()->numerify('##########'),
            'nuptk' => fake()->unique()->numerify('##############'),
            'nama' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'no_telepon' => fake()->numerify('08##########'),
            'jenis_kelamin' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'pangkat_golongan' => fake()->randomElement(['Penata Muda III/a', 'Penata Muda Tk.I III/b', 'Penata III/c', 'Pembina IV/a', 'Pembina Tk.I IV/b']),
            'pendidikan_terakhir' => fake()->randomElement(['S2', 'S3']),
            'alamat' => fake()->address(),
            'status' => 'aktif',
        ];
    }
}
