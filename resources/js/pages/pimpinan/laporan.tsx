import { Head } from '@inertiajs/react';
import {
    Award,
    DollarSign,
    GraduationCap,
    TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Props = {
    laporanAkademik: {
        total_mahasiswa: number;
        mahasiswa_aktif: number;
        mahasiswa_cuti: number;
        mahasiswa_lulus: number;
    };
    laporanNilai: {
        total_nilai: number;
        nilai_tercatat: number;
        krs_disetujui: number;
        total_yudisium: number;
    };
    laporanKeuangan: {
        total_tagihan: number;
        total_terbayar: number;
        tagihan_lunas: number;
        tagihan_belum_lunas: number;
    };
};

export default function LaporanPimpinan({
    laporanAkademik,
    laporanNilai,
    laporanKeuangan,
}: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    const tunggakan =
        laporanKeuangan.total_tagihan - laporanKeuangan.total_terbayar;
    const persentaseLunas =
        laporanKeuangan.total_tagihan > 0
            ? Math.round(
                  (laporanKeuangan.total_terbayar /
                      laporanKeuangan.total_tagihan) *
                      100,
              )
            : 0;

    return (
        <>
            <Head title="Laporan Ringkas" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Laporan Ringkas
                    </h1>
                    <p className="text-gray-600">
                        Ringkasan akademik, mahasiswa, nilai/yudisium, dan
                        keuangan kampus — bersifat pantauan, bukan pengelolaan
                        data
                    </p>
                </div>

                {/* KPI utama */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Mahasiswa
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tabular-nums text-gray-900">
                                {laporanAkademik.total_mahasiswa}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {laporanAkademik.mahasiswa_aktif} aktif
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Yudisium
                            </CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <Award className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tabular-nums text-gray-900">
                                {laporanNilai.total_yudisium}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {laporanNilai.krs_disetujui} KRS disetujui
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Terbayar
                            </CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-700">
                                {formatCurrency(laporanKeuangan.total_terbayar)}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {persentaseLunas}% dari total tagihan
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-l-4 border-gray-200 border-l-red-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Tunggakan
                            </CardTitle>
                            <div className="rounded-lg bg-red-500 p-2">
                                <DollarSign className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">
                                {formatCurrency(tunggakan)}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                {laporanKeuangan.tagihan_belum_lunas} tagihan
                                belum lunas
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Rincian per domain */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">
                                Status Mahasiswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-sm">
                                Aktif:{' '}
                                <span className="ml-1 font-bold tabular-nums">
                                    {laporanAkademik.mahasiswa_aktif}
                                </span>
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                Cuti:{' '}
                                <span className="ml-1 font-bold tabular-nums">
                                    {laporanAkademik.mahasiswa_cuti}
                                </span>
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                Lulus:{' '}
                                <span className="ml-1 font-bold tabular-nums">
                                    {laporanAkademik.mahasiswa_lulus}
                                </span>
                            </Badge>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">
                                Nilai & Yudisium
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-sm">
                                Total Nilai:{' '}
                                <span className="ml-1 font-bold tabular-nums">
                                    {laporanNilai.total_nilai}
                                </span>
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                Nilai Tercatat:{' '}
                                <span className="ml-1 font-bold tabular-nums">
                                    {laporanNilai.nilai_tercatat}
                                </span>
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                KRS Disetujui:{' '}
                                <span className="ml-1 font-bold tabular-nums">
                                    {laporanNilai.krs_disetujui}
                                </span>
                            </Badge>
                            <Badge variant="outline" className="text-sm">
                                Total Yudisium:{' '}
                                <span className="ml-1 font-bold tabular-nums">
                                    {laporanNilai.total_yudisium}
                                </span>
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Ringkasan Keuangan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-600">
                                            Rincian
                                        </TableHead>
                                        <TableHead className="text-right text-gray-600">
                                            Nilai
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="text-gray-900">
                                            Total Tagihan
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-gray-900">
                                            {formatCurrency(
                                                laporanKeuangan.total_tagihan,
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-gray-900">
                                            Total Terbayar
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-green-700">
                                            {formatCurrency(
                                                laporanKeuangan.total_terbayar,
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-gray-900">
                                            Tagihan Lunas
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-gray-900">
                                            {laporanKeuangan.tagihan_lunas}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="text-gray-900">
                                            Tagihan Belum Lunas
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums text-red-600">
                                            {
                                                laporanKeuangan.tagihan_belum_lunas
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
