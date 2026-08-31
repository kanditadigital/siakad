<?php

namespace App\Exports;

use App\Models\Nilai;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class NilaiExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * @return Collection<int, Nilai>
     */
    public function collection(): Collection
    {
        return Nilai::with(['krs.mahasiswa', 'krs.kelas.mataKuliah', 'krs.academicYearSemester'])
            ->get();
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return ['NIM', 'Nama Mahasiswa', 'Kode Kelas', 'Mata Kuliah', 'Nilai', 'Grade', 'Status', 'Keterangan'];
    }

    /**
     * @return array<int, mixed>
     */
    public function map($nilai): array
    {
        return [
            $nilai->krs->mahasiswa->nim ?? '-',
            $nilai->krs->mahasiswa->nama ?? '-',
            $nilai->krs->kelas->kode_kelas ?? '-',
            $nilai->krs->kelas->mataKuliah->nama_mk ?? '-',
            $nilai->nilai,
            $nilai->grade,
            $nilai->status,
            $nilai->keterangan,
        ];
    }
}
