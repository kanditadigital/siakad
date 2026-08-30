<?php

namespace Database\Factories;

use App\Models\UktScheme;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UktScheme>
 */
class UktSchemeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $nomor = fake()->unique()->numberBetween(1, 10);

        return [
            'nama' => 'UKT '.$nomor,
            'jumlah' => $nomor * 1000000,
            'keterangan' => fake()->optional()->sentence(),
            'aktif' => true,
        ];
    }
}
