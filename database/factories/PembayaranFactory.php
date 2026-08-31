<?php

namespace Database\Factories;

use App\Models\Mahasiswa;
use App\Models\Pembayaran;
use App\Models\TagihanUkt;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pembayaran>
 */
class PembayaranFactory extends Factory
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
            'tagihan_ukt_id' => TagihanUkt::factory(),
            'jumlah_bayar' => fake()->randomFloat(2, 100000, 5000000),
            'tanggal_bayar' => fake()->dateTimeBetween('-1 month', 'now'),
            'metode_pembayaran' => fake()->randomElement(['transfer', 'cash']),
            'bukti_pembayaran' => null,
            'status' => 'pending',
            'keterangan' => null,
        ];
    }
}
