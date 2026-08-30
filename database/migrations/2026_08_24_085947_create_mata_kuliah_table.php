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
        Schema::create('mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->string('kode_mk')->unique();
            $table->string('nama_mk');
            $table->foreignId('program_studi_id')->constrained('program_studi')->onDelete('cascade');
            $table->enum('jenis', ['Wajib', 'Pilihan']);
            $table->integer('sks');
            $table->integer('semester');
            $table->string('status')->default('aktif'); // Aktif, Tidak Aktif
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mata_kuliah');
    }
};
