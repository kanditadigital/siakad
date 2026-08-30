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
        Schema::create('nilai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('krs_id')->constrained()->cascadeOnDelete();
            $table->decimal('nilai', 5, 2)->nullable();
            $table->string('grade', 2)->nullable(); // A, B, C, D, E
            $table->string('status')->default('belum'); // belum, tercatat
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->unique('krs_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nilai');
    }
};
