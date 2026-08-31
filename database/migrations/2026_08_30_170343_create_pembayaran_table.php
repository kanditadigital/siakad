<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa');
            $table->foreignId('tagihan_ukt_id')->constrained('tagihan_ukts');
            $table->decimal('jumlah_bayar', 12, 2);
            $table->date('tanggal_bayar');
            $table->string('metode_pembayaran'); // transfer, cash, etc
            $table->string('bukti_pembayaran')->nullable();
            $table->string('status')->default('pending'); // pending, verified, rejected
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
