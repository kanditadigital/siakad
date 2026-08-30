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
        Schema::create('yudisiums', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->date('tanggal_yudisium');
            $table->decimal('ipk', 3, 2);
            $table->integer('total_sks');
            $table->string('judul_skripsi')->nullable();
            $table->string('status'); // lulus, tidak lulus
            $table->string('predikat')->nullable(); // cum laude, sangat memuaskan, memuaskan
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->unique('mahasiswa_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('yudisiums');
    }
};
