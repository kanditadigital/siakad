<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\InteractsWithUploads;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanController extends Controller
{
    use InteractsWithUploads;

    /**
     * Default values used the first time a setting is read before it has ever been saved.
     *
     * @var array<string, mixed>
     */
    private const DEFAULTS = [
        'identitas.nama_kampus' => 'STIT Daarurrahmah Sepadan',
        'identitas.alamat' => 'Sepadan, Kec. Rundeng, Kota Subulussalam, Aceh',
        'identitas.website' => 'stit-daras.ac.id',
        'identitas.logo' => null,
        'krs.sks_maks' => 24,
        'krs.sks_min' => 12,
        'krs.dibuka' => true,
        'nilai.bobot_tugas' => 20,
        'nilai.bobot_uts' => 25,
        'nilai.bobot_uas' => 30,
        'nilai.bobot_partisipasi' => 10,
        'nilai.bobot_kehadiran' => 15,
        'nilai.periode_input_dibuka' => true,
        'notifikasi.email_aktif' => true,
        'notifikasi.tagihan_aktif' => true,
    ];

    /**
     * Display pengaturan page.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('admin/pengaturan/index', [
            'settings' => $this->allSettingsWithDefaults(),
        ]);
    }

    /**
     * Update pengaturan.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'identitas' => ['required', 'array'],
            'identitas.nama_kampus' => ['required', 'string', 'max:255'],
            'identitas.alamat' => ['required', 'string', 'max:500'],
            'identitas.website' => ['required', 'string', 'max:255'],
            'identitas.logo' => ['nullable', 'file', 'image:jpeg,jpg,png', 'max:1024'],

            'krs' => ['required', 'array'],
            'krs.sks_maks' => ['required', 'integer', 'min:1', 'max:60'],
            'krs.sks_min' => ['required', 'integer', 'min:0', 'lte:krs.sks_maks'],
            'krs.dibuka' => ['required', 'boolean'],

            'nilai' => ['required', 'array'],
            'nilai.bobot_tugas' => ['required', 'integer', 'min:0', 'max:100'],
            'nilai.bobot_uts' => ['required', 'integer', 'min:0', 'max:100'],
            'nilai.bobot_uas' => ['required', 'integer', 'min:0', 'max:100'],
            'nilai.bobot_partisipasi' => ['required', 'integer', 'min:0', 'max:100'],
            'nilai.bobot_kehadiran' => ['required', 'integer', 'min:0', 'max:100'],
            'nilai.periode_input_dibuka' => ['required', 'boolean'],

            'notifikasi' => ['required', 'array'],
            'notifikasi.email_aktif' => ['required', 'boolean'],
            'notifikasi.tagihan_aktif' => ['required', 'boolean'],
        ]);

        $totalBobot = $validated['nilai']['bobot_tugas']
            + $validated['nilai']['bobot_uts']
            + $validated['nilai']['bobot_uas']
            + $validated['nilai']['bobot_partisipasi']
            + $validated['nilai']['bobot_kehadiran'];

        if ($totalBobot !== 100) {
            return back()->withErrors([
                'nilai.bobot_tugas' => "Total bobot komponen nilai harus 100%, saat ini {$totalBobot}%.",
            ])->withInput();
        }

        $validated['krs']['dibuka'] = $request->boolean('krs.dibuka');
        $validated['nilai']['periode_input_dibuka'] = $request->boolean('nilai.periode_input_dibuka');
        $validated['notifikasi']['email_aktif'] = $request->boolean('notifikasi.email_aktif');
        $validated['notifikasi']['tagihan_aktif'] = $request->boolean('notifikasi.tagihan_aktif');

        if ($request->hasFile('identitas.logo')) {
            $currentLogo = Setting::get('identitas.logo');
            if ($currentLogo) {
                static::deleteUpload($currentLogo);
            }
            $validated['identitas']['logo'] = static::storeUpload($request->file('identitas.logo'), 'logo');
        } else {
            unset($validated['identitas']['logo']);
        }

        $flat = [];
        foreach ($validated as $group => $fields) {
            foreach ($fields as $field => $value) {
                $flat["{$group}.{$field}"] = $value;
            }
        }
        Setting::setMany($flat);

        return redirect()->route('admin.pengaturan.index')->with('success', 'Pengaturan berhasil disimpan');
    }

    /**
     * Keys whose stored value should be cast to a real boolean/int for the frontend,
     * since the underlying `settings.value` column is untyped text.
     *
     * @var array<int, string>
     */
    private const BOOLEAN_KEYS = ['krs.dibuka', 'nilai.periode_input_dibuka', 'notifikasi.email_aktif', 'notifikasi.tagihan_aktif'];

    private const INTEGER_KEYS = ['krs.sks_maks', 'krs.sks_min', 'nilai.bobot_tugas', 'nilai.bobot_uts', 'nilai.bobot_uas', 'nilai.bobot_partisipasi', 'nilai.bobot_kehadiran'];

    /**
     * @return array<string, array<string, mixed>>
     */
    private function allSettingsWithDefaults(): array
    {
        $flat = [];

        foreach (self::DEFAULTS as $key => $default) {
            $value = Setting::get($key, $default);

            if (in_array($key, self::BOOLEAN_KEYS, true)) {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            } elseif (in_array($key, self::INTEGER_KEYS, true)) {
                $value = (int) $value;
            }

            $flat[$key] = $value;
        }

        $grouped = [];
        foreach ($flat as $key => $value) {
            [$group, $field] = explode('.', $key, 2);
            $grouped[$group][$field] = $value;
        }

        // The logo lives in the private uploads bucket, so the page needs a
        // pre-signed URL rather than the stored path.
        $grouped['identitas']['logo_url'] = static::uploadUrl($grouped['identitas']['logo'] ?? null);

        return $grouped;
    }
}
