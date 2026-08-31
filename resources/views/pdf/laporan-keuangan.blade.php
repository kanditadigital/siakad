<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Keuangan</title>
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
            width: 150px;
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
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN KEUANGAN</h1>
        <h2>Sitiddarurrahmah University</h2>
    </div>

    <div class="info-box">
        <div class="info-row">
            <span class="info-label">Total Tagihan:</span>
            <span>Rp {{ number_format($stats['total_tagihan'], 0, ',', '.') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Total Lunas:</span>
            <span>Rp {{ number_format($stats['total_lunas'], 0, ',', '.') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Total Belum Lunas:</span>
            <span>Rp {{ number_format($stats['total_belum_lunas'], 0, ',', '.') }}</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>NIM</th>
                <th>Nama</th>
                <th>Tahun Akademik</th>
                <th>Skema UKT</th>
                <th>Jumlah Tagihan</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($tagihans as $index => $tagihan)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $tagihan->mahasiswa->nim ?? '-' }}</td>
                    <td>{{ $tagihan->mahasiswa->nama ?? '-' }}</td>
                    <td>{{ $tagihan->academicYearSemester->nama_tahun_akademik ?? '-' }} - {{ $tagihan->academicYearSemester->semester ?? '-' }}</td>
                    <td>{{ $tagihan->uktScheme->nama ?? '-' }}</td>
                    <td>Rp {{ number_format($tagihan->jumlah_tagihan, 0, ',', '.') }}</td>
                    <td>{{ ucfirst($tagihan->status) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align: center;">Belum ada data tagihan</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ now()->format('d/m/Y H:i') }}</p>
    </div>
</body>
</html>
