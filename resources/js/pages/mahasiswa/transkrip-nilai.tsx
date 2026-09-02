import { Head } from '@inertiajs/react';
import { Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
                    <Button className="bg-green-700 hover:bg-green-800" asChild>
                        <a href="/mahasiswa/transkrip-nilai/export-pdf">
                            <Download className="mr-2 h-4 w-4" />
                            Cetak PDF
                        </a>
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
                                            Total Mata Kuliah
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {nilais.length}
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
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Mobile card list */}
                <div className="space-y-3 sm:hidden">
                    {nilais.length === 0 ? (
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="py-8 text-center text-gray-500">
                                Belum ada data nilai
                            </CardContent>
                        </Card>
                    ) : (
                        nilais.map((nilai, index) => (
                            <Card
                                key={nilai.id}
                                className="border border-gray-200 shadow-sm"
                            >
                                <CardContent className="space-y-2 pt-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {index + 1}.{' '}
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
                <div className="hidden rounded-lg border sm:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead className="text-right">
                                        SKS
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Nilai
                                    </TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Periode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {nilais.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Award className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    Belum ada data nilai
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Nilai yang telah dicatat
                                                    akan muncul di sini
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    nilais.map((nilai, index) => (
                                        <TableRow key={nilai.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <div>
                                                    {
                                                        nilai.krs?.kelas
                                                            ?.mata_kuliah
                                                            ?.nama_mk
                                                    }
                                                </div>
                                                <div className="font-mono text-xs text-muted-foreground">
                                                    {
                                                        nilai.krs?.kelas
                                                            ?.mata_kuliah
                                                            ?.kode_mk
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {
                                                    nilai.krs?.kelas
                                                        ?.mata_kuliah?.sks
                                                }
                                            </TableCell>
                                            <TableCell className="text-right font-medium tabular-nums">
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
                                            <TableCell>
                                                <div>
                                                    {
                                                        nilai.krs
                                                            ?.academic_year_semester
                                                            ?.nama_tahun_akademik
                                                    }
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Semester{' '}
                                                    {
                                                        nilai.krs
                                                            ?.academic_year_semester
                                                            ?.semester
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
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
