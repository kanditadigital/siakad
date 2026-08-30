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
        Schema::table('dosen', function (Blueprint $table) {
            if (! Schema::hasColumn('dosen', 'nuptk')) {
                $table->string('nuptk')->nullable()->unique()->after('nidn');
            }
        });

        if (Schema::hasColumn('dosen', 'nuptk') && ! DB::select('SHOW INDEX FROM dosen WHERE Key_name = ?', ['dosen_nuptk_unique'])) {
            DB::statement('UPDATE dosen SET nuptk = NULL WHERE nuptk = ""');
            DB::statement('ALTER TABLE dosen MODIFY nuptk VARCHAR(255) NULL');
            DB::statement('ALTER TABLE dosen ADD UNIQUE dosen_nuptk_unique(nuptk)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->dropColumn('nuptk');
        });
    }
};
