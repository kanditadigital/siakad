import { Head } from '@inertiajs/react';
import { Calendar, BookOpen } from 'lucide-react';
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

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Daftar Kelas
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
                                            Periode
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {krss.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                Belum ada jadwal perkuliahan
                                                pada periode ini
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
