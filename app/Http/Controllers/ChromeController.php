<?php

namespace App\Http\Controllers;

use App\Support\TugasTertunda;
use Illuminate\Http\JsonResponse;

class ChromeController extends Controller
{
    /**
     * Polled by the header bell (see `resources/js/components/app-sidebar-header.tsx`)
     * to refresh the pending-work badge without a full page reload.
     */
    public function tugas(): JsonResponse
    {
        return response()->json(TugasTertunda::hitung());
    }
}
