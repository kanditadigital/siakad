<?php

namespace App\Http\Middleware;

use App\Concerns\InteractsWithUploads;
use App\Models\Setting;
use Illuminate\Http\Request;
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
        ];
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
