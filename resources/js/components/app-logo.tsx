import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

/**
 * Sidebar brand block: a compact plate beside the campus name.
 *
 * Laid out horizontally rather than as a tall centred stack so the brand costs
 * ~72px of height instead of ~150px and the first menu item sits near the top.
 * The no-logo fallback plate is translucent white rather than the old solid
 * green one: on the green sidebar a green plate would simply disappear into the
 * panel behind it.
 */
export default function AppLogo() {
    const { kampus } = usePage().props;

    return (
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
            <div
                className={`flex aspect-square size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg group-data-[collapsible=icon]:size-8 ${
                    kampus.logo_url
                        ? 'bg-white'
                        : 'bg-white/10 ring-1 ring-white/20'
                }`}
            >
                {kampus.logo_url ? (
                    <img
                        src={kampus.logo_url}
                        alt={`Logo ${kampus.nama}`}
                        className="size-full object-contain p-0.5"
                    />
                ) : (
                    <>
                        <span className="text-[13px] font-semibold tracking-tight text-white group-data-[collapsible=icon]:hidden">
                            {inisialKampus(kampus.nama)}
                        </span>
                        <AppLogoIcon className="hidden size-4 text-white group-data-[collapsible=icon]:block" />
                    </>
                )}
            </div>

            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="line-clamp-2 text-[13px] leading-tight font-semibold text-white">
                    {kampus.nama}
                </p>
                <p className="mt-0.5 truncate text-[9px] font-medium tracking-[0.1em] text-sidebar-foreground/55 uppercase">
                    Sistem Informasi Akademik
                </p>
            </div>
        </div>
    );
}

/** First letters of the first two words, e.g. "STIT Daarurrahmah …" → "SD". */
function inisialKampus(nama: string): string {
    return nama
        .trim()
        .split(/\s+/u)
        .slice(0, 2)
        .map((kata) => kata.charAt(0).toUpperCase())
        .join('');
}
