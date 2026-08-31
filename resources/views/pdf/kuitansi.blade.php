<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kuitansi Pembayaran</title>
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
            margin-bottom: 6px;
        }
        .info-label {
            width: 160px;
            font-weight: bold;
        }
        .amount-box {
            background: #166534;
            color: white;
            border-radius: 5px;
            padding: 15px;
            text-align: center;
            margin-bottom: 20px;
        }
        .amount-box .label {
            font-size: 11px;
            opacity: 0.85;
        }
        .amount-box .amount {
            font-size: 22px;
            font-weight: bold;
            margin-top: 4px;
        }
        .footer {
            margin-top: 40px;
            text-align: right;
            font-size: 11px;
        }
        .signature {
            margin-top: 60px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>KUITANSI PEMBAYARAN</h1>
        <h2>STIT Daarurrahmah Sepadan</h2>
        <p>No. Kuitansi: {{ $pembayaran->uuid }}</p>
    </div>

    <div class="info-box">
        <div class="info-row">
            <span class="info-label">NIM</span>
            <span>: {{ $pembayaran->mahasiswa->nim }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Nama</span>
            <span>: {{ $pembayaran->mahasiswa->nama }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Periode</span>
            <span>: {{ $pembayaran->tagihanUkt->academicYearSemester->nama_tahun_akademik ?? '-' }} - {{ $pembayaran->tagihanUkt->academicYearSemester->semester ?? '-' }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Tanggal Bayar</span>
            <span>: {{ \Illuminate\Support\Carbon::parse($pembayaran->tanggal_bayar)->translatedFormat('d F Y') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Metode Pembayaran</span>
            <span>: {{ ucfirst($pembayaran->metode_pembayaran) }}</span>
        </div>
    </div>

    <div class="amount-box">
        <div class="label">JUMLAH DIBAYAR</div>
        <div class="amount">Rp {{ number_format((float) $pembayaran->jumlah_bayar, 0, ',', '.') }}</div>
    </div>

    <div class="footer">
        <p>Subulussalam, {{ now()->translatedFormat('d F Y') }}</p>
        <div class="signature">
            <p>Bagian Keuangan</p>
        </div>
    </div>
</body>
</html>
