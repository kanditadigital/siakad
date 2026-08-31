import { Head } from '@inertiajs/react';
import {
    GraduationCap,
    BookOpen,
    DollarSign,
    Download,
    Users,
    FileText,
    TrendingUp,
    Building,
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
    };
};

export default function LaporanIndex({ stats }: Props) {
    return (
        <>
            <Head title="Laporan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Laporan
                    </h1>
                    <p className="text-gray-600">
                        Laporan dan ekspor data institusi
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Mahasiswa
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.total_mahasiswa}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {stats.mahasiswa_aktif} aktif,{' '}
                                {stats.mahasiswa_lulus} lulus
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total KRS
                            </CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <FileText className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.total_krs}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {stats.krs_approved} disetujui
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Tagihan UKT
                            </CardTitle>
                            <div className="rounded-lg bg-green-800 p-2">
                                <DollarSign className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.tagihan_lunas +
                                    stats.tagihan_belum_lunas}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {stats.tagihan_lunas} lunas,{' '}
                                {stats.tagihan_belum_lunas} belum lunas
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Export Options */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Users className="h-5 w-5 text-green-700" />
                                Laporan Mahasiswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-gray-600">
                                Ekspor data seluruh mahasiswa ke PDF
                            </p>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        '/admin/laporan/export-mahasiswa')
                                }
                                className="w-full bg-green-700 hover:bg-green-800"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <BookOpen className="h-5 w-5 text-green-700" />
                                Laporan Nilai
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-gray-600">
                                Ekspor data seluruh nilai mahasiswa ke PDF
                            </p>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        '/admin/laporan/export-nilai')
                                }
                                className="w-full bg-green-700 hover:bg-green-800"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <TrendingUp className="h-5 w-5 text-green-700" />
                                Laporan Keuangan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-gray-600">
                                Ekspor data tagihan UKT ke PDF
                            </p>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        '/admin/laporan/export-keuangan')
                                }
                                className="w-full bg-green-700 hover:bg-green-800"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Building className="h-5 w-5 text-green-700" />
                                Laporan Sumber Daya
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-gray-600">
                                Ekspor data dosen, tendik, dan ruang ke PDF
                            </p>
                            <Button
                                onClick={() =>
                                    (window.location.href =
                                        '/admin/laporan/export-sumber-daya')
                                }
                                className="w-full bg-green-700 hover:bg-green-800"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </CardContent>
                    </Card>
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
