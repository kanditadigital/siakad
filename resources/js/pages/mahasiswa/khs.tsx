import { Head } from '@inertiajs/react';
import { BookOpen, TrendingUp, Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Kartu Hasil Studi (KHS)
                        </h1>
                        <p className="text-gray-600">
                            {mahasiswa.nama} ({mahasiswa.nim})
                        </p>
                    </div>
                    <Button
                        onClick={() =>
                            (window.location.href = '/mahasiswa/khs/export-pdf')
                        }
                        className="bg-green-700 hover:bg-green-800"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Cetak PDF
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Mata Kuliah
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <BookOpen className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {nilais.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total SKS
                            </CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.total_sks}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                IPK
                            </CardTitle>
                            <div className="rounded-lg bg-green-800 p-2">
                                <Award className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {stats.ipk}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Mobile card list */}
                <div className="space-y-3 sm:hidden">
                    {nilais.length === 0 ? (
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="py-8 text-center text-gray-500">
                                Belum ada data nilai
                            </CardContent>
                        </Card>
                    ) : (
                        nilais.map((nilai) => (
                            <Card
                                key={nilai.id}
                                className="border border-gray-200 shadow-sm"
                            >
                                <CardContent className="space-y-2 pt-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {
                                                    nilai.krs?.kelas
                                                        ?.mata_kuliah?.nama_mk
                                                }
                                            </p>
                                            <p className="font-mono text-xs text-gray-500">
                                                {
                                                    nilai.krs?.kelas
                                                        ?.mata_kuliah?.kode_mk
                                                }
                                            </p>
                                        </div>
                                        {nilai.grade ? (
                                            <span
                                                className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}
                                            >
                                                {nilai.grade}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                -
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>
                                            {nilai.krs?.kelas?.mata_kuliah?.sks}{' '}
                                            SKS • Nilai {nilai.nilai ?? '-'}
                                        </span>
                                        <span>
                                            {
                                                nilai.krs
                                                    ?.academic_year_semester
                                                    ?.semester
                                            }{' '}
                                            -{' '}
                                            {
                                                nilai.krs
                                                    ?.academic_year_semester
                                                    ?.nama_tahun_akademik
                                            }
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Table (desktop/tablet) */}
                <Card className="hidden border border-gray-200 shadow-sm sm:block">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Daftar Nilai
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-600">
                                            Kode MK
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Mata Kuliah
                                        </TableHead>
                                        <TableHead className="text-right text-gray-600">
                                            SKS
                                        </TableHead>
                                        <TableHead className="text-right text-gray-600">
                                            Nilai
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Grade
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Semester
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Tahun Akademik
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {nilais.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                Belum ada data nilai
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        nilais.map((nilai) => (
                                            <TableRow key={nilai.id}>
                                                <TableCell className="font-mono font-medium text-gray-900">
                                                    {
                                                        nilai.krs?.kelas
                                                            ?.mata_kuliah
                                                            ?.kode_mk
                                                    }
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {
                                                        nilai.krs?.kelas
                                                            ?.mata_kuliah
                                                            ?.nama_mk
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right text-gray-900 tabular-nums">
                                                    {
                                                        nilai.krs?.kelas
                                                            ?.mata_kuliah?.sks
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-gray-900 tabular-nums">
                                                    {nilai.nilai ?? '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {nilai.grade ? (
                                                        <span
                                                            className={`rounded px-2 py-1 text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}
                                                        >
                                                            {nilai.grade}
                                                        </span>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {
                                                        nilai.krs
                                                            ?.academic_year_semester
                                                            ?.semester
                                                    }
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {
                                                        nilai.krs
                                                            ?.academic_year_semester
                                                            ?.nama_tahun_akademik
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

KhsMahasiswa.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KHS', href: '/mahasiswa/khs' },
    ],
});
