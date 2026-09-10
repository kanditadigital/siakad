<?php

namespace App\Http\Controllers\Dosen;

use App\Concerns\InteractsWithUploads;
use App\Exports\DaftarMahasiswaKelasExport;
use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Materi;
use App\Models\Nilai;
use App\Models\Presensi;
use App\Models\Rps;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PerkuliahanController extends Controller
{
    use InteractsWithUploads;

    /**
     * Display perkuliahan page with all tabs.
     */
    public function index(Request $request): Response
    {
        $dosen = $request->user()->dosen;

        $kelas = Kelas::with(['mataKuliah'])
            ->where('dosen_id', $dosen->id)
            ->get();

        $selectedKelasId = $request->input('kelas_id');

        // Only allow selecting a kelas that belongs to this dosen.
        if ($selectedKelasId && ! $kelas->contains('id', (int) $selectedKelasId)) {
            $selectedKelasId = null;
        }

        // Auto-select first class if no class selected and dosen has classes
        if (! $selectedKelasId && $kelas->isNotEmpty()) {
            $selectedKelasId = $kelas->first()->id;
        }

        $presensis = [];
        $presensiHariIni = [];
        $presensiTanggal = $request->input('presensi_tanggal', now()->toDateString());
        // Riwayat defaults to today, same as the entry grid, but is filtered
        // independently: a dosen reviewing a past date's history shouldn't be
        // forced to also switch which day the quick-entry grid is marking.
        // 'all' is the explicit escape hatch back to the unfiltered log.
        $riwayatTanggal = $request->input('riwayat_tanggal', now()->toDateString());
        $materis = [];
        $krss = [];
        $rps = null;

        if ($selectedKelasId) {
            $rps = Rps::firstOrCreate(['kelas_id' => $selectedKelasId]);

            $presensis = Presensi::with(['mahasiswa'])
                ->where('kelas_id', $selectedKelasId)
                ->when(
                    $riwayatTanggal !== 'all',
                    fn ($q) => $q->where('tanggal', $riwayatTanggal),
                )
                ->orderBy('tanggal', 'desc')
                ->paginate(20, ['*'], 'presensi_page')
                ->withQueryString();

            // Keyed by mahasiswa_id so the one-click attendance grid can look
            // up each enrolled mahasiswa's status for the selected date in
            // constant time, without a query per row.
            $presensiHariIni = Presensi::where('kelas_id', $selectedKelasId)
                ->where('tanggal', $presensiTanggal)
                ->get(['id', 'mahasiswa_id', 'status', 'keterangan'])
                ->keyBy('mahasiswa_id');

            $materis = Materi::where('kelas_id', $selectedKelasId)
                ->latest()
                ->paginate(20, ['*'], 'materi_page')
                ->withQueryString();

            $krss = Krs::with(['mahasiswa', 'nilai'])
                ->where('kelas_id', $selectedKelasId)
                ->where('status', 'disetujui')
                ->when($request->filled('search'), function ($q) use ($request): void {
                    $search = $request->input('search');
                    $q->whereHas('mahasiswa', function ($mq) use ($search): void {
                        $mq->where('nim', 'like', "%{$search}%")
                            ->orWhere('nama', 'like', "%{$search}%");
                    });
                })
                ->get()
                ->map(fn (Krs $krs): array => [
                    'id' => $krs->id,
                    'uuid' => $krs->uuid,
                    'nilai' => $krs->nilai?->grade,
                    'nilai_angka' => $krs->nilai?->nilai !== null ? (float) $krs->nilai->nilai : null,
                    'status' => $krs->status,
                    'mahasiswa' => $krs->mahasiswa,
                ])
                ->values();
        }

        return Inertia::render('dosen/perkuliahan/index', [
            'kelas' => $kelas,
            'presensis' => $presensis,
            'presensiHariIni' => $presensiHariIni,
            'presensiTanggal' => $presensiTanggal,
            'riwayatTanggal' => $riwayatTanggal,
            'materis' => $materis,
            'krss' => $krss,
            'rps' => $rps,
            'selectedKelasId' => $selectedKelasId,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Resolve a kelas and ensure it is taught by the logged-in dosen.
     *
     * Every write in this controller targets data that belongs to a kelas, so
     * authorization always reduces to "does this kelas belong to me?".
     */
    private function kelasMilikDosen(Request $request, ?int $kelasId): Kelas
    {
        $dosenId = $request->user()->dosen?->id;

        abort_if($dosenId === null, 403);

        $kelas = Kelas::findOrFail($kelasId);

        abort_unless($kelas->dosen_id === $dosenId, 403);

        return $kelas;
    }

    /**
     * Upload or replace the RPS document for a kelas owned by the logged-in dosen.
     */
    public function uploadRps(Request $request, int $kelasId): RedirectResponse
    {
        $kelas = $this->kelasMilikDosen($request, $kelasId);

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $rps = Rps::firstOrNew(['kelas_id' => $kelas->id]);

        if ($rps->file_path) {
            static::deleteUpload($rps->file_path);
        }

        $rps->file_path = static::storeUpload($request->file('file'), 'rps');
        $rps->status = 'sudah_upload';
        $rps->catatan = null;
        $rps->uploaded_at = now();
        $rps->kelas_id = $kelas->id;
        $rps->save();

        return back()->with('success', 'RPS berhasil diunggah');
    }

    /**
     * Export the enrolled mahasiswa list for a kelas owned by the logged-in dosen.
     */
    public function exportMahasiswa(Request $request, int $kelasId)
    {
        $kelas = $this->kelasMilikDosen($request, $kelasId);

        return Excel::download(new DaftarMahasiswaKelasExport($kelas->id), "mahasiswa-{$kelas->kode_kelas}.xlsx");
    }

    /**
     * Store presensi.
     */
    public function storePresensi(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kelas_id' => ['required', 'integer', 'exists:kelas,id'],
            'mahasiswa_id' => ['required', 'integer', 'exists:mahasiswa,id'],
            'tanggal' => ['required', 'date'],
            'status' => ['required', 'string', 'in:hadir,izin,sakit,alpha'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        $kelas = $this->kelasMilikDosen($request, $validated['kelas_id']);

        // Presensi may only be recorded for a mahasiswa actually enrolled in the kelas.
        abort_unless(
            Krs::where('kelas_id', $kelas->id)
                ->where('mahasiswa_id', $validated['mahasiswa_id'])
                ->where('status', 'disetujui')
                ->exists(),
            403,
        );

        // Upsert on (kelas_id, mahasiswa_id, tanggal): the one-click attendance
        // grid calls this endpoint every time a status button is pressed, so
        // clicking a different status for the same mahasiswa on the same day
        // corrects the existing record instead of creating a duplicate.
        Presensi::updateOrCreate(
            [
                'kelas_id' => $validated['kelas_id'],
                'mahasiswa_id' => $validated['mahasiswa_id'],
                'tanggal' => $validated['tanggal'],
            ],
            [
                'status' => $validated['status'],
                'keterangan' => $validated['keterangan'] ?? null,
            ],
        );

        return back()->with('success', 'Presensi berhasil disimpan');
    }

    /**
     * Update presensi.
     */
    public function updatePresensi(Request $request, Presensi $presensi): RedirectResponse
    {
        $this->kelasMilikDosen($request, $presensi->kelas_id);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:hadir,izin,sakit,alpha'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        $presensi->update($validated);

        return back()->with('success', 'Presensi berhasil diperbarui');
    }

    /**
     * Store materi.
     */
    public function storeMateri(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kelas_id' => ['required', 'integer', 'exists:kelas,id'],
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'file' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        $this->kelasMilikDosen($request, $validated['kelas_id']);

        Materi::create([
            'kelas_id' => $validated['kelas_id'],
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'file_path' => static::storeUpload($request->file('file'), 'materi'),
            'file_name' => $request->file('file')->getClientOriginalName(),
        ]);

        return back()->with('success', 'Materi berhasil ditambahkan');
    }

    /**
     * Update materi. Replacing the file is optional — the existing PDF stays
     * attached when the dosen only fixes the judul or deskripsi.
     */
    public function updateMateri(Request $request, Materi $materi): RedirectResponse
    {
        $this->kelasMilikDosen($request, $materi->kelas_id);

        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'file' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        $data = [
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
        ];

        if ($request->hasFile('file')) {
            static::deleteUpload($materi->file_path);
            $data['file_path'] = static::storeUpload($request->file('file'), 'materi');
            $data['file_name'] = $request->file('file')->getClientOriginalName();
        }

        $materi->update($data);

        return back()->with('success', 'Materi berhasil diperbarui');
    }

    /**
     * Remove materi, including its file on the uploads disk.
     */
    public function destroyMateri(Request $request, Materi $materi): RedirectResponse
    {
        $this->kelasMilikDosen($request, $materi->kelas_id);

        static::deleteUpload($materi->file_path);
        $materi->delete();

        return back()->with('success', 'Materi berhasil dihapus');
    }

    /**
     * Update the nilai of a KRS entry belonging to a kelas taught by the logged-in dosen.
     *
     * The grade lives on the `nilai` table keyed by `krs_id`; `krs` itself only
     * carries the enrolment status (pending/disetujui/ditolak) and must not be
     * written to here.
     */
    public function updateNilai(Request $request, Krs $krs): RedirectResponse
    {
        $this->kelasMilikDosen($request, $krs->kelas_id);

        $validated = $request->validate([
            'nilai' => ['required', 'string', 'in:A,B+,B,C+,C,D,E'],
            'nilai_angka' => ['required', 'numeric', 'min:0', 'max:4'],
        ]);

        Nilai::updateOrCreate(
            ['krs_id' => $krs->id],
            [
                'grade' => $validated['nilai'],
                'nilai' => $validated['nilai_angka'],
                'status' => 'tercatat',
            ],
        );

        return back()->with('success', 'Nilai berhasil diperbarui');
    }
}
