import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    LayoutGrid,
    Users,
    GraduationCap,
    UserCheck,
    Settings,
    Calendar,
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
import { NavUser } from '@/components/nav-user';
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
                        title: 'Tagihan UKT',
                        href: '/mahasiswa/tagihan-ukt',
                        icon: Receipt,
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

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="gap-0 border-b border-sidebar-border px-4 pt-5 pb-4 group-data-[collapsible=icon]:px-1">
                <Link href="/dashboard" prefetch>
                    <AppLogo />
                </Link>
            </SidebarHeader>

            <SidebarContent className="gap-4 pt-4">
                <NavMain groups={groups} />
            </SidebarContent>

            <SidebarFooter className="gap-3 p-0">
                {periode ? (
                    <div className="mx-3 rounded-lg border border-green-100 bg-green-50 px-3.5 py-3 group-data-[collapsible=icon]:hidden">
                        <p className="text-[10px] font-bold tracking-[0.08em] text-green-700 uppercase">
                            Tahun Akademik
                        </p>
                        <p className="mt-1 text-sm font-bold">
                            {periode.label}
                        </p>
                        {periode.pekan ? (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Perkuliahan pekan ke-{periode.pekan}
                            </p>
                        ) : null}
                    </div>
                ) : null}

                <div className="border-t border-sidebar-border p-2">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
