<?php

namespace App\Observers;

use App\Models\Krs;
use App\Models\TagihanUkt;
use App\Support\TugasTertunda;

/**
 * Keeps the `chrome.tugas` cache fresh whenever a Krs or TagihanUkt row
 * changes, so the header bell's next poll (see `ChromeController::tugas`)
 * picks up the change immediately instead of waiting out the cache TTL.
 * Attached to both models in AppServiceProvider.
 */
class TugasTertundaObserver
{
    public function saved(Krs|TagihanUkt $model): void
    {
        TugasTertunda::segarkan();
    }

    public function deleted(Krs|TagihanUkt $model): void
    {
        TugasTertunda::segarkan();
    }
}
