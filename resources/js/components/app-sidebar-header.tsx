import { Link, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { HeaderUserMenu } from '@/components/header-user-menu';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type Tugas = { krs_pending: number; tagihan_belum_lunas: number };

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { chrome } = usePage().props;
    const tugas = chrome.tugas;

    return (
        <>
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4 sm:px-6">
                {/* Curved transition where the sidebar meets the header. The
                    silhouette is the *content* panel rounding its top-left corner
                    with the sidebar colour behind it — not a bite taken out of
                    the sidebar, whose right edge stays straight. Hence a
                    sidebar-coloured box with the header's white rounded away from
                    the junction corner (border-radius removes material from the
                    corner it names).
                    Sits at left-0 — a negative offset here would be swallowed by
                    the content wrapper's `overflow-x-clip`. Desktop only: on
                    mobile the sidebar is a drawer, so there's no seam to soften. */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-0 left-0 hidden size-6 bg-sidebar lg:block"
                >
                    <div className="size-full rounded-tl-[1.5rem] bg-card" />
                </div>

                <SidebarTrigger className="-ml-1 shrink-0" />

                <div className="flex-1" />

                <div className="flex shrink-0 items-center gap-4">
                    {tugas ? <LoncengTugas tugas={tugas} /> : null}
                    <HeaderUserMenu />
                </div>
            </header>

            {breadcrumbs.length > 1 ? (
                <div className="px-4 pt-4 sm:px-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            ) : null}
        </>
    );
}

/**
 * Pending institution-wide work. A bell with nothing behind it is decoration —
 * this one opens the actual queues waiting for an admin.
 *
 * Seeded from the `chrome.tugas` prop (fresh as of the last page load) and
 * kept live afterwards over the `tugas` private channel — broadcast by
 * TugasTertundaObserver whenever a Krs or TagihanUkt row changes — so the
 * count updates without a reload while the user sits on any page.
 *
 * The leading dot on the event name opts out of Echo's default namespacing
 * (which would otherwise look for `App\Events\tugas\diperbarui`) and matches
 * the custom name set by `TugasTertundaDiperbarui::broadcastAs()`.
 */
function LoncengTugas({ tugas: awal }: { tugas: Tugas }) {
    const [realtime, setRealtime] = useState<Tugas | null>(null);
    const tugas = realtime ?? awal;

    useEcho<Tugas>('tugas', '.tugas.diperbarui', setRealtime);

    const daftar = [
        {
            teks: 'Pengajuan KRS menunggu persetujuan',
            jumlah: tugas.krs_pending,
            href: '/admin/krs',
        },
        {
            teks: 'Tagihan UKT belum lunas',
            jumlah: tugas.tagihan_belum_lunas,
            href: '/admin/tagihan-ukt',
        },
    ];
    const adaTugas = daftar.some((item) => item.jumlah > 0);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative ml-auto shrink-0"
                    aria-label={
                        adaTugas
                            ? 'Notifikasi: ada pekerjaan tertunda'
                            : 'Notifikasi'
                    }
                >
                    <Bell className="h-4 w-4" />
                    {adaTugas ? (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-kpi-keuangan ring-2 ring-card" />
                    ) : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Perlu Tindakan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {adaTugas ? (
                    daftar
                        .filter((item) => item.jumlah > 0)
                        .map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 rounded-sm px-2 py-2 text-sm hover:bg-accent"
                            >
                                <span className="min-w-0 flex-1">
                                    {item.teks}
                                </span>
                                <span className="font-semibold tabular-nums">
                                    {item.jumlah}
                                </span>
                            </Link>
                        ))
                ) : (
                    <p className="px-2 py-3 text-sm text-muted-foreground">
                        Tidak ada pekerjaan tertunda.
                    </p>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
