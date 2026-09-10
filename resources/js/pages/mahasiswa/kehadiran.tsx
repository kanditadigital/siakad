import { Head } from '@inertiajs/react';
import { CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type PresensiPerKelas = {
    mata_kuliah: string | null;
    persentase_hadir: number | null;
    total_pertemuan: number;
};

type RingkasanPresensi = {
    persentase_hadir: number | null;
    per_kelas: PresensiPerKelas[];
};

type Props = {
    ringkasanPresensi: RingkasanPresensi;
};

export default function Kehadiran({ ringkasanPresensi }: Props) {
    return (
        <>
            <Head title="Kehadiran" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Kehadiran
                    </h1>
                    <p className="text-gray-600">
                        Persentase kehadiran per mata kuliah pada periode
                        berjalan
                    </p>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Kehadiran Keseluruhan
                        </CardTitle>
                        <div className="rounded-lg bg-green-600 p-2">
                            <CalendarCheck className="h-4 w-4 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tabular-nums text-gray-900">
                            {ringkasanPresensi.persentase_hadir !== null
                                ? `${ringkasanPresensi.persentase_hadir}%`
                                : '-'}
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden py-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead className="text-right">
                                        Pertemuan Tercatat
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Persentase Hadir
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ringkasanPresensi.per_kelas.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="py-8 text-center text-sm text-muted-foreground"
                                        >
                                            Belum ada data presensi periode
                                            ini
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ringkasanPresensi.per_kelas.map(
                                        (kelas, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-medium text-gray-900">
                                                    {kelas.mata_kuliah || '-'}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {kelas.total_pertemuan}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold tabular-nums">
                                                    {kelas.persentase_hadir ??
                                                        '-'}
                                                    %
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </>
    );
}

Kehadiran.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Kehadiran', href: '/mahasiswa/kehadiran' },
    ],
});
