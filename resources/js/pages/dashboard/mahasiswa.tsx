import { Head } from '@inertiajs/react';
import { GraduationCap, ClipboardList, Receipt, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
    status: string;
    program_studi: {
        nama_prodi: string;
    };
};

type Krs = {
    id: number;
    status: string;
    kelas: {
        nama_kelas: string;
        mata_kuliah: {
            nama_mk: string;
            sks: number;
        };
        dosen: {
            nama: string;
        };
    };
};

type Nilai = {
    id: number;
    nilai: number | null;
    grade: string | null;
    krs: {
        kelas: {
            mata_kuliah: {
                nama_mk: string;
            };
        };
    };
};

type Props = {
    mahasiswa?: Mahasiswa;
    stats?: {
        krs_count: number;
        krs_active: number;
        tagihan_count: number;
        nilai_count: number;
    };
    recent_krs?: Krs[];
    recent_nilai?: Nilai[];
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    pending: 'outline',
    disetujui: 'default',
    ditolak: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

const GRADE_COLORS: Record<string, string> = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
};

export default function MahasiswaDashboard({
    mahasiswa,
    stats,
    recent_krs,
    recent_nilai,
}: Props) {
    if (!mahasiswa || !stats) {
        return (
            <>
                <Head title="Mahasiswa Dashboard" />
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Dashboard Mahasiswa
                        </h1>
                        <p className="text-gray-600">Memuat data...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Mahasiswa Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Dashboard Mahasiswa
                    </h1>
                    <p className="text-gray-600">
                        Selamat datang, {mahasiswa.nama} ({mahasiswa.nim})
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total KRS
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <ClipboardList className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.krs_count}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {stats.krs_active} disetujui
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Tagihan UKT
                            </CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <Receipt className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.tagihan_count}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                belum lunas
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Mata Kuliah
                            </CardTitle>
                            <div className="rounded-lg bg-green-800 p-2">
                                <BookOpen className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.nilai_count}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                sudah ada nilai
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Status
                            </CardTitle>
                            <div className="rounded-lg bg-green-500 p-2">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 capitalize">
                                {mahasiswa.status}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {mahasiswa.program_studi?.nama_prodi}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">
                                KRS Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_krs && recent_krs.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_krs.map((krs) => (
                                        <div
                                            key={krs.id}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {
                                                        krs.kelas?.mata_kuliah
                                                            ?.nama_mk
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {krs.kelas?.nama_kelas} •{' '}
                                                    {krs.kelas?.dosen?.nama ||
                                                        '-'}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    STATUS_VARIANTS[
                                                        krs.status
                                                    ] || 'outline'
                                                }
                                            >
                                                {STATUS_LABELS[krs.status] ||
                                                    krs.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-gray-500">
                                    Belum ada data KRS
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">
                                Nilai Terbaru
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_nilai && recent_nilai.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_nilai.map((nilai) => (
                                        <div
                                            key={nilai.id}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {
                                                        nilai.krs?.kelas
                                                            ?.mata_kuliah
                                                            ?.nama_mk
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Nilai: {nilai.nilai ?? '-'}
                                                </p>
                                            </div>
                                            {nilai.grade ? (
                                                <span
                                                    className={`rounded px-2 py-1 text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}
                                                >
                                                    {nilai.grade}
                                                </span>
                                            ) : (
                                                <Badge variant="outline">
                                                    Belum
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-4 text-center text-sm text-gray-500">
                                    Belum ada data nilai
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

MahasiswaDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
