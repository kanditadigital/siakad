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
        Schema::create('dosen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('program_studi_id')->constrained('program_studi')->restrictOnDelete();
            $table->string('nidn')->unique();
            $table->string('nama');
            $table->string('email');
            $table->string('no_telepon');
            $table->string('jenis_kelamin');
            $table->string('pangkat_golongan');
            $table->string('pendidikan_terakhir');
            $table->string('alamat');
            $table->string('status')->default('aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dosen');
    }
};
