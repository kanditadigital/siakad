import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    LayoutGrid,
    Users,
    GraduationCap,
    UserCheck,
    Settings,
    Calendar,
    CalendarCheck,
    FileText,
    ClipboardList,
    CreditCard,
    Receipt,
    BarChart3,
    BookMarked,
    ClipboardCheck,
    FileCheck,
    DollarSign,
    PieChart,
    School,
    Building,
    FileUp,
    UserCog,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import type { NavGroup, NavItem } from '@/types';

/**
 * System-administration menu, split out of the main list so the sidebar reads as
 * "what I work on" above and "what I administer" below.
 */
const MENU_SISTEM_ADMIN: NavItem[] = [
    { title: 'Pengguna', href: '/admin/user', icon: UserCog },
    { title: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
];

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth?.user;
    const role = user?.role;
    const { periode, tugas } = page.props.chrome;

    const menuUtama = (): NavItem[] => {
        const baseItems: NavItem[] = [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
        ];

        switch (role) {
            case 'admin':
                return [
                    ...baseItems,
                    {
                        title: 'Data Master',
                        href: '#',
                        icon: School,
                        children: [
                            {
                                title: 'Program Studi',
                                href: '/admin/program-studi',
                                icon: School,
                            },
                            {
                                title: 'Mahasiswa',
                                href: '/admin/mahasiswa',
                                icon: GraduationCap,
                            },
                            {
                                title: 'Dosen & Tendik',
                                href: '/admin/dosen',
                                icon: UserCheck,
                            },
                            {
                                title: 'Mata Kuliah',
                                href: '/admin/mata-kuliah',
                                icon: BookOpen,
                            },
                            {
                                title: 'Ruang Kelas',
                                href: '/admin/ruang',
                                icon: Building,
                            },
                        ],
                    },
                    {
                        title: 'Akademik',
                        href: '#',
                        icon: Calendar,
                        children: [
                            {
                                title: 'Tahun Akademik',
                                href: '/admin/data-akademik',
                                icon: Calendar,
                            },
                            {
                                title: 'Penjadwalan',
                                href: '/admin/penjadwalan',
                                icon: ClipboardList,
                            },
                            {
                                title: 'KRS',
                                href: '/admin/krs',
                                icon: ClipboardList,
                            },
                            {
                                title: 'Nilai',
                                href: '/admin/nilai',
                                icon: FileText,
                            },
                            {
                                title: 'RPS',
                                href: '/admin/rps',
                                icon: FileUp,
                            },
                            {
                                title: 'Yudisium',
                                href: '/admin/yudisium',
                                icon: FileCheck,
                            },
                        ],
                    },
                    {
                        title: 'Keuangan',
                        href: '#',
                        icon: CreditCard,
                        badge: tugas?.tagihan_belum_lunas,
                        children: [
                            {
                                title: 'Skema UKT',
                                href: '/admin/ukt-scheme',
                                icon: Receipt,
                            },
                            {
                                title: 'Tagihan UKT',
                                href: '/admin/tagihan-ukt',
                                icon: Receipt,
                            },
                            {
                                title: 'Pembayaran',
                                href: '/admin/pembayaran',
                                icon: CreditCard,
                            },
                        ],
                    },
                    {
                        title: 'Laporan',
                        href: '/admin/laporan',
                        icon: PieChart,
                    },
                ];

            case 'dosen':
                return [
                    ...baseItems,
                    {
                        title: 'Profil Dosen',
                        href: '/dosen/profil',
                        icon: UserCheck,
                    },
                    {
                        title: 'Perkuliahan',
                        href: '/dosen/perkuliahan',
                        icon: BookMarked,
                    },
                    {
                        title: 'Mahasiswa Asuh (PA)',
                        href: '/dosen/mahasiswa-asuh',
                        icon: Users,
                    },
                    {
                        title: 'Review KRS (PA)',
                        href: '/dosen/krs-pa',
                        icon: FileCheck,
                    },
                    {
                        title: 'Bimbingan Tugas Akhir',
                        href: '/dosen/bimbingan-tugas-akhir',
                        icon: ClipboardCheck,
                    },
                    {
                        title: 'Pengaturan Nilai',
                        href: '/dosen/pengaturan-nilai',
                        icon: Settings,
                    },
                ];

            case 'mahasiswa':
                return [
                    ...baseItems,
                    {
                        title: 'Profil Mahasiswa',
                        href: '/mahasiswa/profil',
                        icon: GraduationCap,
                    },
                    {
                        title: 'KRS',
                        href: '/mahasiswa/krs',
                        icon: ClipboardList,
                    },
                    {
                        title: 'KHS',
                        href: '/mahasiswa/khs',
                        icon: FileText,
                    },
                    {
                        title: 'Transkrip Nilai',
                        href: '/mahasiswa/transkrip-nilai',
                        icon: BookOpen,
                    },
                    {
                        title: 'Jadwal Perkuliahan',
                        href: '/mahasiswa/jadwal',
                        icon: Calendar,
                    },
                    {
                        title: 'Kehadiran',
                        href: '/mahasiswa/kehadiran',
                        icon: CalendarCheck,
                    },
                    {
                        title: 'Tagihan UKT',
                        href: '/mahasiswa/tagihan-ukt',
                        icon: Receipt,
                    },
                    {
                        title: 'Pengajuan Judul TA',
                        href: '/mahasiswa/pengajuan-judul-ta',
                        icon: BookMarked,
                    },
                ];

            case 'admin_prodi':
                return [
                    {
                        title: 'Dashboard',
                        href: '/admin-prodi',
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Data Mahasiswa',
                        href: '/admin-prodi/mahasiswa',
                        icon: GraduationCap,
                    },
                    {
                        title: 'Data Dosen',
                        href: '/admin-prodi/dosen',
                        icon: UserCheck,
                    },
                    {
                        title: 'Dosen PA',
                        href: '/admin-prodi/dosen-pa',
                        icon: UserCog,
                    },
                    {
                        title: 'Mata Kuliah',
                        href: '/admin-prodi/mata-kuliah',
                        icon: BookOpen,
                    },
                    {
                        title: 'Penjadwalan',
                        href: '/admin-prodi/penjadwalan',
                        icon: ClipboardList,
                    },
                    {
                        title: 'Data KRS',
                        href: '/admin-prodi/krs',
                        icon: ClipboardList,
                    },
                    {
                        title: 'Data Nilai',
                        href: '/admin-prodi/nilai',
                        icon: FileText,
                    },
                    {
                        title: 'Pengajuan Judul TA',
                        href: '/admin-prodi/pengajuan-judul-ta',
                        icon: FileCheck,
                    },
                ];

            case 'pimpinan':
                return [
                    ...baseItems,
                    {
                        title: 'Monitoring Akademik',
                        href: '/pimpinan/monitoring-akademik',
                        icon: ClipboardList,
                    },
                    {
                        title: 'Monitoring Keuangan',
                        href: '/pimpinan/monitoring-keuangan',
                        icon: DollarSign,
                    },
                    {
                        title: 'Laporan',
                        href: '/pimpinan/laporan',
                        icon: BarChart3,
                    },
                ];

            default:
                return baseItems;
        }
    };

    const groups: NavGroup[] = [
        { label: 'Menu Utama', items: menuUtama() },
        ...(role === 'admin'
            ? [{ label: 'Sistem', items: MENU_SISTEM_ADMIN }]
            : []),
    ];

    /*
     * No right border: the primitive ships `border-r`, which the global
     * `* { @apply border-border }` rule paints in the light `--border` grey —
     * fine against the old white sidebar, a white seam against the green one.
     * The colour change already separates panel from content.
     *
     * The variant has to be matched (`group-data-[side=left]:border-r-0`) for
     * tailwind-merge to drop the original: it only merges classes sharing the
     * same variant, and the prefixed rule also outranks a bare `border-r-0`
     * on specificity.
     */
    return (
        <Sidebar
            collapsible="icon"
            className="group-data-[side=left]:border-r-0"
        >
            <SidebarHeader className="gap-0 border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:px-1">
                <Link href="/dashboard" prefetch>
                    <AppLogo />
                </Link>
            </SidebarHeader>

            <SidebarContent className="gap-5 py-5">
                <NavMain groups={groups} />
            </SidebarContent>

            {/* Period card, not a second brand colour: a light card (the old
                green-50 one) punches a hole in the dark panel. Translucent white
                keeps the panel reading as one surface. Rendered only when there
                is a period — an empty footer would leave a stray hairline, as
                would the card's slot in icon mode. */}
            {periode ? (
                <SidebarFooter className="gap-3 border-t border-sidebar-border p-3 group-data-[collapsible=icon]:hidden">
                    <div className="rounded-md bg-white/8 px-3 py-2.5 ring-1 ring-white/12">
                        <p className="text-[9px] font-medium tracking-[0.12em] text-sidebar-foreground/55 uppercase">
                            Tahun Akademik
                        </p>
                        <p className="mt-1 text-[13px] leading-tight font-semibold text-white">
                            {periode.label}
                        </p>
                        {periode.pekan ? (
                            <p className="mt-0.5 text-[11px] text-sidebar-foreground/60">
                                Perkuliahan pekan ke-{periode.pekan}
                            </p>
                        ) : null}
                    </div>
                </SidebarFooter>
            ) : null}
        </Sidebar>
    );
}
