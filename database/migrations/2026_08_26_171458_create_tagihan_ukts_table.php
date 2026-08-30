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
        Schema::create('tagihan_ukts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->foreignId('academic_year_semester_id')->constrained()->cascadeOnDelete();
            $table->decimal('jumlah_tagihan', 12, 2);
            $table->decimal('jumlah_bayar', 12, 2)->default(0);
            $table->date('jatuh_tempo');
            $table->string('status')->default('belum'); // belum, lunas, terlambat
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->unique(['mahasiswa_id', 'academic_year_semester_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagihan_ukts');
    }
};
