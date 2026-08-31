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
    krs: {
        kelas: {
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
        program_studi: {
            nama_prodi: string;
        };
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

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function TranskripNilaiMahasiswa({
    nilais,
    mahasiswa,
    stats,
}: Props) {
    return (
        <>
            <Head title="Transkrip Nilai" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Transkrip Nilai
                        </h1>
                        <p className="text-gray-600">
                            {mahasiswa.nama} ({mahasiswa.nim})
                        </p>
                    </div>
                    <Button
                        onClick={() =>
                            (window.location.href =
                                '/mahasiswa/transkrip-nilai/export-pdf')
                        }
                        className="bg-green-700 hover:bg-green-800"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Cetak PDF
                    </Button>
                </div>

                {/* Header Card */}
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <span className="text-3xl font-semibold text-siak-pine">
                                        {getInitials(mahasiswa.nama)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {mahasiswa.nama}
                                    </h2>
                                    <p className="text-gray-600">
                                        {mahasiswa.program_studi?.nama_prodi}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            NIM
                                        </p>
                                        <p className="font-mono font-medium text-gray-900">
                                            {mahasiswa.nim}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Total SKS
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {stats.total_sks}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            IPK
                                        </p>
                                        <p className="text-lg font-medium text-gray-900 tabular-nums">
                                            {stats.ipk}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Total Mata Kuliah
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {nilais.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Stats Cards */}
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

                {/* Table */}
                <Card className="border border-gray-200 shadow-sm">
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
                                            No
                                        </TableHead>
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
                                                colSpan={8}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                Belum ada data nilai
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        nilais.map((nilai, index) => (
                                            <TableRow key={nilai.id}>
                                                <TableCell className="text-gray-900">
                                                    {index + 1}
                                                </TableCell>
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

TranskripNilaiMahasiswa.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transkrip Nilai', href: '/mahasiswa/transkrip-nilai' },
    ],
});
