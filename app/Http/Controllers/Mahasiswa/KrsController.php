<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\AcademicYearSemester;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Mahasiswa;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class KrsController extends Controller
{
    /**
     * Display KRS mahasiswa.
     */
    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa;

        $krss = Krs::with(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester'])
            ->where('mahasiswa_id', $mahasiswa->id)
            ->when(
                $request->filled('academic_year_semester_id'),
                fn ($q) => $q->where('academic_year_semester_id', $request->input('academic_year_semester_id'))
            )
            ->latest()
            ->get();

        $academicYearSemesters = AcademicYearSemester::whereIn(
            'id',
            Krs::where('mahasiswa_id', $mahasiswa->id)->select('academic_year_semester_id')
        )
            ->orderByDesc('nama_tahun_akademik')
            ->orderBy('semester')
            ->get();

        return Inertia::render('mahasiswa/krs', [
            'krss' => $krss,
            'mahasiswa' => $mahasiswa,
            'academicYearSemesters' => $academicYearSemesters,
            'filters' => $request->only(['academic_year_semester_id']),
        ]);
    }

    /**
     * Show the form for picking mata kuliah to submit as a new KRS.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa;
        $academicYearSemester = AcademicYearSemester::aktif()->first();

        if (! $academicYearSemester) {
            return redirect()->route('mahasiswa.krs')
                ->with('error', 'Belum ada periode akademik aktif, pengajuan KRS belum bisa dilakukan.');
        }

        if (! Setting::get('krs.dibuka', true)) {
            return redirect()->route('mahasiswa.krs')
                ->with('error', 'Periode pengisian KRS sedang ditutup.');
        }

        $takenKelasIds = Krs::where('mahasiswa_id', $mahasiswa->id)
            ->where('academic_year_semester_id', $academicYearSemester->id)
            ->pluck('kelas_id');

        $kelases = Kelas::with(['mataKuliah', 'dosen', 'ruang'])
            ->where('status', 'Aktif')
            ->whereHas('mataKuliah', fn ($q) => $q->where('program_studi_id', $mahasiswa->program_studi_id))
            ->whereNotIn('id', $takenKelasIds)
            ->orderBy('nama_kelas')
            ->get();

        return Inertia::render('mahasiswa/krs/create', [
            'kelases' => $kelases,
            'academicYearSemester' => $academicYearSemester,
            'existingSks' => $this->submittedSks($mahasiswa, $academicYearSemester->id),
            'minSks' => Krs::minSks(),
            'maxSks' => Krs::maxSks(),
        ]);
    }

    /**
     * Submit the selected kelas as a new KRS batch (status: pending).
     */
    public function store(Request $request): RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa;
        $academicYearSemester = AcademicYearSemester::aktif()->first();

        abort_unless($academicYearSemester, 422, 'Belum ada periode akademik aktif.');
        abort_unless(Setting::get('krs.dibuka', true), 422, 'Periode pengisian KRS sedang ditutup.');

        $validated = $request->validate([
            'kelas_ids' => ['required', 'array', 'min:1'],
            'kelas_ids.*' => [
                'integer',
                Rule::exists('kelas', 'id')->where('status', 'Aktif'),
            ],
        ]);

        $kelases = Kelas::with('mataKuliah')
            ->whereIn('id', $validated['kelas_ids'])
            ->whereHas('mataKuliah', fn ($q) => $q->where('program_studi_id', $mahasiswa->program_studi_id))
            ->get();

        if ($kelases->count() !== count($validated['kelas_ids'])) {
            return back()->withErrors([
                'kelas_ids' => 'Salah satu kelas yang dipilih tidak tersedia untuk program studi Anda.',
            ]);
        }

        $alreadyTaken = Krs::where('mahasiswa_id', $mahasiswa->id)
            ->where('academic_year_semester_id', $academicYearSemester->id)
            ->whereIn('kelas_id', $validated['kelas_ids'])
            ->exists();

        if ($alreadyTaken) {
            return back()->withErrors([
                'kelas_ids' => 'Salah satu kelas yang dipilih sudah pernah diajukan.',
            ]);
        }

        $newSks = $kelases->sum(fn (Kelas $k) => $k->mataKuliah->sks ?? 0);
        $totalSks = $this->submittedSks($mahasiswa, $academicYearSemester->id) + $newSks;

        if ($totalSks > Krs::maxSks()) {
            return back()->withErrors([
                'kelas_ids' => "Total SKS akan menjadi {$totalSks}, melebihi batas maksimal ".Krs::maxSks().' SKS per semester.',
            ]);
        }

        if ($totalSks < Krs::minSks()) {
            return back()->withErrors([
                'kelas_ids' => "Total SKS ({$totalSks}) belum memenuhi batas minimal ".Krs::minSks().' SKS per semester.',
            ]);
        }

        DB::transaction(function () use ($kelases, $mahasiswa, $academicYearSemester): void {
            foreach ($kelases as $kelas) {
                Krs::create([
                    'mahasiswa_id' => $mahasiswa->id,
                    'kelas_id' => $kelas->id,
                    'academic_year_semester_id' => $academicYearSemester->id,
                    'status' => 'pending',
                ]);
            }
        });

        return redirect()->route('mahasiswa.krs')
            ->with('success', 'KRS berhasil diajukan, menunggu persetujuan admin.');
    }

    /**
     * Preview KRS as PDF, opened inline so the mahasiswa can review before
     * saving — the browser's own PDF viewer offers the actual download.
     */
    public function exportPdf(Request $request)
    {
        $mahasiswa = $request->user()->mahasiswa;
        $mahasiswa->load('programStudi', 'paDosen');

        $krss = Krs::with(['kelas.mataKuliah', 'kelas.dosen', 'kelas.ruang', 'academicYearSemester'])
            ->where('mahasiswa_id', $mahasiswa->id)
            ->when(
                $request->filled('academic_year_semester_id'),
                fn ($q) => $q->where('academic_year_semester_id', $request->input('academic_year_semester_id'))
            )
            ->latest()
            ->get();

        $totalSks = $krss->filter(fn ($krs) => $krs->status === 'disetujui')
            ->sum(fn ($krs) => $krs->kelas->mataKuliah->sks ?? 0);

        $academicYearSemester = $request->filled('academic_year_semester_id')
            ? AcademicYearSemester::find($request->input('academic_year_semester_id'))
            : $krss->first()?->academicYearSemester;

        $printCode = strtoupper(substr(sha1($mahasiswa->uuid.now()->timestamp.Str::random(4)), 0, 10));
        $qrCode = new QrCode(
            data: "KRS|{$mahasiswa->nim}|{$printCode}",
            errorCorrectionLevel: ErrorCorrectionLevel::Low,
            size: 120,
            margin: 0,
        );
        $qrCodeImage = base64_encode((new PngWriter)->write($qrCode)->getString());

        $pdf = Pdf::loadView('pdf.krs', [
            'mahasiswa' => $mahasiswa,
            'krss' => $krss,
            'totalSks' => $totalSks,
            'academicYearSemester' => $academicYearSemester,
            'printCode' => $printCode,
            'qrCode' => $qrCodeImage,
        ])->setPaper('legal', 'portrait');

        return $pdf->stream("krs-{$mahasiswa->nim}.pdf");
    }

    /**
     * Withdraw a KRS entry so the mahasiswa can resubmit — the only path
     * forward after a dosen PA or admin prodi marks it `revisi` or `ditolak`,
     * since there is no in-place edit for a submitted KRS entry and the
     * (mahasiswa, kelas, periode) unique constraint blocks resubmission
     * while the old row still exists.
     */
    public function destroy(Request $request, Krs $krs): RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa;

        abort_unless($krs->mahasiswa_id === $mahasiswa->id, 403);
        abort_unless(in_array($krs->status, ['pending', 'revisi', 'ditolak'], true), 422, 'KRS yang sudah diproses tidak dapat dibatalkan.');

        $krs->delete();

        return back()->with('success', 'KRS berhasil dibatalkan');
    }

    /**
     * Total SKS already submitted (pending or disetujui) by the mahasiswa for a period.
     */
    private function submittedSks(Mahasiswa $mahasiswa, int $academicYearSemesterId): int
    {
        return Krs::where('mahasiswa_id', $mahasiswa->id)
            ->where('academic_year_semester_id', $academicYearSemesterId)
            ->whereIn('status', ['pending', 'disetujui'])
            ->with('kelas.mataKuliah')
            ->get()
            ->sum(fn (Krs $krs) => $krs->kelas?->mataKuliah?->sks ?? 0);
    }
}
