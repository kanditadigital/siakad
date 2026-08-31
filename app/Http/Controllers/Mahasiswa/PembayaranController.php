<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\TagihanUkt;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PembayaranController extends Controller
{
    /**
     * Show the form for uploading proof of payment for a tagihan.
     */
    public function create(Request $request, TagihanUkt $tagihanUkt): Response
    {
        $mahasiswa = $request->user()->mahasiswa;

        abort_unless($tagihanUkt->mahasiswa_id === $mahasiswa->id, 403);

        return Inertia::render('mahasiswa/pembayaran/create', [
            'tagihanUkt' => $tagihanUkt->load('academicYearSemester'),
        ]);
    }

    /**
     * Submit proof of payment for admin verification.
     */
    public function store(Request $request, TagihanUkt $tagihanUkt): RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa;

        abort_unless($tagihanUkt->mahasiswa_id === $mahasiswa->id, 403);

        $validated = $request->validate([
            'jumlah_bayar' => ['required', 'numeric', 'min:1'],
            'tanggal_bayar' => ['required', 'date'],
            'metode_pembayaran' => ['required', 'string', 'in:transfer,cash'],
            'bukti_pembayaran' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
        ]);

        $buktiPath = $request->file('bukti_pembayaran')->store('bukti-pembayaran', 'public');

        Pembayaran::create([
            'mahasiswa_id' => $mahasiswa->id,
            'tagihan_ukt_id' => $tagihanUkt->id,
            'jumlah_bayar' => $validated['jumlah_bayar'],
            'tanggal_bayar' => $validated['tanggal_bayar'],
            'metode_pembayaran' => $validated['metode_pembayaran'],
            'bukti_pembayaran' => $buktiPath,
            'status' => 'pending',
        ]);

        return redirect()->route('mahasiswa.tagihan-ukt')
            ->with('success', 'Bukti pembayaran berhasil diunggah, menunggu verifikasi admin');
    }
}
