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
            $table->renameColumn('nidn', 'niy');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('nidn', 'niy');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->renameColumn('niy', 'nidn');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('niy', 'nidn');
        });
    }
};
