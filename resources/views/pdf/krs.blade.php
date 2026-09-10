<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Kartu Rencana Studi (KRS)</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            margin: 0;
            padding: 20px;
            padding-bottom: 50px;
        }
        .bottom-fixed {
            position: fixed;
            bottom: 35px;
            left: 20px;
            right: 20px;
        }
        .bottom-table {
            width: 100%;
            border: none;
        }
        .bottom-table td {
            border: none;
            padding: 0;
            vertical-align: bottom;
        }
        .qr-code {
            text-align: left;
        }
        .qr-code img {
            width: 70px;
            height: 70px;
        }
        .qr-code p {
            margin: 2px 0 0;
            font-size: 7px;
            color: #666;
            letter-spacing: 0.5px;
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
        .detail-table {
            width: 100%;
            border: none;
            margin-bottom: 20px;
        }
        .detail-table td {
            border: none;
            padding: 3px 8px;
            font-size: 12px;
        }
        .detail-label {
            width: 110px;
            color: #555;
        }
        .detail-colon {
            width: 12px;
        }
        .detail-value {
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
        tfoot td {
            font-weight: bold;
            background: #f0fdf4;
        }
        .text-right {
            text-align: right;
        }
        .footer {
            text-align: right;
            font-size: 10px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .status-approved {
            background: #dcfce7;
            color: #166534;
        }
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        .status-rejected {
            background: #fecaca;
            color: #991b1b;
        }
        .signature-table {
            width: 100%;
            border: none;
            margin-top: 80px;
        }
        .signature-table td {
            width: 50%;
            border: none;
            padding: 0;
            text-align: center;
            vertical-align: top;
        }
        .signature-table p {
            margin: 0;
        }
        .signature-location {
            margin-bottom: 8px;
        }
        .signature-name {
            margin-top: 70px;
            padding-top: 5px;
            display: inline-block;
            min-width: 200px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>KARTU RENCANA STUDI (KRS)</h1>
        <h2>Sitiddarurrahmah University</h2>
    </div>

    <table class="detail-table">
        <tr>
            <td class="detail-label">Nama Mahasiswa</td>
            <td class="detail-colon">:</td>
            <td class="detail-value">{{ $mahasiswa->nama }}</td>
            <td class="detail-label">Tahun Akademik</td>
            <td class="detail-colon">:</td>
            <td class="detail-value">{{ $academicYearSemester->nama_tahun_akademik ?? '-' }}</td>
        </tr>
        <tr>
            <td class="detail-label">NIM</td>
            <td class="detail-colon">:</td>
            <td class="detail-value">{{ $mahasiswa->nim }}</td>
            <td class="detail-label">Semester</td>
            <td class="detail-colon">:</td>
            <td class="detail-value">{{ $academicYearSemester->semester ?? '-' }}</td>
        </tr>
        <tr>
            <td class="detail-label">Program Studi</td>
            <td class="detail-colon">:</td>
            <td class="detail-value">{{ $mahasiswa->programStudi->nama_prodi ?? '-' }}</td>
            <td class="detail-label">Dosen PA</td>
            <td class="detail-colon">:</td>
            <td class="detail-value">{{ $mahasiswa->paDosen->nama ?? '-' }}</td>
        </tr>
        <tr>
            <td class="detail-label">Jenjang</td>
            <td class="detail-colon">:</td>
            <td class="detail-value">{{ $mahasiswa->programStudi->jenis_prodi ?? '-' }}</td>
            <td class="detail-label"></td>
            <td class="detail-colon"></td>
            <td class="detail-value"></td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode MK</th>
                <th>Mata Kuliah</th>
                <th>SKS</th>
                <th>Ruangan</th>
                <th>Waktu</th>
            </tr>
        </thead>
        <tbody>
            @forelse($krss as $index => $krs)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $krs->kelas->mataKuliah->kode_mk ?? '-' }}</td>
                    <td>{{ $krs->kelas->mataKuliah->nama_mk ?? '-' }}</td>
                    <td>{{ $krs->kelas->mataKuliah->sks ?? '-' }}</td>
                    <td>{{ $krs->kelas->ruang->kode_ruang ?? '-' }}</td>
                    <td>
                        @if($krs->kelas->hari)
                            {{ $krs->kelas->hari }}, {{ substr($krs->kelas->jam_mulai ?? '', 0, 5) }} - {{ substr($krs->kelas->jam_selesai ?? '', 0, 5) }}
                        @else
                            -
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">Belum ada data KRS</td>
                </tr>
            @endforelse
        </tbody>
        @if(count($krss) > 0)
            <tfoot>
                <tr>
                    <td colspan="3" class="text-right">Total SKS</td>
                    <td>{{ $krss->sum(fn($krs) => $krs->kelas->mataKuliah->sks ?? 0) }}</td>
                    <td colspan="2"></td>
                </tr>
            </tfoot>
        @endif
    </table>

    <table class="signature-table">
        <tr>
            <td>
                <p  style="margin-bottom:70px; margin-top:17px;">Mahasiswa</p>
                <p class="signature-name">{{ $mahasiswa->nama }}</p>
                <p>NIM: {{ $mahasiswa->nim }}</p>
            </td>
            <td>
                <p class="signature-location">Subulussalam, {{ now()->translatedFormat('d F Y') }}</p>
                <p style="margin-bottom:70px;">Dosen Pembimbing Akademik</p>
                <p class="signature-name">{{ $mahasiswa->paDosen->nama ?? '-' }}</p>
                <p>NIDN: {{ $mahasiswa->paDosen->nidn ?? '-' }}</p>
            </td>
        </tr>
    </table>

    <div class="bottom-fixed">
        <table class="bottom-table">
            <tr>
                <td class="qr-code">
                    @if(isset($qrCode))
                        <img src="data:image/png;base64,{{ $qrCode }}" alt="QR Code Keaslian Dokumen">
                        <p>{{ $printCode }}</p>
                    @endif
                </td>
                <td class="footer">
                    <p>Dicetak pada: {{ now()->format('d/m/Y H:i') }}</p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
