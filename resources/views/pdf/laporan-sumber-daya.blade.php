<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Sumber Daya</title>
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
        h3.section {
            color: #166534;
            font-size: 13px;
            margin: 24px 0 8px 0;
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
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN SUMBER DAYA</h1>
        <h2>STIT Daarurrahmah Sepadan</h2>
    </div>

    <h3 class="section">Dosen ({{ count($dosens) }})</h3>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>NIDN</th>
                <th>Nama</th>
                <th>Program Studi</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($dosens as $index => $dosen)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $dosen->nidn }}</td>
                    <td>{{ $dosen->nama }}</td>
                    <td>{{ $dosen->programStudi->nama_prodi ?? '-' }}</td>
                    <td>{{ ucfirst($dosen->status) }}</td>
                </tr>
            @empty
                <tr><td colspan="5" style="text-align: center;">Belum ada data dosen</td></tr>
            @endforelse
        </tbody>
    </table>

    <h3 class="section">Tenaga Kependidikan ({{ count($tendiks) }})</h3>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>NIP</th>
                <th>Nama</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($tendiks as $index => $tendik)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $tendik->nip }}</td>
                    <td>{{ $tendik->nama }}</td>
                    <td>{{ ucfirst($tendik->status) }}</td>
                </tr>
            @empty
                <tr><td colspan="4" style="text-align: center;">Belum ada data tenaga kependidikan</td></tr>
            @endforelse
        </tbody>
    </table>

    <h3 class="section">Ruang ({{ count($ruangs) }})</h3>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode Ruang</th>
                <th>Nama Ruang</th>
                <th>Gedung</th>
                <th>Lantai</th>
                <th>Kapasitas</th>
            </tr>
        </thead>
        <tbody>
            @forelse($ruangs as $index => $ruang)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $ruang->kode_ruang }}</td>
                    <td>{{ $ruang->nama_ruang }}</td>
                    <td>{{ $ruang->gedung }}</td>
                    <td>{{ $ruang->lantai }}</td>
                    <td>{{ $ruang->kapasitas }}</td>
                </tr>
            @empty
                <tr><td colspan="6" style="text-align: center;">Belum ada data ruang</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
