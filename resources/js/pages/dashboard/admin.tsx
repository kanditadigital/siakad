import { Head, Link } from '@inertiajs/react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Dashboard Admin
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan data akademik institusi
                    </p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Mahasiswa
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_mahasiswa}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {stats.mahasiswa_aktif} aktif
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
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Dosen
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_dosen}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Pengajar aktif
                                    </p>
                                </div>
                                <div className="rounded-lg bg-green-700 p-2.5">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Kelas
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_kelas}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {stats.total_mata_kuliah} mata kuliah
                                    </p>
                                </div>
                                <div className="rounded-lg bg-green-800 p-2.5">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Program Studi
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 tabular-nums">
                                        {stats.total_program_studi}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Aktif
                                    </p>
                                </div>
                                <div className="rounded-lg bg-siak-sage p-2.5">
                                    <School className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-full bg-yellow-100 p-3">
                                        <ClipboardList className="h-5 w-5 text-yellow-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            KRS Pending
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 tabular-nums">
                                            {stats.krs_pending}
                                        </p>
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
                                    <div className="rounded-full bg-red-100 p-3">
                                        <Receipt className="h-5 w-5 text-red-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Tagihan Belum Lunas
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 tabular-nums">
                                            {stats.tagihan_belum_lunas}
                                        </p>
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
                                    <div className="rounded-full bg-green-100 p-3">
                                        <TrendingUp className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Tingkat Aktivitas
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 tabular-nums">
                                            {stats.total_mahasiswa > 0
                                                ? Math.round(
                                                      (stats.mahasiswa_aktif /
                                                          stats.total_mahasiswa) *
                                                          100,
                                                  )
                                                : 0}
                                            %
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
