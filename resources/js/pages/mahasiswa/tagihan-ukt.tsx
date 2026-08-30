import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Receipt, DollarSign, Clock, CheckCircle } from 'lucide-react';

type TagihanUkt = {
    id: number;
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
    belum_lunas: 'destructive',
    cicilan: 'secondary',
};

const STATUS_LABELS: Record<string, string> = {
    lunas: 'Lunas',
    belum_lunas: 'Belum Lunas',
    cicilan: 'Cicilan',
};

export default function TagihanUktMahasiswa({ tagihans, mahasiswa }: Props) {
    const totalTagihan = tagihans.reduce((sum, t) => sum + t.jumlah_tagihan, 0);
    const totalLunas = tagihans
        .filter((t) => t.status === 'lunas')
        .reduce((sum, t) => sum + t.jumlah_tagihan, 0);
    const totalBelumLunas = tagihans
        .filter((t) => t.status === 'belum_lunas')
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
                    <h1 className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                        Tagihan UKT
                    </h1>
                    <p className="text-siak-sage">
                        {mahasiswa.nama} ({mahasiswa.nim})
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total Tagihan
                            </CardTitle>
                            <Receipt className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {formatCurrency(totalTagihan)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-green-500" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Sudah Lunas
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight text-green-600">
                                {formatCurrency(totalLunas)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-red-500" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Belum Lunas
                            </CardTitle>
                            <Clock className="h-4 w-4 text-red-500/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tracking-tight text-red-600">
                                {formatCurrency(totalBelumLunas)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border-siak-moss/60">
                    <CardHeader>
                        <CardTitle className="text-siak-pine">Daftar Tagihan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tahun Akademik</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Skema UKT</TableHead>
                                    <TableHead>Jumlah Tagihan</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tagihans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            Belum ada data tagihan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tagihans.map((tagihan) => (
                                        <TableRow key={tagihan.id}>
                                            <TableCell>{tagihan.academic_year_semester?.nama_tahun_akademik}</TableCell>
                                            <TableCell>{tagihan.academic_year_semester?.semester}</TableCell>
                                            <TableCell>{tagihan.ukt_scheme?.nama}</TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(tagihan.jumlah_tagihan)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={STATUS_VARIANTS[tagihan.status] || 'outline'}>
                                                    {STATUS_LABELS[tagihan.status] || tagihan.status}
                                                </Badge>
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
