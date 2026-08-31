<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transkrip Nilai</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #166534;
            padding-bottom: 20px;
        }
        .header h1 {
            font-size: 18px;
            color: #166534;
            margin: 0 0 5px 0;
        }
        .header h2 {
            font-size: 14px;
            color: #166534;
            margin: 0 0 10px 0;
        }
        .header p {
            margin: 3px 0;
            color: #666;
        }
        .info-box {
            background: #f0fdf4;
            border: 1px solid #dcfce7;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            margin-bottom: 5px;
        }
        .info-label {
            width: 120px;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #e5e5e5;
            padding: 8px;
            text-align: left;
        }
        th {
            background: #166534;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .grade-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .grade-a { background: #dcfce7; color: #166534; }
        .grade-b { background: #dbeafe; color: #1e40af; }
        .grade-c { background: #fef3c7; color: #92400e; }
        .grade-d { background: #ffedd5; color: #9a3412; }
        .grade-e { background: #fecaca; color: #991b1b; }
        .signature {
            margin-top: 50px;
            text-align: right;
        }
        .signature-line {
            border-top: 1px solid #1a1a1a;
            width: 200px;
            margin-left: auto;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>TRANSKRIP NILAI</h1>
        <h2>Sitiddarurrahmah University</h2>
        <p>NIM: {{ $mahasiswa->nim }}</p>
        <p>Nama: {{ $mahasiswa->nama }}</p>
        <p>Program Studi: {{ $mahasiswa->program_studi->nama_prodi ?? '-' }}</p>
    </div>

    <div class="info-box">
        <div class="info-row">
            <span class="info-label">Total Mata Kuliah:</span>
            <span>{{ count($nilais) }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Total SKS:</span>
            <span>{{ $stats['total_sks'] }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">IPK:</span>
            <span>{{ $stats['ipk'] }}</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode MK</th>
                <th>Mata Kuliah</th>
                <th>SKS</th>
                <th>Nilai</th>
                <th>Grade</th>
                <th>Semester</th>
                <th>Tahun Akademik</th>
            </tr>
        </thead>
        <tbody>
            @forelse($nilais as $index => $nilai)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $nilai->krs->kelas->mata_kuliah->kode_mk ?? '-' }}</td>
                    <td>{{ $nilai->krs->kelas->mata_kuliah->nama_mk ?? '-' }}</td>
                    <td>{{ $nilai->krs->kelas->mata_kuliah->sks ?? '-' }}</td>
                    <td>{{ $nilai->nilai ?? '-' }}</td>
                    <td>
                        @if($nilai->grade)
                            <span class="grade-badge grade-{{ strtolower($nilai->grade) }}">{{ $nilai->grade }}</span>
                        @else
                            -
                        @endif
                    </td>
                    <td>{{ $nilai->krs->academic_year_semester->semester ?? '-' }}</td>
                    <td>{{ $nilai->krs->academic_year_semester->nama_tahun_akademik ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center;">Belum ada data nilai</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="signature">
        <p>Dicetak pada: {{ now()->format('d/m/Y H:i') }}</p>
        <div class="signature-line">
            <p>Pejabat Berwenang</p>
        </div>
    </div>
</body>
</html>
