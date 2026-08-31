<?php

namespace App\Http\Controllers\Dosen;

use App\Exports\DaftarMahasiswaKelasExport;
use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Krs;
use App\Models\Materi;
use App\Models\Presensi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PerkuliahanController extends Controller
{
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

        // Auto-select first class if no class selected and dosen has classes
        if (! $selectedKelasId && $kelas->isNotEmpty()) {
            $selectedKelasId = $kelas->first()->id;
        }

        $presensis = [];
        $materis = [];
        $krss = [];

        if ($selectedKelasId) {
            $presensis = Presensi::with(['mahasiswa'])
                ->where('kelas_id', $selectedKelasId)
                ->orderBy('tanggal', 'desc')
                ->paginate(20)
                ->withQueryString();

            $materis = Materi::where('kelas_id', $selectedKelasId)
                ->latest()
                ->paginate(20)
                ->withQueryString();

            $krss = Krs::with(['mahasiswa'])
                ->where('kelas_id', $selectedKelasId)
                ->where('status', 'disetujui')
                ->when($request->filled('search'), function ($q) use ($request): void {
                    $search = $request->input('search');
                    $q->whereHas('mahasiswa', function ($mq) use ($search): void {
                        $mq->where('nim', 'like', "%{$search}%")
                            ->orWhere('nama', 'like', "%{$search}%");
                    });
                })
                ->get();
        }

        return Inertia::render('dosen/perkuliahan/index', [
            'kelas' => $kelas,
            'presensis' => $presensis,
            'materis' => $materis,
            'krss' => $krss,
            'selectedKelasId' => $selectedKelasId,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Export the enrolled mahasiswa list for a kelas owned by the logged-in dosen.
     */
    public function exportMahasiswa(Request $request, int $kelasId)
    {
        $kelas = Kelas::findOrFail($kelasId);

        abort_unless($kelas->dosen_id === $request->user()->dosen?->id, 403);

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

        Presensi::create($validated);

        return back()->with('success', 'Presensi berhasil disimpan');
    }

    /**
     * Update presensi.
     */
    public function updatePresensi(Request $request, Presensi $presensi): RedirectResponse
    {
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
            'file_path' => ['nullable', 'string', 'max:500'],
        ]);

        Materi::create($validated);

        return back()->with('success', 'Materi berhasil ditambahkan');
    }

    /**
     * Update materi.
     */
    public function updateMateri(Request $request, Materi $materi): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'file_path' => ['nullable', 'string', 'max:500'],
        ]);

        $materi->update($validated);

        return back()->with('success', 'Materi berhasil diperbarui');
    }

    /**
     * Remove materi.
     */
    public function destroyMateri(Materi $materi): RedirectResponse
    {
        $materi->delete();

        return back()->with('success', 'Materi berhasil dihapus');
    }

    /**
     * Update nilai.
     */
    public function updateNilai(Request $request, Krs $krs): RedirectResponse
    {
        $validated = $request->validate([
            'nilai' => ['required', 'string', 'max:2'],
            'nilai_angka' => ['required', 'numeric', 'min:0', 'max:4'],
            'status' => ['required', 'string', 'in:proses,selesai'],
        ]);

        $krs->update($validated);

        return back()->with('success', 'Nilai berhasil diperbarui');
    }
}
