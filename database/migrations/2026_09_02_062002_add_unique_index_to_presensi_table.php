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
        Schema::table('presensi', function (Blueprint $table) {
            // One presensi record per mahasiswa per kelas per day — the
            // one-click attendance grid relies on this to upsert instead of
            // ever creating a duplicate for the same session.
            $table->unique(['kelas_id', 'mahasiswa_id', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presensi', function (Blueprint $table) {
            $table->dropUnique(['kelas_id', 'mahasiswa_id', 'tanggal']);
        });
    }
};
