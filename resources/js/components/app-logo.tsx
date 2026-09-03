import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

/**
 * Sidebar brand block: a square institutional plate above the campus name.
 *
 * The plate is green with the campus initials until a logo is uploaded in
 * Pengaturan Sistem; an uploaded logo is authored for light backgrounds, so it
 * gets a white plate with a hairline ring instead of being burnt onto green.
 */
export default function AppLogo() {
    const { kampus } = usePage().props;

    return (
        <div className="flex flex-col items-center gap-3 text-center group-data-[collapsible=icon]:gap-0">
            <div
                className={`flex aspect-square size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl group-data-[collapsible=icon]:size-8 ${
                    kampus.logo_url
                        ? 'bg-white ring-1 ring-border'
                        : 'bg-green-700'
                }`}
            >
                {kampus.logo_url ? (
                    <img
                        src={kampus.logo_url}
                        alt={`Logo ${kampus.nama}`}
                        className="size-full object-contain p-1"
                    />
                ) : (
                    <>
                        <span className="text-xl font-bold tracking-tight text-white group-data-[collapsible=icon]:hidden">
                            {inisialKampus(kampus.nama)}
                        </span>
                        <AppLogoIcon className="hidden size-5 text-white group-data-[collapsible=icon]:block" />
                    </>
                )}
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm leading-snug font-bold text-foreground">
                    {kampus.nama}
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
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
