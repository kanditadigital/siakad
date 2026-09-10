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
        Schema::table('mahasiswa', function (Blueprint $table) {
            // Tracked explicitly (not derived from KRS history) so it survives
            // data migration and mahasiswa who skip a term without a formal cuti
            // status. Advanced in bulk via the "Naikkan Semester" action, not
            // recalculated automatically. 1 = baru masuk.
            $table->unsignedSmallInteger('semester_saat_ini')->default(1)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->dropColumn('semester_saat_ini');
        });
    }
};
