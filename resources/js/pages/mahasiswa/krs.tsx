import { Head } from '@inertiajs/react';
import { ClipboardList, BookOpen, CheckCircle, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

type Krs = {
    id: number;
    status: string;
    created_at: string;
    kelas: {
        nama_kelas: string;
        mata_kuliah: {
            kode_mk: string;
            nama_mk: string;
            sks: number;
        };
        dosen: {
            nama: string;
        } | null;
        ruang: {
            kode_ruang: string;
        } | null;
    };
    academic_year_semester: {
        nama_tahun_akademik: string;
        semester: string;
    };
};

type Props = {
    krss: Krs[];
    mahasiswa: {
        nim: string;
        nama: string;
    };
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

export default function KrsMahasiswa({ krss, mahasiswa }: Props) {
    const totalSks = krss
        .filter((k) => k.status === 'disetujui')
        .reduce((sum, k) => sum + (k.kelas?.mata_kuliah?.sks || 0), 0);

    return (
        <>
            <Head title="KRS Mahasiswa" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Kartu Rencana Studi (KRS)
                        </h1>
                        <p className="text-gray-600">
                            {mahasiswa.nama} ({mahasiswa.nim})
                        </p>
                    </div>
                    <Button
                        onClick={() =>
                            (window.location.href = '/mahasiswa/krs/export-pdf')
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
                                Total KRS
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <ClipboardList className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {krss.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total SKS Disetujui
                            </CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <BookOpen className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {totalSks}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Disetujui
                            </CardTitle>
                            <div className="rounded-lg bg-green-800 p-2">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {
                                    krss.filter((k) => k.status === 'disetujui')
                                        .length
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Daftar KRS
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
                                        <TableHead className="text-gray-600">
                                            Kelas
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Dosen
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Ruang
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Semester
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {krss.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                Belum ada data KRS
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        krss.map((krs) => (
                                            <TableRow key={krs.id}>
                                                <TableCell className="font-mono font-medium text-gray-900">
                                                    {
                                                        krs.kelas?.mata_kuliah
                                                            ?.kode_mk
                                                    }
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {
                                                        krs.kelas?.mata_kuliah
                                                            ?.nama_mk
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right text-gray-900 tabular-nums">
                                                    {
                                                        krs.kelas?.mata_kuliah
                                                            ?.sks
                                                    }
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {krs.kelas?.nama_kelas}
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {krs.kelas?.dosen?.nama ||
                                                        '-'}
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {krs.kelas?.ruang
                                                        ?.kode_ruang || '-'}
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {
                                                        krs
                                                            .academic_year_semester
                                                            ?.nama_tahun_akademik
                                                    }{' '}
                                                    -{' '}
                                                    {
                                                        krs
                                                            .academic_year_semester
                                                            ?.semester
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            STATUS_VARIANTS[
                                                                krs.status
                                                            ] || 'outline'
                                                        }
                                                    >
                                                        {STATUS_LABELS[
                                                            krs.status
                                                        ] || krs.status}
                                                    </Badge>
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

KrsMahasiswa.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KRS', href: '/mahasiswa/krs' },
    ],
});
