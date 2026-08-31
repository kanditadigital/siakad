import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Receipt, Clock, CheckCircle, CreditCard } from 'lucide-react';

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

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
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
                    <h1 className="text-2xl font-bold text-green-800">
                        Tagihan UKT
                    </h1>
                    <p className="text-gray-600">
                        {mahasiswa.nama} ({mahasiswa.nim})
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Tagihan
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-green-600">
                                <Receipt className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatCurrency(totalTagihan)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Sudah Lunas
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-green-500">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(totalLunas)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Belum Lunas
                            </CardTitle>
                            <div className="p-2 rounded-lg bg-red-500">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(totalBelumLunas)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Daftar Tagihan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-gray-600">Tahun Akademik</TableHead>
                                    <TableHead className="text-gray-600">Semester</TableHead>
                                    <TableHead className="text-gray-600">Skema UKT</TableHead>
                                    <TableHead className="text-gray-600">Jumlah Tagihan</TableHead>
                                    <TableHead className="text-gray-600">Status</TableHead>
                                    <TableHead className="text-gray-600">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tagihans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            Belum ada data tagihan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tagihans.map((tagihan) => (
                                        <TableRow key={tagihan.id}>
                                            <TableCell className="text-gray-900">{tagihan.academic_year_semester?.nama_tahun_akademik}</TableCell>
                                            <TableCell className="text-gray-900">{tagihan.academic_year_semester?.semester}</TableCell>
                                            <TableCell className="text-gray-900">{tagihan.ukt_scheme?.nama}</TableCell>
                                            <TableCell className="font-medium text-gray-900">
                                                {formatCurrency(tagihan.jumlah_tagihan)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={STATUS_VARIANTS[tagihan.status] || 'outline'}>
                                                    {STATUS_LABELS[tagihan.status] || tagihan.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {(tagihan.status === 'belum' || tagihan.status === 'terlambat') && (
                                                    <Button asChild size="sm" className="bg-green-700 hover:bg-green-800">
                                                        <Link href={`/mahasiswa/tagihan-ukt/${tagihan.uuid}/bayar`}>
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
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TagihanUktMahasiswa.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tagihan UKT', href: '/mahasiswa/tagihan-ukt' },
    ],
});
