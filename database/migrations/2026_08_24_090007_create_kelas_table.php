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
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kelas')->unique();
            $table->string('nama_kelas');
            $table->foreignId('mata_kuliah_id')->constrained('mata_kuliah')->cascadeOnDelete();
            $table->foreignId('dosen_id')->nullable()->constrained('dosen')->nullOnDelete();
            $table->foreignId('ruang_id')->nullable()->constrained('ruang')->nullOnDelete();
            $table->unsignedInteger('kapasitas');
            $table->enum('semester', ['1', '2', '3', '4', '5', '6', '7', '8']);
            $table->string('tahun_akademik');
            $table->enum('status', ['Aktif', 'Tidak Aktif', 'Selesai']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
