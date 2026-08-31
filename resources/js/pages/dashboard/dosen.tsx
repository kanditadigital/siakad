import { Head } from '@inertiajs/react';
import { BookMarked, Users, GraduationCap, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Dosen = {
    nama: string;
    nidn: string;
};

type Kelas = {
    id: number;
    nama_kelas: string;
    status: string;
    semester: string;
    tahun_akademik: string;
    mata_kuliah: {
        nama_mk: string;
        sks: number;
    };
};

type Materi = {
    id: number;
    judul: string;
    kelas: {
        nama_kelas: string;
        mata_kuliah: {
            nama_mk: string;
        };
    };
};

type Props = {
    dosen?: Dosen;
    stats?: {
        total_kelas: number;
        kelas_aktif: number;
        total_mahasiswa_asuh: number;
        total_mahasiswa_diampu: number;
    };
    kelas_diampu?: Kelas[];
    materi_terbaru?: Materi[];
};

export default function DosenDashboard({
    dosen,
    stats,
    kelas_diampu,
    materi_terbaru,
}: Props) {
    if (!dosen || !stats) {
        return (
            <>
                <Head title="Dashboard Dosen" />
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Dashboard Dosen
                        </h1>
                        <p className="text-gray-600">Memuat data...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Dashboard Dosen" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Dashboard Dosen
                    </h1>
                    <p className="text-gray-600">
                        Selamat datang, {dosen.nama} ({dosen.nidn})
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Kelas Diampu
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <BookMarked className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.total_kelas}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {stats.kelas_aktif} aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Mahasiswa Diampu
                            </CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.total_mahasiswa_diampu}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                lintas seluruh kelas
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Mahasiswa Asuh (PA)
                            </CardTitle>
                            <div className="rounded-lg bg-green-800 p-2">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.total_mahasiswa_asuh}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Materi Terbaru
                            </CardTitle>
                            <div className="rounded-lg bg-green-500 p-2">
                                <FileText className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {materi_terbaru?.length ?? 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">
                                Kelas yang Diampu
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {kelas_diampu && kelas_diampu.length > 0 ? (
                                <div className="space-y-3">
                                    {kelas_diampu.map((kelas) => (
                                        <div
                                            key={kelas.id}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {kelas.mata_kuliah?.nama_mk}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {kelas.nama_kelas} •{' '}
                                                    {kelas.tahun_akademik} -
                                                    Semester {kelas.semester}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    kelas.status === 'Aktif'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {kelas.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-gray-500">
                                    Belum ada kelas yang diampu
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">
                                Materi Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {materi_terbaru && materi_terbaru.length > 0 ? (
                                <div className="space-y-3">
                                    {materi_terbaru.map((materi) => (
                                        <div
                                            key={materi.id}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {materi.judul}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {
                                                        materi.kelas
                                                            ?.mata_kuliah
                                                            ?.nama_mk
                                                    }{' '}
                                                    • {materi.kelas?.nama_kelas}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-gray-500">
                                    Belum ada materi diunggah
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

DosenDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
