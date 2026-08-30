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
        Schema::table('tagihan_ukts', function (Blueprint $table) {
            $table->foreignId('ukt_scheme_id')->nullable()->after('academic_year_semester_id')->constrained()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tagihan_ukts', function (Blueprint $table) {
            $table->dropForeign(['ukt_scheme_id']);
            $table->dropColumn('ukt_scheme_id');
        });
    }
};
