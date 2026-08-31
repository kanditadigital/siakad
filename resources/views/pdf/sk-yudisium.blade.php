<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SK Yudisium</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            margin: 0;
            padding: 30px;
            line-height: 1.6;
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
            margin: 0 0 5px 0;
        }
        .title {
            text-align: center;
            margin: 30px 0;
        }
        .title h3 {
            font-size: 15px;
            text-decoration: underline;
            margin: 0 0 4px 0;
        }
        .title p {
            margin: 0;
        }
        .considerations {
            margin: 20px 0;
        }
        .considerations p {
            margin: 4px 0;
        }
        table.info {
            width: 100%;
            margin: 20px 0;
        }
        table.info td {
            padding: 3px 0;
            vertical-align: top;
        }
        table.info td.label {
            width: 180px;
        }
        .signature {
            margin-top: 60px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>SURAT KEPUTUSAN</h1>
        <h2>STIT Daarurrahmah Sepadan</h2>
    </div>

    <div class="title">
        <h3>Nomor: SK-YUD/{{ $yudisium->mahasiswa->nim }}/{{ $yudisium->tanggal_yudisium->format('Y') }}</h3>
        <p>TENTANG PENETAPAN KELULUSAN MAHASISWA</p>
    </div>

    <div class="considerations">
        <p><strong>Menimbang:</strong> bahwa mahasiswa yang tersebut namanya di bawah ini telah dinyatakan lulus dalam sidang yudisium dan memenuhi seluruh persyaratan akademik yang ditetapkan.</p>
    </div>

    <p><strong>MEMUTUSKAN:</strong></p>

    <table class="info">
        <tr>
            <td class="label">NIM</td>
            <td>: {{ $yudisium->mahasiswa->nim }}</td>
        </tr>
        <tr>
            <td class="label">Nama</td>
            <td>: {{ $yudisium->mahasiswa->nama }}</td>
        </tr>
        <tr>
            <td class="label">Program Studi</td>
            <td>: {{ $yudisium->mahasiswa->programStudi->nama_prodi ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">IPK</td>
            <td>: {{ number_format((float) $yudisium->ipk, 2) }}</td>
        </tr>
        <tr>
            <td class="label">Predikat</td>
            <td>: {{ $yudisium->predikat ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Tanggal Yudisium</td>
            <td>: {{ $yudisium->tanggal_yudisium->translatedFormat('d F Y') }}</td>
        </tr>
    </table>

    <p>dinyatakan <strong>LULUS</strong> dan berhak menyandang gelar akademik sesuai program studi yang bersangkutan.</p>

    <div class="signature">
        <p>Subulussalam, {{ now()->translatedFormat('d F Y') }}</p>
        <p style="margin-top: 60px;">Ketua STIT Daarurrahmah Sepadan</p>
    </div>
</body>
</html>
