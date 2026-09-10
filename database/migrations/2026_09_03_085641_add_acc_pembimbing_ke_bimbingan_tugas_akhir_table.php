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
            $table->timestamp('acc_pembimbing_1_pada')->nullable();
            $table->timestamp('acc_pembimbing_2_pada')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bimbingan_tugas_akhir', function (Blueprint $table) {
            $table->dropColumn(['acc_pembimbing_1_pada', 'acc_pembimbing_2_pada']);
        });
    }
};
