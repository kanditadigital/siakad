<?php

namespace App\Http\Middleware;

use App\Concerns\InteractsWithUploads;
use App\Models\AcademicYearSemester;
use App\Models\Krs;
use App\Models\Setting;
use App\Models\TagihanUkt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    use InteractsWithUploads;

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Roles that see institution-wide pending-work counts in the chrome.
     *
     * @var list<string>
     */
    private const PERAN_STAF = ['admin', 'admin_prodi', 'pimpinan'];

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'kampus' => $this->kampus(),
            'chrome' => [
                'periode' => $this->periodeAktif(),
                'tugas' => $user && in_array($user->role?->value, self::PERAN_STAF, true)
                    ? $this->tugasTertunda()
                    : null,
            ],
        ];
    }

    /**
     * Active academic period shown at the bottom of the sidebar.
     *
     * @return array{label: string, pekan: int|null}|null
     */
    private function periodeAktif(): ?array
    {
        return Cache::remember('chrome.periode', now()->addMinutes(5), function (): ?array {
            $periode = AcademicYearSemester::where('status', 'aktif')->latest('tanggal_mulai')->first();

            if ($periode === null) {
                return null;
            }

            $pekan = $periode->tanggal_mulai !== null && $periode->tanggal_mulai->isPast()
                ? (int) $periode->tanggal_mulai->diffInWeeks(now()) + 1
                : null;

            return [
                'label' => $periode->nama_tahun_akademik.' — '.$periode->semester,
                'pekan' => $pekan,
            ];
        });
    }

    /**
     * Counts behind the sidebar badge and the header bell.
     *
     * Cached briefly: these ride along on every Inertia request for staff, and a
     * badge that is a minute stale is not worth four counts per page view.
     *
     * @return array{krs_pending: int, tagihan_belum_lunas: int}
     */
    private function tugasTertunda(): array
    {
        return Cache::remember('chrome.tugas', now()->addMinute(), fn (): array => [
            'krs_pending' => Krs::where('status', 'pending')->count(),
            'tagihan_belum_lunas' => TagihanUkt::whereIn('status', ['belum', 'terlambat'])->count(),
        ]);
    }

    /**
     * Campus identity for the sidebar and other chrome.
     *
     * Read from the cached settings collection, so this costs no query per
     * request. The logo lives in the private uploads bucket, hence a signed URL
     * rather than a path.
     *
     * @return array{nama: string, logo_url: string|null}
     */
    private function kampus(): array
    {
        return [
            'nama' => (string) Setting::get('identitas.nama_kampus', config('app.name')),
            'logo_url' => static::uploadUrl(Setting::get('identitas.logo')),
        ];
    }
}
