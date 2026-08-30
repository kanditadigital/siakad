<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('kelas') && Schema::hasColumn('kelas', 'doseng_id')) {
            Schema::table('kelas', function (Blueprint $table) {
                $table->renameColumn('doseng_id', 'dosen_id');
            });
        }

        if (Schema::hasTable('kelas') && Schema::hasColumn('kelas', 'skapasitas')) {
            Schema::table('kelas', function (Blueprint $table) {
                $table->renameColumn('skapasitas', 'kapasitas');
            });
        }

        if (Schema::hasTable('mahasiswa') && Schema::hasColumn('mahasiswa', 'kod_domisili')) {
            Schema::table('mahasiswa', function (Blueprint $table) {
                $table->renameColumn('kod_domisili', 'kode_domisili');
            });
        }

        $this->replaceStringProdiWithForeignKey('mahasiswa', 'prodi');
        $this->replaceStringProdiWithForeignKey('dosen', 'program_studi');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Forward-only schema repair for existing local databases.
    }

    private function replaceStringProdiWithForeignKey(string $table, string $legacyColumn): void
    {
        if (! Schema::hasTable($table) || Schema::hasColumn($table, 'program_studi_id') || ! Schema::hasColumn($table, $legacyColumn)) {
            return;
        }

        Schema::table($table, function (Blueprint $blueprint) {
            $blueprint->foreignId('program_studi_id')
                ->nullable()
                ->constrained('program_studi')
                ->restrictOnDelete();
        });

        foreach (DB::table($table)->orderBy('id')->get() as $row) {
            $programStudiId = DB::table('program_studi')
                ->where('nama_prodi', $row->{$legacyColumn})
                ->value('id');

            DB::table($table)->where('id', $row->id)->update([
                'program_studi_id' => $programStudiId,
            ]);
        }

        $drop = [$legacyColumn];

        if (Schema::hasColumn($table, 'fakultas')) {
            $drop[] = 'fakultas';
        }

        Schema::table($table, function (Blueprint $blueprint) use ($drop): void {
            $blueprint->dropColumn($drop);
        });
    }
};
