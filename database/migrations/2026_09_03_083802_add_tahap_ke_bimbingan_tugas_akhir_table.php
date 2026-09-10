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
        Schema::table('bimbingan_tugas_akhir', function (Blueprint $table) {
            $table->string('tahap_saat_ini')->default('pengajuan_judul');
            $table->timestamp('selesai_pada')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bimbingan_tugas_akhir', function (Blueprint $table) {
            $table->dropColumn(['tahap_saat_ini', 'selesai_pada']);
        });
    }
};
