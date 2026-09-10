<?php

namespace App\Observers;

use App\Events\TugasTertundaDiperbarui;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Krs;
use App\Models\TagihanUkt;
use Illuminate\Support\Facades\Cache;

/**
 * Keeps the `chrome.tugas` cache and the realtime header bell in sync with
 * Krs and TagihanUkt rows. Attached to both models in AppServiceProvider.
 *
 * @see HandleInertiaRequests::tugasTertunda()
 */
class TugasTertundaObserver
{
    public function saved(Krs|TagihanUkt $model): void
    {
        $this->sinkronkan();
    }

    public function deleted(Krs|TagihanUkt $model): void
    {
        $this->sinkronkan();
    }

    private function sinkronkan(): void
    {
        $tugas = [
            'krs_pending' => Krs::where('status', 'pending')->count(),
            'tagihan_belum_lunas' => TagihanUkt::whereIn('status', ['belum', 'terlambat'])->count(),
        ];

        Cache::put('chrome.tugas', $tugas, now()->addMinute());

        TugasTertundaDiperbarui::dispatch($tugas);
    }
}
