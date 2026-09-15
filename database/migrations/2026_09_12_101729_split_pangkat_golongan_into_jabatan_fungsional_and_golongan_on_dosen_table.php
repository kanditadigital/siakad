<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Functional-rank values (jabatan fungsional akademik) — apply to every
     * dosen regardless of civil-servant status. Anything else stored in the
     * old `pangkat_golongan` column was a PNS golongan string.
     *
     * @var list<string>
     */
    private const JABATAN_FUNGSIONAL = ['Tenaga Pengajar', 'Asisten Ahli', 'Lektor', 'Lektor Kepala', 'Guru Besar'];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->string('jabatan_fungsional')->nullable()->after('jenis_kelamin');
            $table->string('golongan')->nullable()->after('jabatan_fungsional');
        });

        // Not a private university's dosen have a PNS golongan (III/a etc.) —
        // the old single field conflated the two concepts, so route each
        // existing value to whichever new column it actually describes.
        DB::table('dosen')->whereIn('pangkat_golongan', self::JABATAN_FUNGSIONAL)
            ->update(['jabatan_fungsional' => DB::raw('pangkat_golongan')]);

        DB::table('dosen')->whereNotNull('pangkat_golongan')
            ->whereNotIn('pangkat_golongan', self::JABATAN_FUNGSIONAL)
            ->update(['golongan' => DB::raw('pangkat_golongan')]);

        Schema::table('dosen', function (Blueprint $table) {
            $table->dropColumn('pangkat_golongan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->string('pangkat_golongan')->nullable()->after('jenis_kelamin');
        });

        DB::table('dosen')->update(['pangkat_golongan' => DB::raw('COALESCE(golongan, jabatan_fungsional)')]);

        Schema::table('dosen', function (Blueprint $table) {
            $table->dropColumn(['jabatan_fungsional', 'golongan']);
        });
    }
};
