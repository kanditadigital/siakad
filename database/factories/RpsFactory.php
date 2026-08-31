<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\Rps;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rps>
 */
class RpsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'kelas_id' => Kelas::factory(),
            'file_path' => null,
            'status' => 'belum_upload',
            'catatan' => null,
            'uploaded_at' => null,
        ];
    }
}
