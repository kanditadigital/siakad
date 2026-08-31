import { Head, Link } from '@inertiajs/react';
import { Eye, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
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

type Pembayaran = {
    id: number;
    uuid: string;
    jumlah_bayar: number;
    tanggal_bayar: string;
    metode_pembayaran: string;
    status: string;
    created_at: string;
    mahasiswa: {
        nim: string;
        nama: string;
    };
    tagihan_ukt: {
        jumlah_tagihan: number;
        academic_year_semester: {
            nama_tahun_akademik: string;
            semester: string;
        };
    };
};

type Props = {
    pembayarans: Pembayaran[];
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    pending: 'outline',
    verified: 'default',
    rejected: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    verified: 'Diverifikasi',
    rejected: 'Ditolak',
};

const STATUS_ICONS: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    pending: Clock,
    verified: CheckCircle,
    rejected: XCircle,
};

export default function PembayaranIndex({ pembayarans }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Head title="Pembayaran" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Pembayaran
                        </h1>
                        <p className="text-gray-600">
                            Daftar pembayaran mahasiswa
                        </p>
                    </div>
                    <Button asChild className="bg-green-700 hover:bg-green-800">
                        <Link href="/admin/pembayaran/create">
                            Catat Pembayaran
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Pembayaran
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <CreditCard className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {pembayarans.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Pending
                            </CardTitle>
                            <div className="rounded-lg bg-yellow-500 p-2">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {
                                    pembayarans.filter(
                                        (p) => p.status === 'pending',
                                    ).length
                                }
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Diverifikasi
                            </CardTitle>
                            <div className="rounded-lg bg-green-500 p-2">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {
                                    pembayarans.filter(
                                        (p) => p.status === 'verified',
                                    ).length
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Daftar Pembayaran
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
                                            NIM
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Nama
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Tanggal Bayar
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Jumlah Bayar
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Metode
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pembayarans.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                Belum ada data pembayaran
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pembayarans.map((pembayaran, index) => {
                                            const StatusIcon =
                                                STATUS_ICONS[
                                                    pembayaran.status
                                                ] || Clock;

                                            return (
                                                <TableRow key={pembayaran.id}>
                                                    <TableCell className="text-gray-900">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-gray-900">
                                                        {
                                                            pembayaran.mahasiswa
                                                                ?.nim
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-gray-900">
                                                        {
                                                            pembayaran.mahasiswa
                                                                ?.nama
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-gray-900">
                                                        {
                                                            pembayaran.tanggal_bayar
                                                        }
                                                    </TableCell>
                                                    <TableCell className="font-medium text-gray-900">
                                                        {formatCurrency(
                                                            pembayaran.jumlah_bayar,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 capitalize">
                                                        {
                                                            pembayaran.metode_pembayaran
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                STATUS_VARIANTS[
                                                                    pembayaran
                                                                        .status
                                                                ] || 'outline'
                                                            }
                                                        >
                                                            <StatusIcon className="mr-1 h-3 w-3" />
                                                            {STATUS_LABELS[
                                                                pembayaran
                                                                    .status
                                                            ] ||
                                                                pembayaran.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            href={`/admin/pembayaran/${pembayaran.uuid}`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
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

PembayaranIndex.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pembayaran', href: '/admin/pembayaran' },
    ],
});
