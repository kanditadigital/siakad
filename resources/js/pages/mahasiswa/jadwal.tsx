import { Head } from '@inertiajs/react';
import { BookOpen, Calendar } from 'lucide-react';
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
    kelas: {
        kode_kelas: string;
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

export default function JadwalPerkuliahan({ krss, mahasiswa }: Props) {
    const totalSks = krss.reduce(
        (sum, k) => sum + (k.kelas?.mata_kuliah?.sks || 0),
        0,
    );

    return (
        <>
            <Head title="Jadwal Perkuliahan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Jadwal Perkuliahan
                    </h1>
                    <p className="text-gray-600">
                        {mahasiswa.nama} ({mahasiswa.nim}) — kelas yang sedang
                        diikuti pada periode berjalan
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Kelas Diikuti
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <Calendar className="h-4 w-4 text-white" />
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
                                Total SKS
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
                </div>

                {/* Mobile card list */}
                <div className="space-y-3 sm:hidden">
                    {krss.length === 0 ? (
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="py-8 text-center text-gray-500">
                                Belum ada jadwal perkuliahan pada periode ini
                            </CardContent>
                        </Card>
                    ) : (
                        krss.map((krs) => (
                            <Card
                                key={krs.id}
                                className="border border-gray-200 shadow-sm"
                            >
                                <CardContent className="space-y-2 pt-4">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {krs.kelas?.mata_kuliah?.nama_mk}
                                        </p>
                                        <p className="font-mono text-xs text-gray-500">
                                            {krs.kelas?.mata_kuliah?.kode_mk}{' '}
                                            • {krs.kelas?.nama_kelas}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>
                                            {krs.kelas?.mata_kuliah?.sks} SKS •{' '}
                                            {krs.kelas?.dosen?.nama || '-'}
                                        </span>
                                        <span>
                                            {krs.kelas?.ruang?.kode_ruang ||
                                                '-'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {
                                            krs.academic_year_semester
                                                ?.nama_tahun_akademik
                                        }{' '}
                                        - Semester{' '}
                                        {krs.academic_year_semester?.semester}
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Table (desktop/tablet) */}
                <Card className="hidden overflow-hidden py-0 sm:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead className="text-right">
                                        SKS
                                    </TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Dosen</TableHead>
                                    <TableHead>Ruang</TableHead>
                                    <TableHead>Periode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {krss.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Calendar className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    Belum ada jadwal
                                                    perkuliahan
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Kelas yang disetujui pada
                                                    periode berjalan akan
                                                    muncul di sini
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    krss.map((krs) => (
                                        <TableRow key={krs.id}>
                                            <TableCell>
                                                <div>
                                                    {
                                                        krs.kelas?.mata_kuliah
                                                            ?.nama_mk
                                                    }
                                                </div>
                                                <div className="font-mono text-xs text-muted-foreground">
                                                    {
                                                        krs.kelas?.mata_kuliah
                                                            ?.kode_mk
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {krs.kelas?.mata_kuliah?.sks}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.nama_kelas}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.dosen?.nama ||
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.ruang
                                                    ?.kode_ruang || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {
                                                        krs
                                                            .academic_year_semester
                                                            ?.nama_tahun_akademik
                                                    }
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Semester{' '}
                                                    {
                                                        krs
                                                            .academic_year_semester
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
                </Card>
            </div>
        </>
    );
}

JadwalPerkuliahan.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Jadwal Perkuliahan', href: '/mahasiswa/jadwal' },
    ],
});
