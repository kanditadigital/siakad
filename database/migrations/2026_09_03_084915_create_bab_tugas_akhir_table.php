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
        Schema::create('bab_tugas_akhir', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('bimbingan_tugas_akhir_id')->constrained('bimbingan_tugas_akhir')->cascadeOnDelete();
            $table->string('nama');
            $table->unsignedInteger('urutan')->default(0);
            $table->boolean('selesai')->default(false);
            $table->timestamp('selesai_pada')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bab_tugas_akhir');
    }
};
