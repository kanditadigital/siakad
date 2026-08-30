import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    GraduationCap,
    ClipboardList,
    Receipt,
    BookOpen,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';

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

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    approved: 'default',
    rejected: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    approved: 'Disetujui',
    rejected: 'Ditolak',
};

const GRADE_COLORS: Record<string, string> = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
};

export default function MahasiswaDashboard({ mahasiswa, stats, recent_krs, recent_nilai }: Props) {
    if (!mahasiswa || !stats) {
        return (
            <>
                <Head title="Mahasiswa Dashboard" />
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                            Dashboard Mahasiswa
                        </h1>
                        <p className="text-siak-sage">Memuat data...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Mahasiswa Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                        Dashboard Mahasiswa
                    </h1>
                    <p className="text-siak-sage">
                        Selamat datang, {mahasiswa.nama} ({mahasiswa.nim})
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total KRS
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {stats.krs_count}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-siak-sage">
                                <span>{stats.krs_active} disetujui</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Tagihan UKT
                            </CardTitle>
                            <Receipt className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {stats.tagihan_count}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-siak-sage">
                                <span>belum lunas</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Mata Kuliah
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {stats.nilai_count}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-siak-sage">
                                <span>sudah ada nilai</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Status
                            </CardTitle>
                            <GraduationCap className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern capitalize">
                                {mahasiswa.status}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-siak-sage">
                                <span>{mahasiswa.program_studi?.nama_prodi}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent KRS & Nilai */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent KRS */}
                    <Card className="border-siak-moss/60">
                        <CardHeader>
                            <CardTitle className="text-siak-pine">KRS Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_krs && recent_krs.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_krs.map((krs) => (
                                        <div key={krs.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm">{krs.kelas?.mata_kuliah?.nama_mk}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {krs.kelas?.nama_kelas} • {krs.kelas?.dosen?.nama || '-'}
                                                </p>
                                            </div>
                                            <Badge variant={STATUS_VARIANTS[krs.status] || 'outline'}>
                                                {STATUS_LABELS[krs.status] || krs.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-siak-sage text-center py-4">
                                    Belum ada data KRS
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Nilai */}
                    <Card className="border-siak-moss/60">
                        <CardHeader>
                            <CardTitle className="text-siak-pine">Nilai Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recent_nilai && recent_nilai.length > 0 ? (
                                <div className="space-y-3">
                                    {recent_nilai.map((nilai) => (
                                        <div key={nilai.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm">{nilai.krs?.kelas?.mata_kuliah?.nama_mk}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Nilai: {nilai.nilai ?? '-'}
                                                </p>
                                            </div>
                                            {nilai.grade ? (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}>
                                                    {nilai.grade}
                                                </span>
                                            ) : (
                                                <Badge variant="outline">Belum</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-siak-sage text-center py-4">
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
