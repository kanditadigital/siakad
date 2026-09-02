import { Head } from '@inertiajs/react';
import {
    Award,
    Building,
    DollarSign,
    Download,
    FileText,
    GraduationCap,
    School,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    stats: {
        total_mahasiswa: number;
        mahasiswa_aktif: number;
        mahasiswa_lulus: number;
        mahasiswa_cuti: number;
        total_krs: number;
        krs_approved: number;
        total_nilai: number;
        tagihan_lunas: number;
        tagihan_belum_lunas: number;
        total_dosen: number;
        total_tendik: number;
        total_ruang: number;
    };
};

const EXPORTS = [
    {
        icon: Users,
        title: 'Laporan Mahasiswa',
        description: 'Ekspor data seluruh mahasiswa ke PDF',
        href: '/admin/laporan/export-mahasiswa',
    },
    {
        icon: Award,
        title: 'Laporan Nilai',
        description: 'Ekspor data seluruh nilai mahasiswa ke PDF',
        href: '/admin/laporan/export-nilai',
    },
    {
        icon: TrendingUp,
        title: 'Laporan Keuangan',
        description: 'Ekspor data tagihan UKT ke PDF',
        href: '/admin/laporan/export-keuangan',
    },
    {
        icon: Building,
        title: 'Laporan Sumber Daya',
        description: 'Ekspor data dosen, tendik, dan ruang ke PDF',
        href: '/admin/laporan/export-sumber-daya',
    },
];

export default function LaporanIndex({ stats }: Props) {
    return (
        <>
            <Head title="Laporan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Laporan
                    </h1>
                    <p className="text-muted-foreground">
                        Laporan dan ekspor data institusi
                    </p>
                </div>

                {/* Overview */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Mahasiswa
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_mahasiswa}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stats.mahasiswa_aktif} aktif,{' '}
                                        {stats.mahasiswa_lulus} lulus,{' '}
                                        {stats.mahasiswa_cuti} cuti
                                    </p>
                                </div>
                                <div className="rounded-lg bg-green-600 p-2.5">
                                    <GraduationCap className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total KRS
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_krs}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stats.krs_approved} disetujui
                                    </p>
                                </div>
                                <div className="rounded-lg bg-green-700 p-2.5">
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Nilai
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_nilai}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Nilai tercatat
                                    </p>
                                </div>
                                <div className="rounded-lg bg-siak-sage p-2.5">
                                    <Award className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Tagihan UKT
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                                        {stats.tagihan_lunas +
                                            stats.tagihan_belum_lunas}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {stats.tagihan_lunas} lunas,{' '}
                                        {stats.tagihan_belum_lunas} belum
                                        lunas
                                    </p>
                                </div>
                                <div className="rounded-lg bg-green-800 p-2.5">
                                    <DollarSign className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sumber Daya */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-green-100 p-3">
                                    <Users className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Dosen
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_dosen}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-green-100 p-3">
                                    <Users className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Tendik
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_tendik}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-green-100 p-3">
                                    <School className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Ruang
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_ruang}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Export Options */}
                <div>
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                        Ekspor Laporan
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {EXPORTS.map((item) => (
                            <Card
                                key={item.href}
                                className="border border-gray-200 shadow-sm"
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-gray-900">
                                        <item.icon className="h-5 w-5 text-green-700" />
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                    <Button className="w-full" asChild>
                                        <a href={item.href}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download PDF
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

LaporanIndex.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan', href: '/admin/laporan' },
    ],
});
