import { Head, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    User,
    CreditCard,
    Calendar,
    FileText,
    Download,
    Paperclip,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Pembayaran = {
    id: number;
    uuid: string;
    jumlah_bayar: number;
    tanggal_bayar: string;
    metode_pembayaran: string;
    bukti_pembayaran: string | null;
    status: string;
    keterangan: string | null;
    created_at: string;
    mahasiswa: {
        nim: string;
        nama: string;
        program_studi: {
            nama_prodi: string;
        };
    };
    tagihan_ukt: {
        jumlah_tagihan: number;
        academic_year_semester: {
            nama_tahun_akademik: string;
            semester: string;
        };
        ukt_scheme: {
            nama: string;
        };
    };
};

type Props = {
    pembayaran: Pembayaran;
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

export default function PembayaranShow({ pembayaran }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleVerify = () => {
        router.patch(`/admin/pembayaran/${pembayaran.uuid}/verify`, {
            keterangan: 'Pembayaran diverifikasi',
        });
    };

    const handleReject = () => {
        router.patch(`/admin/pembayaran/${pembayaran.uuid}/reject`, {
            keterangan: 'Pembayaran ditolak',
        });
    };

    return (
        <>
            <Head title="Detail Pembayaran" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Detail Pembayaran
                        </h1>
                        <p className="text-gray-600">
                            {pembayaran.mahasiswa?.nama} (
                            {pembayaran.mahasiswa?.nim})
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {pembayaran.status === 'verified' && (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    (window.location.href = `/admin/pembayaran/${pembayaran.uuid}/kuitansi`)
                                }
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Cetak Kuitansi
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => router.get('/admin/pembayaran')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Info Mahasiswa */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <User className="h-5 w-5 text-green-700" />
                                Info Mahasiswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">NIM</p>
                                <p className="font-mono font-medium text-gray-900">
                                    {pembayaran.mahasiswa?.nim}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Nama</p>
                                <p className="font-medium text-gray-900">
                                    {pembayaran.mahasiswa?.nama}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Program Studi
                                </p>
                                <p className="font-medium text-gray-900">
                                    {
                                        pembayaran.mahasiswa?.program_studi
                                            ?.nama_prodi
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Pembayaran */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <CreditCard className="h-5 w-5 text-green-700" />
                                Info Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Tanggal Bayar
                                </p>
                                <p className="font-medium text-gray-900">
                                    {pembayaran.tanggal_bayar}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Jumlah Bayar
                                </p>
                                <p className="text-lg font-medium text-green-700">
                                    {formatCurrency(pembayaran.jumlah_bayar)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Metode Pembayaran
                                </p>
                                <p className="font-medium text-gray-900 capitalize">
                                    {pembayaran.metode_pembayaran}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <Badge
                                    variant={
                                        STATUS_VARIANTS[pembayaran.status] ||
                                        'outline'
                                    }
                                >
                                    {STATUS_LABELS[pembayaran.status] ||
                                        pembayaran.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Info Tagihan */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <FileText className="h-5 w-5 text-green-700" />
                                Info Tagihan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Tahun Akademik
                                </p>
                                <p className="font-medium text-gray-900">
                                    {
                                        pembayaran.tagihan_ukt
                                            ?.academic_year_semester
                                            ?.nama_tahun_akademik
                                    }{' '}
                                    -{' '}
                                    {
                                        pembayaran.tagihan_ukt
                                            ?.academic_year_semester?.semester
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Skema UKT
                                </p>
                                <p className="font-medium text-gray-900">
                                    {pembayaran.tagihan_ukt?.ukt_scheme?.nama}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Jumlah Tagihan
                                </p>
                                <p className="font-medium text-gray-900">
                                    {formatCurrency(
                                        pembayaran.tagihan_ukt?.jumlah_tagihan,
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Keterangan */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Calendar className="h-5 w-5 text-green-700" />
                                Keterangan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-gray-900">
                                {pembayaran.keterangan || '-'}
                            </p>
                            {pembayaran.bukti_pembayaran && (
                                <a
                                    href={`/storage/${pembayaran.bukti_pembayaran}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline"
                                >
                                    <Paperclip className="h-4 w-4" />
                                    Lihat Bukti Pembayaran
                                </a>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                {pembayaran.status === 'pending' && (
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">
                                Aksi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleVerify}
                                    className="bg-green-700 hover:bg-green-800"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Verifikasi
                                </Button>
                                <Button
                                    onClick={handleReject}
                                    variant="destructive"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Tolak
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

PembayaranShow.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pembayaran', href: '/admin/pembayaran' },
        { title: 'Detail', href: '#' },
    ],
});
