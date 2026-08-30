<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin already exists
        if (User::where('email', 'admin@sitiddarurrahmah.ac.id')->exists() ||
            DB::table('users')->where('email', 'admin@sitiddarurrahmah.ac.id')->exists()) {
            return;
        }

        // Create admin user directly in users table
        DB::table('users')->insert([
            'name' => 'Administrator SIAKAD',
            'email' => 'admin@sitiddarurrahmah.ac.id',
            'role' => 'admin',
            'email_verified_at' => now(),
            'password' => bcrypt('password123'),
            'nim' => 'ADM-2026-001',
            'nidn' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create academic year semesters
        $this->createAcademicYearSemesters();

        // Create master data
        $this->createMasterData();
    }

    /**
     * Create default academic year semesters.
     */
    protected function createAcademicYearSemesters(): void
    {
        // Check if data already exists
        if (DB::table('academic_year_semesters')->exists()) {
            return;
        }

        $now = now();

        DB::table('academic_year_semesters')->insert([
            [
                'nama_tahun_akademik' => '2025/2026',
                'semester' => 'Genap',
                'tanggal_mulai' => $now->copy()->subMonth(3)->startOfDay()->toDateString(),
                'tanggal_selesai' => $now->copy()->addMonth(3)->endOfDay()->toDateString(),
                'status' => 'aktif',
                'periode_krs' => '2025/2026 Genap',
                'periode_input_nilai' => '2025/2026 Genap',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama_tahun_akademik' => '2026/2027',
                'semester' => 'Ganjil',
                'tanggal_mulai' => $now->copy()->addMonth(1)->startOfDay()->toDateString(),
                'tanggal_selesai' => $now->copy()->addMonth(6)->endOfDay()->toDateString(),
                'status' => 'aktif',
                'periode_krs' => '2026/2027 Ganjil',
                'periode_input_nilai' => '2026/2027 Ganjil',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Create master data default entries.
     */
    protected function createMasterData(): void
    {
        // Create default program studi
        $programStudiExists = DB::table('program_studi')->where('kode_prodi', 'FTI-001')->exists();
        if (! $programStudiExists) {
            DB::table('program_studi')->insert([
                'kode_prodi' => 'FTI-001',
                'nama_prodi' => 'Teknik Informatika',
                'fakultas' => 'Fakultas Teknik',
                'lama_studi' => 4,
                'jenis_prodi' => 'S1',
                'nim_prefix' => 'TIF',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $programStudiExistsDKV = DB::table('program_studi')->where('kode_prodi', 'DKV-001')->exists();
        if (! $programStudiExistsDKV) {
            DB::table('program_studi')->insert([
                'kode_prodi' => 'DKV-001',
                'nama_prodi' => 'Desain Komunikasi Visual',
                'fakultas' => 'Fakultas Seni dan Desain',
                'lama_studi' => 4,
                'jenis_prodi' => 'S1',
                'nim_prefix' => 'DKV',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Get program studi IDs
        $ftiId = DB::table('program_studi')->where('kode_prodi', 'FTI-001')->value('id');
        $dkvId = DB::table('program_studi')->where('kode_prodi', 'DKV-001')->value('id');

        // Create default mata kuliah
        $mkFTIExists = DB::table('mata_kuliah')->where('kode_mk', 'MK-101')->exists();
        if (! $mkFTIExists && $ftiId) {
            DB::table('mata_kuliah')->insert([
                'kode_mk' => 'MK-101',
                'nama_mk' => 'Dasar Pemrograman',
                'program_studi_id' => $ftiId,
                'jenis' => 'Wajib',
                'sks' => 3,
                'semester' => 1,
                'status' => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $mkFTI2Exists = DB::table('mata_kuliah')->where('kode_mk', 'MK-102')->exists();
        if (! $mkFTI2Exists && $ftiId) {
            DB::table('mata_kuliah')->insert([
                'kode_mk' => 'MK-102',
                'nama_mk' => 'Pemrograman Berorientasi Objek',
                'program_studi_id' => $ftiId,
                'jenis' => 'Wajib',
                'sks' => 3,
                'semester' => 2,
                'status' => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $mkDKVExists = DB::table('mata_kuliah')->where('kode_mk', 'MK-201')->exists();
        if (! $mkDKVExists && $dkvId) {
            DB::table('mata_kuliah')->insert([
                'kode_mk' => 'MK-201',
                'nama_mk' => 'Desain Grafis Dasar',
                'program_studi_id' => $dkvId,
                'jenis' => 'Wajib',
                'sks' => 3,
                'semester' => 1,
                'status' => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Create default dosen
        $adminUserId = DB::table('users')->where('email', 'admin@sitiddarurrahmah.ac.id')->value('id');
        $dosenExists = DB::table('dosen')->where('nidn', '1234567890')->exists();
        if (! $dosenExists) {
            DB::table('dosen')->insert([
                'user_id' => $adminUserId,
                'program_studi_id' => $ftiId,
                'nidn' => '1234567890',
                'nama' => 'Dr. Budi Santoso, M.Kom.',
                'email' => 'budi.santoso@sitiddarurrahmah.ac.id',
                'no_telepon' => '081234567890',
                'jenis_kelamin' => 'L',
                'pangkat_golongan' => 'Guru Besar',
                'pendidikan_terakhir' => 'S3',
                'alamat' => 'Jl. Pendidikan No. 1, Subulussalam',
                'status' => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Create default mahasiswa (berdasarkan admin user)
        $adminUserId = DB::table('users')->where('email', 'admin@sitiddarurrahmah.ac.id')->value('id');
        $mahasiswaExists = DB::table('mahasiswa')->where('nim', 'MHS-2023-001')->exists();
        if (! $mahasiswaExists && $adminUserId) {
            DB::table('mahasiswa')->insert([
                'user_id' => $adminUserId,
                'program_studi_id' => $ftiId,
                'nim' => 'MHS-2023-001',
                'nama' => 'Mahasiswa Kontoh',
                'tempat_lahir' => 'Subulussalam',
                'tanggal_lahir' => now()->subYears(20)->toDateString(),
                'jenis_kelamin' => 'L',
                'alamat' => 'Jl. Kampus No. 1, Subulussalam',
                'kode_domisili' => 'Subulussalam',
                'status' => 'aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
