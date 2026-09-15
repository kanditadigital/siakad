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
            $table->string('nim_prefix')->comment('Kode prodi 2 digit untuk NIM, disisipkan setelah tahun masuk')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_studi', function (Blueprint $table) {
            $table->string('nim_prefix')->comment('Prefix kode NIM, contoh: TI, DKV')->change();
        });
    }
};
