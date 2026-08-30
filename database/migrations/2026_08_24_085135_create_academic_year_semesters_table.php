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
        Schema::create('academic_year_semesters', function (Blueprint $table) {
            $table->id();
            $table->string('nama_tahun_akademik'); // e.g., "2025/2026"
            $table->enum('semester', ['Ganjil', 'Genap', 'Summer']);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->enum('status', ['aktif', 'nonaktif', 'arsip'])->default('nonaktif');
            $table->string('periode_krs')->nullable(); // e.g., "2025/2026 Genap"
            $table->string('periode_input_nilai')->nullable(); // e.g., "2025/2026 Genap"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_year_semesters');
    }
};
