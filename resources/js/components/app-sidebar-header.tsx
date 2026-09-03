import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

/** Roles allowed through the `pencarian` route; others get no search box. */
const PERAN_PENCARIAN = ['admin', 'admin_prodi'];

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const props = usePage().props;
    const { auth, chrome } = props;
    const bolehMencari = PERAN_PENCARIAN.includes(auth.user?.role ?? '');
    const tugas = chrome.tugas;
    /** Keeps the box filled with the query being viewed on the results page. */
    const [kataKunci, setKataKunci] = useState(
        typeof props.q === 'string' ? props.q : '',
    );

    return (
        <>
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-4 sm:px-6">
                <SidebarTrigger className="-ml-1 shrink-0" />

                {bolehMencari ? (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get('/pencarian', { q: kataKunci });
                        }}
                        className="flex max-w-2xl flex-1 items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                name="q"
                                value={kataKunci}
                                onChange={(event) =>
                                    setKataKunci(event.target.value)
                                }
                                autoComplete="off"
                                maxLength={100}
                                placeholder="Cari mahasiswa, dosen, mata kuliah…"
                                aria-label="Cari mahasiswa, dosen, atau mata kuliah"
                                className="bg-muted pl-9"
                            />
                        </div>
                        <Button type="submit" className="shrink-0">
                            <Search className="h-4 w-4" />
                            <span className="hidden sm:inline">Cari</span>
                        </Button>
                    </form>
                ) : (
                    <div className="flex-1" />
                )}

                {tugas ? <LoncengTugas tugas={tugas} /> : null}
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
 */
function LoncengTugas({
    tugas,
}: {
    tugas: { krs_pending: number; tagihan_belum_lunas: number };
}) {
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
