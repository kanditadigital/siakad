import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GraduationCap, BookMarked, CheckCircle2 } from 'lucide-react';

type Props = {
    stats: {
        mahasiswa_per_status: Record<string, number>;
        krs_per_status: Record<string, number>;
        total_kelas: number;
        kelas_aktif: number;
        persentase_kehadiran: number;
    };
    mahasiswaPerProdi: { nama_prodi: string; total: number }[];
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    nonaktif: 'Nonaktif',
    lulus: 'Lulus',
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

export default function MonitoringAkademik({ stats, mahasiswaPerProdi }: Props) {
    return (
        <>
            <Head title="Monitoring Akademik" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">Monitoring Akademik</h1>
                    <p className="text-gray-600">Ringkasan mahasiswa, kelas, KRS, dan presensi — bersifat pantauan, bukan pengelolaan data</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Kelas</CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <BookMarked className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.total_kelas}</div>
                            <p className="mt-1 text-xs text-gray-500">{stats.kelas_aktif} aktif</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Persentase Kehadiran</CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.persentase_kehadiran}%</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">KRS Pending</CardTitle>
                            <div className="rounded-lg bg-amber-500 p-2">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.krs_per_status.pending ?? 0}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Mahasiswa per Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {Object.entries(stats.mahasiswa_per_status).map(([status, total]) => (
                                <Badge key={status} variant="outline" className="text-sm">
                                    {STATUS_LABELS[status] || status}: <span className="ml-1 font-bold tabular-nums">{total}</span>
                                </Badge>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">KRS per Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {Object.entries(stats.krs_per_status).map(([status, total]) => (
                                <Badge key={status} variant="outline" className="text-sm">
                                    {STATUS_LABELS[status] || status}: <span className="ml-1 font-bold tabular-nums">{total}</span>
                                </Badge>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Mahasiswa per Program Studi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-600">Program Studi</TableHead>
                                        <TableHead className="text-right text-gray-600">Jumlah Mahasiswa</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mahasiswaPerProdi.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="py-8 text-center text-gray-500">
                                                Belum ada data
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        mahasiswaPerProdi.map((row) => (
                                            <TableRow key={row.nama_prodi}>
                                                <TableCell className="text-gray-900">{row.nama_prodi}</TableCell>
                                                <TableCell className="text-right tabular-nums text-gray-900">{row.total}</TableCell>
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
