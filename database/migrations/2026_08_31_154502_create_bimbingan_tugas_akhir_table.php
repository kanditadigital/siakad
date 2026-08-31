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
        Schema::create('bimbingan_tugas_akhir', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->string('judul');
            $table->foreignId('pembimbing_1_id')->constrained('dosen')->restrictOnDelete();
            $table->foreignId('pembimbing_2_id')->nullable()->constrained('dosen')->nullOnDelete();
            $table->string('status')->default('aktif'); // aktif, revisi, lainnya
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bimbingan_tugas_akhir');
    }
};
