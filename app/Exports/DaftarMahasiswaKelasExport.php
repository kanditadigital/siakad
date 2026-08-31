<?php

namespace App\Exports;

use App\Models\Krs;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DaftarMahasiswaKelasExport implements FromCollection, WithHeadings, WithMapping
{
    public function __construct(private readonly int $kelasId) {}

    /**
     * @return Collection<int, Krs>
     */
    public function collection(): Collection
    {
        return Krs::with(['mahasiswa.programStudi'])
            ->where('kelas_id', $this->kelasId)
            ->where('status', 'disetujui')
            ->get();
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return ['NIM', 'Nama', 'Program Studi'];
    }

    /**
     * @return array<int, mixed>
     */
    public function map($krs): array
    {
        return [
            $krs->mahasiswa->nim ?? '-',
            $krs->mahasiswa->nama ?? '-',
            $krs->mahasiswa->programStudi->nama_prodi ?? '-',
        ];
    }
}
