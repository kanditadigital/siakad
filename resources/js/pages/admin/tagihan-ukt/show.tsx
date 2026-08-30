import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
    program_studi: {
        nama_prodi: string;
    };
};

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type UktScheme = {
    id: number;
    nama: string;
};

type TagihanUkt = {
    id: number;
    uuid: string;
    jumlah_tagihan: number;
    jumlah_bayar: number;
    jatuh_tempo: string;
    status: string;
    keterangan: string | null;
    mahasiswa: Mahasiswa;
    academic_year_semester: AcademicYearSemester;
    ukt_scheme: UktScheme | null;
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    belum: 'outline',
    lunas: 'default',
    terlambat: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    belum: 'Belum',
    lunas: 'Lunas',
    terlambat: 'Terlambat',
};

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function TagihanUktShow({ tagihanUkt }: { tagihanUkt: TagihanUkt }) {
    const handleDelete = () => {
        router.delete(`/admin/tagihan-ukt/${tagihanUkt.uuid}`);
    };

    const sisaTagihan = tagihanUkt.jumlah_tagihan - tagihanUkt.jumlah_bayar;

    return (
        <>
            <Head title="Detail Tagihan UKT" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tagihan-ukt">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">Detail Tagihan UKT</h1>
                        <p className="text-muted-foreground">Informasi lengkap tagihan UKT</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/tagihan-ukt/${tagihanUkt.uuid}/edit`}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">NIM</p>
                                <p className="font-mono font-medium">{tagihanUkt.mahasiswa?.nim}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama</p>
                                <p className="font-medium">{tagihanUkt.mahasiswa?.nama}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Program Studi</p>
                                <p>{tagihanUkt.mahasiswa?.program_studi?.nama_prodi}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tagihan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Akademik</p>
                                <p className="font-medium">{tagihanUkt.academic_year_semester?.nama_tahun_akademik} - {tagihanUkt.academic_year_semester?.semester}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Skema UKT</p>
                                <p className="font-medium">{tagihanUkt.ukt_scheme?.nama || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jumlah Tagihan</p>
                                <p className="text-2xl font-bold">{formatRupiah(tagihanUkt.jumlah_tagihan)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jumlah Bayar</p>
                                <p className="font-medium">{formatRupiah(tagihanUkt.jumlah_bayar)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Sisa Tagihan</p>
                                <p className="font-medium text-red-600">{formatRupiah(sisaTagihan > 0 ? sisaTagihan : 0)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
                                <p>{new Date(tagihanUkt.jatuh_tempo).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={STATUS_VARIANTS[tagihanUkt.status] || 'outline'}>{STATUS_LABELS[tagihanUkt.status] || tagihanUkt.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {tagihanUkt.keterangan && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Keterangan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{tagihanUkt.keterangan}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

TagihanUktShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tagihan UKT', href: '/admin/tagihan-ukt' },
        { title: 'Detail', href: '#' },
    ]}>{page}</AppLayout>
);
