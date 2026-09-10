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
        Schema::table('mata_kuliah', function (Blueprint $table) {
            // Single prerequisite per mata kuliah — enough for the common
            // "must pass MK X before taking MK Y" case without building a
            // full prerequisite graph.
            $table->foreignId('prasyarat_mata_kuliah_id')
                ->nullable()
                ->after('semester')
                ->constrained('mata_kuliah')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mata_kuliah', function (Blueprint $table) {
            $table->dropConstrainedForeignId('prasyarat_mata_kuliah_id');
        });
    }
};
