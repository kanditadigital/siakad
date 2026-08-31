import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, ClipboardList } from 'lucide-react';

interface ProgramStudi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface Props {
    stats: {
        mahasiswa: number;
        dosen: number;
        penjadwalan: number;
    };
    programStudi: ProgramStudi;
}

export default function AdminProdiDashboard({ stats, programStudi }: Props) {
    return (
        <>
            <Head title="Dashboard Admin Prodi" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-green-800">
                        Dashboard Admin Prodi
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan data program studi {programStudi.nama_prodi}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Mahasiswa
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-green-600">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.mahasiswa}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Mahasiswa aktif</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Dosen
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-green-700">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.dosen}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Dosen aktif</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Penjadwalan
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-green-800">
                                <ClipboardList className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.penjadwalan}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Jadwal aktif</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600">
                            Belum ada aktivitas terbaru untuk ditampilkan.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminProdiDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
