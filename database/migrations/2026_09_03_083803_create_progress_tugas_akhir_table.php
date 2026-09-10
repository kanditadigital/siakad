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
        Schema::create('progress_tugas_akhir', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('bimbingan_tugas_akhir_id')->constrained('bimbingan_tugas_akhir')->cascadeOnDelete();
            $table->string('tahap')->nullable();
            $table->string('tipe'); // selesai, revisi, ganti_judul, catatan
            $table->text('catatan')->nullable();
            $table->foreignId('dibuat_oleh_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('progress_tugas_akhir');
    }
};
