import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Tendik = {
    id: number;
    uuid: string;
    nip: string;
    nama: string;
    email: string;
    no_telepon: string;
    jenis_kelamin: string;
    jabatan: string;
    unit_kerja: string;
    pendidikan_terakhir: string;
    alamat: string;
    status: string;
    created_at: string;
    updated_at: string;
};

type Props = {
    tendik: Tendik;
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    pensiun: 'Pensiun',
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    aktif: 'default',
    cuti: 'secondary',
    pensiun: 'outline',
};

export default function TendikShow({ tendik }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' });
    };

    return (
        <>
            <Head title={`Tendik - ${tendik.nama}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/tendik" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="text-2xl font-bold">{tendik.nama}</h1>
                        <p className="text-muted-foreground">NIP: {tendik.nip}</p>
                    </div>
                    <Link href={`/admin/tendik/${tendik.uuid}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Diri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">NIP</p>
                                <p className="font-mono font-medium">{tendik.nip}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                                <p className="font-medium">{tendik.nama}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p>{tendik.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">No. Telepon</p>
                                <p>{tendik.no_telepon}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                                <p>{tendik.jenis_kelamin}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Alamat</p>
                                <p>{tendik.alamat}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Kepegawaian</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Jabatan</p>
                                    <p>{tendik.jabatan}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Unit Kerja</p>
                                    <p>{tendik.unit_kerja}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Pendidikan Terakhir</p>
                                    <p>{tendik.pendidikan_terakhir}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={STATUS_VARIANTS[tendik.status] || 'outline'}>
                                        {STATUS_LABELS[tendik.status] || tendik.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Sistem</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Dibuat Pada</p>
                                    <p>{formatDate(tendik.created_at)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                                    <p>{formatDate(tendik.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

TendikShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tendik', href: '/admin/tendik' },
        { title: 'Detail', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
