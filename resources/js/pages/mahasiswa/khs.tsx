import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BookOpen, TrendingUp, Award, Download } from 'lucide-react';

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
                        <h1 className="text-2xl font-bold text-green-800">
                            Kartu Hasil Studi (KHS)
                        </h1>
                        <p className="text-gray-600">
                            {mahasiswa.nama} ({mahasiswa.nim})
                        </p>
                    </div>
                    <Button
                        onClick={() => window.location.href = '/mahasiswa/khs/export-pdf'}
                        className="bg-green-700 hover:bg-green-800"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Cetak PDF
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Mata Kuliah
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-green-600">
                                <BookOpen className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {nilais.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total SKS
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-green-700">
                                <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.total_sks}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                IPK
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-green-800">
                                <Award className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">
                                {stats.ipk}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Daftar Nilai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-gray-600">Kode MK</TableHead>
                                    <TableHead className="text-gray-600">Mata Kuliah</TableHead>
                                    <TableHead className="text-gray-600">SKS</TableHead>
                                    <TableHead className="text-gray-600">Nilai</TableHead>
                                    <TableHead className="text-gray-600">Grade</TableHead>
                                    <TableHead className="text-gray-600">Semester</TableHead>
                                    <TableHead className="text-gray-600">Tahun Akademik</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nilais.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            Belum ada data nilai
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    nilais.map((nilai) => (
                                        <TableRow key={nilai.id}>
                                            <TableCell className="font-mono font-medium text-gray-900">
                                                {nilai.krs?.kelas?.mata_kuliah?.kode_mk}
                                            </TableCell>
                                            <TableCell className="text-gray-900">{nilai.krs?.kelas?.mata_kuliah?.nama_mk}</TableCell>
                                            <TableCell className="text-gray-900">{nilai.krs?.kelas?.mata_kuliah?.sks}</TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {nilai.nilai ?? '-'}
                                            </TableCell>
                                            <TableCell>
                                                {nilai.grade ? (
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}>
                                                        {nilai.grade}
                                                    </span>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell className="text-gray-900">{nilai.krs?.academic_year_semester?.semester}</TableCell>
                                            <TableCell className="text-gray-900">{nilai.krs?.academic_year_semester?.nama_tahun_akademik}</TableCell>
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
