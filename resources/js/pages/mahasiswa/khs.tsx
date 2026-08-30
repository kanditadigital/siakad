import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

type Nilai = {
    id: number;
    nilai: number | null;
    grade: string | null;
    status: string;
    krs: {
        kelas: {
            nama_kelas: string;
            mata_kuliah: {
                kode_mk: string;
                nama_mk: string;
                sks: number;
            };
        };
        academic_year_semester: {
            nama_tahun_akademik: string;
            semester: string;
        };
    };
};

type Props = {
    nilais: Nilai[];
    mahasiswa: {
        nim: string;
        nama: string;
    };
    stats: {
        total_sks: number;
        ipk: number;
    };
};

const GRADE_COLORS: Record<string, string> = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
};

export default function KhsMahasiswa({ nilais, mahasiswa, stats }: Props) {
    return (
        <>
            <Head title="KHS Mahasiswa" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                        Kartu Hasil Studi (KHS)
                    </h1>
                    <p className="text-siak-sage">
                        {mahasiswa.nama} ({mahasiswa.nim})
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total Mata Kuliah
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {nilais.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total SKS
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {stats.total_sks}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                IPK
                            </CardTitle>
                            <Award className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {stats.ipk}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border-siak-moss/60">
                    <CardHeader>
                        <CardTitle className="text-siak-pine">Daftar Nilai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode MK</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead>SKS</TableHead>
                                    <TableHead>Nilai</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Tahun Akademik</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nilais.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            Belum ada data nilai
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    nilais.map((nilai) => (
                                        <TableRow key={nilai.id}>
                                            <TableCell className="font-mono font-medium">
                                                {nilai.krs?.kelas?.mata_kuliah?.kode_mk}
                                            </TableCell>
                                            <TableCell>{nilai.krs?.kelas?.mata_kuliah?.nama_mk}</TableCell>
                                            <TableCell>{nilai.krs?.kelas?.mata_kuliah?.sks}</TableCell>
                                            <TableCell className="font-medium">
                                                {nilai.nilai ?? '-'}
                                            </TableCell>
                                            <TableCell>
                                                {nilai.grade ? (
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}>
                                                        {nilai.grade}
                                                    </span>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>{nilai.krs?.academic_year_semester?.semester}</TableCell>
                                            <TableCell>{nilai.krs?.academic_year_semester?.nama_tahun_akademik}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

KhsMahasiswa.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KHS', href: '/mahasiswa/khs' },
    ],
});
