import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt, DollarSign, TrendingUp } from 'lucide-react';

type TagihanPerStatus = {
    status: string;
    total: number;
    jumlah: number;
};

type Props = {
    stats: {
        total_tagihan: number;
        total_terbayar: number;
        total_tunggakan: number;
        persentase_lunas: number;
        pembayaran_per_status: Record<string, number>;
    };
    tagihanPerStatus: TagihanPerStatus[];
};

const STATUS_LABELS: Record<string, string> = {
    belum: 'Belum Lunas',
    lunas: 'Lunas',
    terlambat: 'Terlambat',
    pending: 'Pending',
    verified: 'Diverifikasi',
    rejected: 'Ditolak',
};

export default function MonitoringKeuangan({ stats, tagihanPerStatus }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    return (
        <>
            <Head title="Monitoring Keuangan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">Monitoring Keuangan</h1>
                    <p className="text-gray-600">Ringkasan tagihan, pembayaran, dan tunggakan — bersifat pantauan, bukan pengelolaan data</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Tagihan</CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <Receipt className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_tagihan)}</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Terbayar</CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-700">{formatCurrency(stats.total_terbayar)}</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-l-4 border-gray-200 border-l-red-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Tunggakan</CardTitle>
                            <div className="rounded-lg bg-red-500 p-2">
                                <DollarSign className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.total_tunggakan)}</div>
                            <p className="mt-1 text-xs text-gray-500">{stats.persentase_lunas}% tagihan sudah lunas</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Tagihan per Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-gray-600">Status</TableHead>
                                            <TableHead className="text-right text-gray-600">Jumlah Tagihan</TableHead>
                                            <TableHead className="text-right text-gray-600">Nominal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tagihanPerStatus.map((row) => (
                                            <TableRow key={row.status}>
                                                <TableCell className="text-gray-900">{STATUS_LABELS[row.status] || row.status}</TableCell>
                                                <TableCell className="text-right tabular-nums text-gray-900">{row.total}</TableCell>
                                                <TableCell className="text-right tabular-nums text-gray-900">{formatCurrency(row.jumlah)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Pembayaran per Status</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {Object.entries(stats.pembayaran_per_status).map(([status, total]) => (
                                <Badge key={status} variant="outline" className="text-sm">
                                    {STATUS_LABELS[status] || status}: <span className="ml-1 font-bold tabular-nums">{total}</span>
                                </Badge>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
