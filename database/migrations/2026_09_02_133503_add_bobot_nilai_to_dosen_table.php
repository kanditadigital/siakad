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
        Schema::table('dosen', function (Blueprint $table) {
            $table->unsignedTinyInteger('bobot_tugas')->default(20);
            $table->unsignedTinyInteger('bobot_uts')->default(25);
            $table->unsignedTinyInteger('bobot_uas')->default(30);
            $table->unsignedTinyInteger('bobot_partisipasi')->default(10);
            $table->unsignedTinyInteger('bobot_kehadiran')->default(15);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->dropColumn(['bobot_tugas', 'bobot_uts', 'bobot_uas', 'bobot_partisipasi', 'bobot_kehadiran']);
        });
    }
};
