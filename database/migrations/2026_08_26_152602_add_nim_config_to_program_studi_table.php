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
        Schema::table('program_studi', function (Blueprint $table) {
            $table->string('nim_prefix')->after('jenis_prodi')->comment('Prefix kode NIM, contoh: TI, DKV');
            $table->unsignedBigInteger('nim_counter')->after('nim_prefix')->default(0)->comment('Counter terakhir untuk NIM');
            $table->unsignedTinyInteger('nim_digit_count')->after('nim_counter')->default(3)->comment('Jumlah digit angka urut NIM');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_studi', function (Blueprint $table) {
            $table->dropColumn(['nim_prefix', 'nim_counter', 'nim_digit_count']);
        });
    }
};
