<?php

namespace App\Imports;

use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Nilai;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class NilaiImport implements ToCollection, WithHeadingRow
{
    /**
     * Rows that could not be matched to an approved KRS, keyed by row number (1-indexed, excluding header).
     *
     * @var array<int, string>
     */
    public array $errors = [];

    public int $imported = 0;

    public function collection(Collection $rows): void
    {
        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // account for header row + 1-indexing

            $nim = (string) ($row['nim'] ?? '');
            $kodeKelas = (string) ($row['kode_kelas'] ?? '');

            $mahasiswa = Mahasiswa::where('nim', $nim)->first();
            $kelas = Kelas::where('kode_kelas', $kodeKelas)->first();

            if (! $mahasiswa || ! $kelas) {
                $this->errors[$rowNumber] = "NIM [{$nim}] atau kode kelas [{$kodeKelas}] tidak ditemukan";

                continue;
            }

            $krs = Krs::where('mahasiswa_id', $mahasiswa->id)
                ->where('kelas_id', $kelas->id)
                ->where('status', 'disetujui')
                ->first();

            if (! $krs) {
                $this->errors[$rowNumber] = "Tidak ada KRS disetujui untuk NIM [{$nim}] di kelas [{$kodeKelas}]";

                continue;
            }

            Nilai::updateOrCreate(
                ['krs_id' => $krs->id],
                [
                    'nilai' => $row['nilai'] !== null && $row['nilai'] !== '' ? (float) $row['nilai'] : null,
                    'grade' => $row['grade'] ?: null,
                    'status' => $row['status'] ?: 'belum',
                    'keterangan' => $row['keterangan'] ?? null,
                ]
            );

            $this->imported++;
        }
    }
}
