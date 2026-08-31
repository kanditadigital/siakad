<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\TagihanUkt;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PembayaranController extends Controller
{
    /**
     * Display pembayaran list.
     */
    public function index(Request $request): Response
    {
        $pembayarans = Pembayaran::with(['mahasiswa', 'tagihanUkt.academicYearSemester'])
            ->latest()
            ->get();

        return Inertia::render('admin/pembayaran/index', [
            'pembayarans' => $pembayarans,
        ]);
    }

    /**
     * Show the form for manually recording a payment.
     */
    public function create(): Response
    {
        $tagihanUkts = TagihanUkt::with(['mahasiswa'])
            ->whereIn('status', ['belum', 'terlambat'])
            ->get();

        return Inertia::render('admin/pembayaran/create', [
            'tagihanUkts' => $tagihanUkts,
        ]);
    }

    /**
     * Manually record a payment as an admin (e.g. cash payment at the office) and mark it verified.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tagihan_ukt_id' => ['required', 'integer', 'exists:tagihan_ukts,id'],
            'jumlah_bayar' => ['required', 'numeric', 'min:1'],
            'tanggal_bayar' => ['required', 'date'],
            'metode_pembayaran' => ['required', 'string', 'in:transfer,cash'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated): void {
            $tagihanUkt = TagihanUkt::where('id', $validated['tagihan_ukt_id'])->lockForUpdate()->firstOrFail();

            $pembayaran = Pembayaran::create([
                'mahasiswa_id' => $tagihanUkt->mahasiswa_id,
                'tagihan_ukt_id' => $tagihanUkt->id,
                'jumlah_bayar' => $validated['jumlah_bayar'],
                'tanggal_bayar' => $validated['tanggal_bayar'],
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'status' => 'verified',
                'keterangan' => $validated['keterangan'] ?? 'Dicatat manual oleh admin',
            ]);

            $this->reconcileTagihan($tagihanUkt, $pembayaran->jumlah_bayar);
        });

        return redirect()->route('admin.pembayaran.index')->with('success', 'Pembayaran berhasil dicatat');
    }

    /**
     * Display pembayaran detail.
     */
    public function show(string $uuid): Response
    {
        $pembayaran = Pembayaran::with(['mahasiswa', 'tagihanUkt.academicYearSemester'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return Inertia::render('admin/pembayaran/show', [
            'pembayaran' => $pembayaran,
        ]);
    }

    /**
     * Verify pembayaran and reconcile the related TagihanUkt balance/status.
     */
    public function verify(Request $request, string $uuid): RedirectResponse
    {
        DB::transaction(function () use ($request, $uuid): void {
            $pembayaran = Pembayaran::where('uuid', $uuid)->lockForUpdate()->firstOrFail();

            if ($pembayaran->status !== 'pending') {
                abort(422, 'Pembayaran ini sudah diproses sebelumnya.');
            }

            $pembayaran->update([
                'status' => 'verified',
                'keterangan' => $request->input('keterangan', 'Pembayaran diverifikasi'),
            ]);

            $tagihanUkt = TagihanUkt::where('id', $pembayaran->tagihan_ukt_id)->lockForUpdate()->firstOrFail();

            $this->reconcileTagihan($tagihanUkt, $pembayaran->jumlah_bayar);
        });

        return redirect()->route('admin.pembayaran.show', $uuid)->with('success', 'Pembayaran berhasil diverifikasi');
    }

    /**
     * Reject pembayaran.
     */
    public function reject(Request $request, string $uuid): RedirectResponse
    {
        DB::transaction(function () use ($request, $uuid): void {
            $pembayaran = Pembayaran::where('uuid', $uuid)->lockForUpdate()->firstOrFail();

            if ($pembayaran->status !== 'pending') {
                abort(422, 'Pembayaran ini sudah diproses sebelumnya.');
            }

            $pembayaran->update([
                'status' => 'rejected',
                'keterangan' => $request->input('keterangan', 'Pembayaran ditolak'),
            ]);
        });

        return redirect()->route('admin.pembayaran.show', $uuid)->with('error', 'Pembayaran ditolak');
    }

    /**
     * Export kuitansi (receipt) PDF for a verified payment.
     */
    public function exportKuitansi(string $uuid)
    {
        $pembayaran = Pembayaran::with(['mahasiswa', 'tagihanUkt.academicYearSemester'])
            ->where('uuid', $uuid)
            ->where('status', 'verified')
            ->firstOrFail();

        $pdf = Pdf::loadView('pdf.kuitansi', [
            'pembayaran' => $pembayaran,
        ]);

        return $pdf->download("kuitansi-{$pembayaran->uuid}.pdf");
    }

    /**
     * Accumulate a payment amount into a tagihan and recompute its status.
     */
    private function reconcileTagihan(TagihanUkt $tagihanUkt, float $amount): void
    {
        $jumlahBayar = $tagihanUkt->jumlah_bayar + $amount;
        $status = $jumlahBayar >= $tagihanUkt->jumlah_tagihan
            ? 'lunas'
            : ($tagihanUkt->jatuh_tempo->isPast() ? 'terlambat' : 'belum');

        $tagihanUkt->update([
            'jumlah_bayar' => $jumlahBayar,
            'status' => $status,
        ]);
    }
}
