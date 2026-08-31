<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rps;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RpsController extends Controller
{
    /**
     * Display all RPS submissions for review.
     */
    public function index(Request $request): Response
    {
        $rpsList = Rps::with(['kelas.mataKuliah', 'kelas.dosen'])
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->orderByDesc('uploaded_at')
            ->get();

        return Inertia::render('admin/rps/index', [
            'rpsList' => $rpsList,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Approve a submitted RPS.
     */
    public function approve(Rps $rps): RedirectResponse
    {
        abort_unless($rps->status === 'sudah_upload', 422);

        $rps->update(['status' => 'disetujui', 'catatan' => null]);

        return back()->with('success', 'RPS disetujui');
    }

    /**
     * Request revisions on a submitted RPS.
     */
    public function requestRevision(Request $request, Rps $rps): RedirectResponse
    {
        abort_unless($rps->status === 'sudah_upload', 422);

        $validated = $request->validate([
            'catatan' => ['required', 'string', 'max:1000'],
        ]);

        $rps->update(['status' => 'perlu_revisi', 'catatan' => $validated['catatan']]);

        return back()->with('success', 'Permintaan revisi RPS terkirim');
    }
}
