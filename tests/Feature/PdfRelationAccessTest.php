<?php

use App\Models\AcademicYearSemester;
use App\Models\Dosen;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\MataKuliah;
use App\Models\Nilai;
use App\Models\ProgramStudi;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

test('krs pdf shows kode mk, nama mk, sks, ruangan, waktu, and dosen pa signature block', function () {
    $paDosen = Dosen::factory()->create(['nama' => 'Dr. Ahmad Fauzi', 'nidn' => '1122334455']);
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => $paDosen->id]);
    $mahasiswa->load('paDosen');
    $mk = MataKuliah::factory()->create(['kode_mk' => 'MK-999', 'nama_mk' => 'Kalkulus Lanjut', 'sks' => 4]);
    $kelas = Kelas::factory()->create([
        'mata_kuliah_id' => $mk->id,
        'hari' => 'Senin',
        'jam_mulai' => '07:00',
        'jam_selesai' => '08:30',
    ]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id, 'status' => 'disetujui']);
    $krs->load(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester']);

    $html = view('pdf.krs', [
        'mahasiswa' => $mahasiswa,
        'krss' => collect([$krs]),
        'totalSks' => 4,
    ])->render();

    expect($html)->toContain('MK-999');
    expect($html)->toContain('Kalkulus Lanjut');
    expect($html)->toContain('>4<');
    expect($html)->toContain('Senin, 07:00 - 08:30');
    expect($html)->toContain($kelas->ruang->kode_ruang);
    expect($html)->toContain('Dr. Ahmad Fauzi');
    expect($html)->toContain('NIDN: 1122334455');
    expect($html)->toContain('Subulussalam, '.now()->translatedFormat('d F Y'));
    expect($html)->toContain('Total SKS');
    expect($html)->not->toContain('<th>Semester</th>');
    expect($html)->not->toContain('<th>Dosen</th>');
    expect($html)->not->toContain('<th>Status</th>');
});

test('krs pdf shows an authenticity qr code with its print code when provided', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $mahasiswa->load('programStudi', 'paDosen');
    $printCode = 'A1B2C3D4E5';
    $qr = new QrCode(
        data: "KRS|{$mahasiswa->nim}|{$printCode}",
        errorCorrectionLevel: ErrorCorrectionLevel::Low,
        size: 120,
        margin: 0,
    );
    $qrCodeImage = base64_encode((new PngWriter)->write($qr)->getString());

    $html = view('pdf.krs', [
        'mahasiswa' => $mahasiswa,
        'krss' => collect(),
        'totalSks' => 0,
        'printCode' => $printCode,
        'qrCode' => $qrCodeImage,
    ])->render();

    expect($html)->toContain('data:image/png;base64,');
    expect($html)->toContain($printCode);
});

test('krs pdf renders without a qr code when none is provided', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $mahasiswa->load('programStudi', 'paDosen');

    $html = view('pdf.krs', [
        'mahasiswa' => $mahasiswa,
        'krss' => collect(),
        'totalSks' => 0,
    ])->render();

    expect($html)->not->toContain('data:image/png;base64,');
});

test('krs pdf shows mahasiswa detail block with prodi, jenjang, tahun akademik, semester, and dosen pa', function () {
    $programStudi = ProgramStudi::factory()->create(['nama_prodi' => 'Pendidikan Agama Islam', 'jenis_prodi' => 'S1']);
    $paDosen = Dosen::factory()->create(['nama' => 'Dr. Ahmad Fauzi', 'nidn' => '1122334455']);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id, 'pa_dosen_id' => $paDosen->id]);
    $mahasiswa->load('programStudi', 'paDosen');
    $ays = AcademicYearSemester::factory()->create(['nama_tahun_akademik' => '2025/2026', 'semester' => 'Ganjil']);
    $mk = MataKuliah::factory()->create();
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id, 'academic_year_semester_id' => $ays->id]);
    $krs->load(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester']);

    $html = view('pdf.krs', [
        'mahasiswa' => $mahasiswa,
        'krss' => collect([$krs]),
        'totalSks' => 0,
        'academicYearSemester' => $ays,
    ])->render();

    expect($html)->toContain('Pendidikan Agama Islam');
    expect($html)->toContain('S1');
    expect($html)->toContain('2025/2026');
    expect($html)->toContain('Ganjil');
    expect($html)->toContain('Dr. Ahmad Fauzi');
    expect($html)->toContain($mahasiswa->nim);
});

test('krs pdf detail block falls back to dashes when academic year semester is not provided', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $mahasiswa->load('programStudi', 'paDosen');

    $html = view('pdf.krs', [
        'mahasiswa' => $mahasiswa,
        'krss' => collect(),
        'totalSks' => 0,
    ])->render();

    expect($html)->toContain('Belum ada data KRS');
});

test('krs pdf shows a total sks row summing all listed mata kuliah', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $mkOne = MataKuliah::factory()->create(['sks' => 3]);
    $mkTwo = MataKuliah::factory()->create(['sks' => 2]);
    $kelasOne = Kelas::factory()->create(['mata_kuliah_id' => $mkOne->id]);
    $kelasTwo = Kelas::factory()->create(['mata_kuliah_id' => $mkTwo->id]);
    $krsOne = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelasOne->id]);
    $krsTwo = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelasTwo->id]);
    $krss = Krs::with(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester'])
        ->whereIn('id', [$krsOne->id, $krsTwo->id])
        ->get();

    $html = view('pdf.krs', [
        'mahasiswa' => $mahasiswa,
        'krss' => $krss,
        'totalSks' => 5,
    ])->render();

    expect($html)->toContain('Total SKS');
    expect($html)->toContain('>5<');
});

test('krs pdf does not render a total sks row when there is no data', function () {
    $mahasiswa = Mahasiswa::factory()->create();

    $html = view('pdf.krs', [
        'mahasiswa' => $mahasiswa,
        'krss' => collect(),
        'totalSks' => 0,
    ])->render();

    expect($html)->not->toContain('<tfoot>');
    expect($html)->toContain('Belum ada data KRS');
});

test('krs pdf shows a dash for dosen pa signature when mahasiswa has none assigned', function () {
    $mahasiswa = Mahasiswa::factory()->create(['pa_dosen_id' => null]);
    $mahasiswa->load('paDosen');
    $mk = MataKuliah::factory()->create();
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id]);
    $krs->load(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester']);

    $html = view('pdf.krs', [
        'mahasiswa' => $mahasiswa,
        'krss' => collect([$krs]),
        'totalSks' => 0,
    ])->render();

    expect($html)->toContain('Dosen Pembimbing Akademik');
    expect($html)->toContain('NIDN: -');
});

test('khs pdf shows kode mk, nama mk, and sks correctly', function () {
    $mahasiswa = Mahasiswa::factory()->create();
    $mk = MataKuliah::factory()->create(['kode_mk' => 'MK-777', 'nama_mk' => 'Fisika Dasar', 'sks' => 3]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id]);
    $nilai = Nilai::factory()->create(['krs_id' => $krs->id]);
    $nilai->load(['krs.kelas.mataKuliah', 'krs.academicYearSemester']);

    $html = view('pdf.khs', [
        'mahasiswa' => $mahasiswa,
        'nilais' => collect([$nilai]),
        'stats' => ['total_sks' => 3, 'ipk' => 0],
    ])->render();

    expect($html)->toContain('MK-777');
    expect($html)->toContain('Fisika Dasar');
});

test('transkrip nilai pdf shows program studi, kode mk, nama mk, and sks correctly', function () {
    $programStudi = ProgramStudi::factory()->create(['nama_prodi' => 'Teknik Elektro']);
    $mahasiswa = Mahasiswa::factory()->create(['program_studi_id' => $programStudi->id]);
    $mk = MataKuliah::factory()->create(['kode_mk' => 'MK-555', 'nama_mk' => 'Rangkaian Listrik', 'sks' => 2]);
    $kelas = Kelas::factory()->create(['mata_kuliah_id' => $mk->id]);
    $krs = Krs::factory()->create(['mahasiswa_id' => $mahasiswa->id, 'kelas_id' => $kelas->id]);
    $nilai = Nilai::factory()->create(['krs_id' => $krs->id]);
    $nilai->load(['krs.kelas.mataKuliah', 'krs.academicYearSemester']);
    $mahasiswa->load('programStudi');

    $html = view('pdf.transkrip-nilai', [
        'mahasiswa' => $mahasiswa,
        'nilais' => collect([$nilai]),
        'stats' => ['total_sks' => 2, 'ipk' => 0],
    ])->render();

    expect($html)->toContain('Teknik Elektro');
    expect($html)->toContain('MK-555');
    expect($html)->toContain('Rangkaian Listrik');
});
