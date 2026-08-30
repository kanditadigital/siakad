<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AllUsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->createDosen();
        $this->createMahasiswa();
        $this->createPimpinan();
        $this->createAdminProdi();
    }

    /**
     * Create dosen users.
     */
    protected function createDosen(): void
    {
        $dosens = [
            [
                'name' => 'Dr. Budi Santoso, M.Kom.',
                'email' => 'budi.santoso@sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::Dosen,
                'nidn' => '1234567890',
                'nim' => null,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Siti Rahmawati, S.Kom., M.T.',
                'email' => 'siti.rahmawati@sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::Dosen,
                'nidn' => '1234567891',
                'nim' => null,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ahmad Hidayat, S.Si., M.Si.',
                'email' => 'ahmad.hidayat@sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::Dosen,
                'nidn' => '1234567892',
                'nim' => null,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $ftiId = DB::table('program_studi')->where('kode_prodi', 'FTI-001')->value('id');

        foreach ($dosens as $dosen) {
            $exists = DB::table('users')
                ->where('email', $dosen['email'])
                ->exists();

            if (! $exists) {
                $userId = DB::table('users')->insertGetId($dosen);

                // Check if dosen profile already exists
                $dosenExists = DB::table('dosen')
                    ->where('nidn', $dosen['nidn'])
                    ->exists();

                if (! $dosenExists) {
                    // Create dosen profile
                    DB::table('dosen')->insert([
                        'user_id' => $userId,
                        'program_studi_id' => $ftiId,
                        'nidn' => $dosen['nidn'],
                        'nama' => $dosen['name'],
                        'email' => $dosen['email'],
                        'no_telepon' => '081234567890',
                        'jenis_kelamin' => 'L',
                        'pangkat_golongan' => 'Lektor Kepala',
                        'pendidikan_terakhir' => 'S3',
                        'alamat' => 'Jl. Pendidikan No. 1, Subulussalam',
                        'status' => 'aktif',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    /**
     * Create mahasiswa users.
     */
    protected function createMahasiswa(): void
    {
        $mahasiswas = [
            [
                'name' => 'Rina Wulandari',
                'email' => 'rina.wulandari@student.sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::Mahasiswa,
                'nim' => 'MHS-2024-001',
                'nidn' => null,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Deni Kurniawan',
                'email' => 'deni.kurniawan@student.sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::Mahasiswa,
                'nim' => 'MHS-2024-002',
                'nidn' => null,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Maya Sari',
                'email' => 'maya.sari@student.sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::Mahasiswa,
                'nim' => 'MHS-2024-003',
                'nidn' => null,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $ftiId = DB::table('program_studi')->where('kode_prodi', 'FTI-001')->value('id');

        foreach ($mahasiswas as $mahasiswa) {
            $exists = DB::table('users')
                ->where('email', $mahasiswa['email'])
                ->exists();

            if (! $exists) {
                $userId = DB::table('users')->insertGetId($mahasiswa);

                // Create mahasiswa profile
                DB::table('mahasiswa')->insert([
                    'user_id' => $userId,
                    'program_studi_id' => $ftiId,
                    'nim' => $mahasiswa['nim'],
                    'nama' => $mahasiswa['name'],
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

    /**
     * Create pimpinan users.
     */
    protected function createPimpinan(): void
    {
        $pimpinans = [
            [
                'name' => 'Prof. Dr. H. Muhammad Rizal, S.E., M.Si.',
                'email' => 'rektor@sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::Pimpinan,
                'nim' => null,
                'nidn' => '1234567899',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dr. Hj. Fatimah Azzahra, M.Pd.',
                'email' => 'warek1@sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::Pimpinan,
                'nim' => null,
                'nidn' => '1234567898',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($pimpinans as $pimpinan) {
            $exists = DB::table('users')
                ->where('email', $pimpinan['email'])
                ->exists();

            if (! $exists) {
                DB::table('users')->insert($pimpinan);
            }
        }
    }

    /**
     * Create admin prodi users.
     */
    protected function createAdminProdi(): void
    {
        $adminProdis = [
            [
                'name' => 'Ahmad Fauzi, S.Kom., M.T.',
                'email' => 'ahmad.fauzi@sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::AdminProdi,
                'nim' => null,
                'nidn' => null,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
                'program_studi_kode' => 'FTI-001',
            ],
            [
                'name' => 'Dewi Lestari, S.Ds., M.Ds.',
                'email' => 'dewi.lestari@sitiddarurrahmah.ac.id',
                'password' => Hash::make('password123'),
                'role' => UserRole::AdminProdi,
                'nim' => null,
                'nidn' => null,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
                'program_studi_kode' => 'DKV-001',
            ],
        ];

        foreach ($adminProdis as $adminProdi) {
            $exists = DB::table('users')
                ->where('email', $adminProdi['email'])
                ->exists();

            if (! $exists) {
                $programStudiId = DB::table('program_studi')
                    ->where('kode_prodi', $adminProdi['program_studi_kode'])
                    ->value('id');

                unset($adminProdi['program_studi_kode']);

                DB::table('users')->insert(array_merge($adminProdi, [
                    'program_studi_id' => $programStudiId,
                ]));
            }
        }
    }
}
