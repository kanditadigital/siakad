<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\TagihanUkt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MonitoringKeuanganController extends Controller
{
    /**
     * Display financial monitoring overview (read-only).
     */
    public function index(Request $request): Response
    {
        $tagihans = TagihanUkt::all();

        $totalTagihan = $tagihans->sum('jumlah_tagihan');
        $totalTerbayar = $tagihans->sum('jumlah_bayar');
        $totalTunggakan = $totalTagihan - $totalTerbayar;

        $tagihanPerStatus = TagihanUkt::query()
            ->selectRaw('status, count(*) as total, sum(jumlah_tagihan) as jumlah')
            ->groupBy('status')
            ->get();

        $pembayaranPerStatus = Pembayaran::query()
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('pimpinan/monitoring-keuangan', [
            'stats' => [
                'total_tagihan' => $totalTagihan,
                'total_terbayar' => $totalTerbayar,
                'total_tunggakan' => $totalTunggakan,
                'persentase_lunas' => $tagihans->count() > 0
                    ? round($tagihans->where('status', 'lunas')->count() / $tagihans->count() * 100, 1)
                    : 0,
                'pembayaran_per_status' => $pembayaranPerStatus,
            ],
            'tagihanPerStatus' => $tagihanPerStatus,
        ]);
    }
}
