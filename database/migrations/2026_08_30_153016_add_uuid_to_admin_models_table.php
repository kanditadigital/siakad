<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tables = [
            'academic_year_semesters',
            'dosen',
            'kelas',
            'krs',
            'mahasiswa',
            'mata_kuliah',
            'nilai',
            'program_studi',
            'ruang',
            'tagihan_ukts',
            'tendik',
            'ukt_schemes',
            'yudisiums',
        ];

        foreach ($tables as $table) {
            if (! Schema::hasColumn($table, 'uuid')) {
                Schema::table($table, function (Blueprint $table): void {
                    $table->uuid('uuid')->nullable()->after('id');
                });
            }

            DB::table($table)->orderBy('id')->each(function ($row) use ($table): void {
                DB::table($table)->where('id', $row->id)->update(['uuid' => (string) Str::uuid7()]);
            });

            if (! DB::select("SHOW INDEX FROM {$table} WHERE Key_name = ?", ["{$table}_uuid_unique"])) {
                DB::statement("ALTER TABLE {$table} ADD UNIQUE {$table}_uuid_unique(uuid)");
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'academic_year_semesters',
            'dosen',
            'kelas',
            'krs',
            'mahasiswa',
            'mata_kuliah',
            'nilai',
            'program_studi',
            'ruang',
            'tagihan_ukts',
            'tendik',
            'ukt_schemes',
            'yudisiums',
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table): void {
                $table->dropColumn('uuid');
            });
        }
    }
};
