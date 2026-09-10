<?php

namespace App\Support;

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Krs;
use App\Models\TagihanUkt;
use Illuminate\Support\Facades\Cache;

/**
 * Institution-wide pending-work counts behind the header bell — shared by
 * the Inertia `chrome.tugas` prop (fresh as of the last page load) and the
 * `/chrome/tugas` polling endpoint the header polls afterwards, so both read
 * the exact same cached number instead of two independent computations.
 *
 * @see HandleInertiaRequests::PERAN_STAF
 */
class TugasTertunda
{
    private const CACHE_KEY = 'chrome.tugas';

    /**
     * @return array{krs_pending: int, tagihan_belum_lunas: int}
     */
    public static function hitung(): array
    {
        return Cache::remember(self::CACHE_KEY, now()->addMinute(), fn (): array => [
            'krs_pending' => Krs::where('status', 'pending')->count(),
            'tagihan_belum_lunas' => TagihanUkt::whereIn('status', ['belum', 'terlambat'])->count(),
        ]);
    }

    /**
     * Force a fresh count and re-cache it — called whenever a Krs or
     * TagihanUkt row changes, so the next poll picks up the change
     * immediately instead of waiting out the cache TTL.
     *
     * @return array{krs_pending: int, tagihan_belum_lunas: int}
     */
    public static function segarkan(): array
    {
        Cache::forget(self::CACHE_KEY);

        return self::hitung();
    }
}
