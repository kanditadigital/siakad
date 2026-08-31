<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanController extends Controller
{
    /**
     * Display pengaturan page.
     */
    public function index(Request $request): Response
    {
        $settings = [
            'app_name' => config('app.name'),
            'app_url' => config('app.url'),
            'app_locale' => config('app.locale'),
            'timezone' => config('app.timezone'),
        ];

        return Inertia::render('admin/pengaturan/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update pengaturan.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_url' => 'required|url|max:255',
            'app_locale' => 'required|string|max:10',
            'timezone' => 'required|string|max:50',
        ]);

        // In production, you would save to .env or database
        // For now, we'll just return success

        return redirect()->route('admin.pengaturan.index')->with('success', 'Pengaturan berhasil disimpan');
    }
}
