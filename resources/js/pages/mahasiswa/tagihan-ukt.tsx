import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, CreditCard, Receipt } from 'lucide-react';
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

type TagihanUkt = {
    id: number;
    uuid: string;
    jumlah_tagihan: number;
    status: string;
    created_at: string;
    ukt_scheme: {
        nama: string;
    };
    academic_year_semester: {
        nama_tahun_akademik: string;
        semester: string;
    };
};

type Props = {
    tagihans: TagihanUkt[];
    mahasiswa: {
        nim: string;
        nama: string;
    };
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    lunas: 'default',
    belum: 'destructive',
    terlambat: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    lunas: 'Lunas',
    belum: 'Belum Lunas',
    terlambat: 'Terlambat',
};

export default function TagihanUktMahasiswa({ tagihans, mahasiswa }: Props) {
    const totalTagihan = tagihans.reduce((sum, t) => sum + t.jumlah_tagihan, 0);
    const totalLunas = tagihans
        .filter((t) => t.status === 'lunas')
        .reduce((sum, t) => sum + t.jumlah_tagihan, 0);
    const totalBelumLunas = tagihans
        .filter((t) => t.status === 'belum' || t.status === 'terlambat')
        .reduce((sum, t) => sum + t.jumlah_tagihan, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Head title="Tagihan UKT" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Tagihan UKT
                    </h1>
                    <p className="text-gray-600">
                        {mahasiswa.nama} ({mahasiswa.nim})
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Tagihan
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <Receipt className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 tabular-nums">
                                {formatCurrency(totalTagihan)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Sudah Lunas
                            </CardTitle>
                            <div className="rounded-lg bg-green-500 p-2">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 tabular-nums">
                                {formatCurrency(totalLunas)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Belum Lunas
                            </CardTitle>
                            <div className="rounded-lg bg-red-500 p-2">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 tabular-nums">
                                {formatCurrency(totalBelumLunas)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Mobile card list */}
                <div className="space-y-3 sm:hidden">
                    {tagihans.length === 0 ? (
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="py-8 text-center text-gray-500">
                                Belum ada data tagihan
                            </CardContent>
                        </Card>
                    ) : (
                        tagihans.map((tagihan) => (
                            <Card
                                key={tagihan.id}
                                className="border border-gray-200 shadow-sm"
                            >
                                <CardContent className="space-y-3 pt-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {tagihan.ukt_scheme?.nama}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {
                                                    tagihan
                                                        .academic_year_semester
                                                        ?.nama_tahun_akademik
                                                }{' '}
                                                -{' '}
                                                {
                                                    tagihan
                                                        .academic_year_semester
                                                        ?.semester
                                                }
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                STATUS_VARIANTS[
                                                    tagihan.status
                                                ] || 'outline'
                                            }
                                        >
                                            {STATUS_LABELS[tagihan.status] ||
                                                tagihan.status}
                                        </Badge>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900 tabular-nums">
                                        {formatCurrency(tagihan.jumlah_tagihan)}
                                    </p>
                                    {(tagihan.status === 'belum' ||
                                        tagihan.status === 'terlambat') && (
                                        <Button
                                            asChild
                                            size="sm"
                                            className="w-full bg-green-700 hover:bg-green-800"
                                        >
                                            <Link
                                                href={`/mahasiswa/tagihan-ukt/${tagihan.uuid}/bayar`}
                                            >
                                                <CreditCard className="mr-1 h-3.5 w-3.5" />
                                                Bayar Sekarang
                                            </Link>
                                        </Button>
                                    )}
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
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Skema UKT</TableHead>
                                    <TableHead className="text-right">
                                        Jumlah Tagihan
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tagihans.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Receipt className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    Belum ada data tagihan
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Tagihan UKT akan muncul di
                                                    sini setiap semester
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tagihans.map((tagihan) => (
                                        <TableRow key={tagihan.id}>
                                            <TableCell>
                                                <div>
                                                    {
                                                        tagihan
                                                            .academic_year_semester
                                                            ?.nama_tahun_akademik
                                                    }
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Semester{' '}
                                                    {
                                                        tagihan
                                                            .academic_year_semester
                                                            ?.semester
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {tagihan.ukt_scheme?.nama}
                                            </TableCell>
                                            <TableCell className="text-right font-medium tabular-nums">
                                                {formatCurrency(
                                                    tagihan.jumlah_tagihan,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            tagihan.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[
                                                        tagihan.status
                                                    ] || tagihan.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(tagihan.status === 'belum' ||
                                                    tagihan.status ===
                                                        'terlambat') && (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="bg-green-700 hover:bg-green-800"
                                                    >
                                                        <Link
                                                            href={`/mahasiswa/tagihan-ukt/${tagihan.uuid}/bayar`}
                                                        >
                                                            <CreditCard className="mr-1 h-3.5 w-3.5" />
                                                            Bayar Sekarang
                                                        </Link>
                                                    </Button>
                                                )}
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

TagihanUktMahasiswa.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tagihan UKT', href: '/mahasiswa/tagihan-ukt' },
    ],
});
