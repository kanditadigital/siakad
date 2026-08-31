import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    GraduationCap,
    ClipboardList,
    Receipt,
    Users,
    BookOpen,
    School,
    ArrowRight,
    TrendingUp,
} from 'lucide-react';

type Props = {
    stats: {
        total_mahasiswa: number;
        mahasiswa_aktif: number;
        total_dosen: number;
        total_kelas: number;
        total_mata_kuliah: number;
        total_program_studi: number;
        krs_pending: number;
        tagihan_belum_lunas: number;
    };
};

export default function AdminDashboard({ stats }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-green-800">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan data akademik institusi
                    </p>
                </div>

                {/* Main Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-green-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Mahasiswa</p>
                                    <p className="text-3xl font-bold text-green-800">{stats.total_mahasiswa}</p>
                                    <p className="text-xs text-green-600 mt-1">
                                        {stats.mahasiswa_aktif} aktif
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-green-100">
                                    <GraduationCap className="h-6 w-6 text-green-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Dosen</p>
                                    <p className="text-3xl font-bold text-blue-800">{stats.total_dosen}</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Pengajar aktif
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Users className="h-6 w-6 text-blue-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Kelas</p>
                                    <p className="text-3xl font-bold text-purple-800">{stats.total_kelas}</p>
                                    <p className="text-xs text-purple-600 mt-1">
                                        {stats.total_mata_kuliah} mata kuliah
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-purple-100">
                                    <BookOpen className="h-6 w-6 text-purple-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm bg-gradient-to-br from-amber-50 to-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Program Studi</p>
                                    <p className="text-3xl font-bold text-amber-800">{stats.total_program_studi}</p>
                                    <p className="text-xs text-amber-600 mt-1">
                                        Aktif
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-amber-100">
                                    <School className="h-6 w-6 text-amber-700" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-yellow-100">
                                        <ClipboardList className="h-5 w-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">KRS Pending</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.krs_pending}</p>
                                    </div>
                                </div>
                                <Link href="/admin/krs">
                                    <Button variant="ghost" size="sm">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-red-100">
                                        <Receipt className="h-5 w-5 text-red-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tagihan Belum Lunas</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.tagihan_belum_lunas}</p>
                                    </div>
                                </div>
                                <Link href="/admin/tagihan-ukt">
                                    <Button variant="ghost" size="sm">
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-full bg-green-100">
                                        <TrendingUp className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tingkat Aktivitas</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.total_mahasiswa > 0 ? Math.round((stats.mahasiswa_aktif / stats.total_mahasiswa) * 100) : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
