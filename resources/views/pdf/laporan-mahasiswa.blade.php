<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Mahasiswa</title>
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
        <h1>LAPORAN MAHASISWA</h1>
        <h2>Sitiddarurrahmah University</h2>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>NIM</th>
                <th>Nama</th>
                <th>Program Studi</th>
                <th>Jenis Kelamin</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($mahasiswas as $index => $mahasiswa)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $mahasiswa->nim }}</td>
                    <td>{{ $mahasiswa->nama }}</td>
                    <td>{{ $mahasiswa->programStudi->nama_prodi ?? '-' }}</td>
                    <td>{{ $mahasiswa->jenis_kelamin }}</td>
                    <td>{{ ucfirst($mahasiswa->status) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">Belum ada data mahasiswa</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
