import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

/**
 * Sidebar brand block: the logo uploaded in Pengaturan Sistem, falling back to
 * the built-in mark when no logo has been set yet.
 *
 * The logo sits on a white plate because an uploaded logo is authored for light
 * backgrounds and would otherwise disappear against the green sidebar.
 */
export default function AppLogo() {
    const { kampus } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-white/25 group-data-[collapsible=icon]:size-8">
                {kampus.logo_url ? (
                    <img
                        src={kampus.logo_url}
                        alt={`Logo ${kampus.nama}`}
                        className="size-full object-contain p-0.5"
                    />
                ) : (
                    <AppLogoIcon className="size-6 text-green-800" />
                )}
            </div>
            <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-semibold text-white">
                    {kampus.nama}
                </span>
                <span className="truncate text-[11px] font-medium tracking-wide text-white/60 uppercase">
                    Sistem Informasi Akademik
                </span>
            </div>
        </>
    );
}
