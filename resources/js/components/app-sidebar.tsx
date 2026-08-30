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
    ClipboardPlus,
    FileUp,
    PenLine,
    UserCog,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const user = page.props.auth?.user;
    const role = user?.role;

    const getNavItemsByRole = (): NavItem[] => {
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
                        title: 'Data Akademik',
                        href: '/admin/data-akademik',
                        icon: Calendar,
                    },
                    {
                        title: 'Program Studi',
                        href: '/admin/program-studi',
                        icon: School,
                    },
                    {
                        title: 'Data Mahasiswa',
                        href: '/admin/mahasiswa',
                        icon: GraduationCap,
                    },
                    {
                        title: 'Data Dosen & Tendik',
                        href: '/admin/dosen',
                        icon: UserCheck,
                    },
                    {
                        title: 'Data Mata Kuliah',
                        href: '/admin/mata-kuliah',
                        icon: BookOpen,
                    },
                    {
                        title: 'Ruang Kelas',
                        href: '/admin/ruang',
                        icon: Building,
                    },
                    {
                        title: 'Penjadwalan',
                        href: '/admin/penjadwalan',
                        icon: ClipboardList,
                    },
                    {
                        title: 'Data KRS',
                        href: '/admin/krs',
                        icon: ClipboardList,
                    },
                    {
                        title: 'Data Nilai',
                        href: '/admin/nilai',
                        icon: FileText,
                    },
                    {
                        title: 'Yudisium',
                        href: '/admin/yudisium',
                        icon: FileCheck,
                    },
                    {
                        title: 'Tagihan UKT',
                        href: '/admin/tagihan-ukt',
                        icon: Receipt,
                    },
                    {
                        title: 'Skema UKT',
                        href: '/admin/ukt-scheme',
                        icon: Receipt,
                    },
                    {
                        title: 'Pembayaran',
                        href: '/admin/pembayaran',
                        icon: CreditCard,
                    },
                    {
                        title: 'Laporan',
                        href: '/admin/laporan',
                        icon: PieChart,
                    },
                    {
                        title: 'Pengaturan Sistem',
                        href: '/admin/pengaturan',
                        icon: Settings,
                    },
                    {
                        title: 'Manajemen User',
                        href: '/admin/user',
                        icon: UserCog,
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
                        title: 'Bimbingan Tugas Akhir',
                        href: '/dosen/bimbingan-tugas-akhir',
                        icon: ClipboardCheck,
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

    const mainNavItems: NavItem[] = getNavItemsByRole();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
