import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    status: string;
    program_studi: {
        nama_prodi: string;
    };
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    nonaktif: 'Nonaktif',
    lulus: 'Lulus',
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    aktif: 'default',
    cuti: 'secondary',
    nonaktif: 'destructive',
    lulus: 'outline',
};

export default function MahasiswaShow({ mahasiswa }: { mahasiswa: Mahasiswa }) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' });
    };

    return (
        <>
            <Head title={`Mahasiswa - ${mahasiswa.nama}`} />

            <div className="space-y-6">
                <div>
                    <Link href="/admin-prodi/mahasiswa" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold">{mahasiswa.nama}</h1>
                    <p className="text-muted-foreground">NIM: {mahasiswa.nim}</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Diri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">NIM</p>
                                <p className="font-mono font-medium">{mahasiswa.nim}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                                <p className="font-medium">{mahasiswa.nama}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Program Studi</p>
                                <p>{mahasiswa.program_studi?.nama_prodi}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
                                <p>{mahasiswa.jenis_kelamin}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tempat, Tanggal Lahir</p>
                                <p>{mahasiswa.tempat_lahir}, {formatDate(mahasiswa.tanggal_lahir)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Alamat</p>
                                <p>{mahasiswa.alamat}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={STATUS_VARIANTS[mahasiswa.status] || 'outline'}>
                                    {STATUS_LABELS[mahasiswa.status] || mahasiswa.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

MahasiswaShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'Mahasiswa', href: '/admin-prodi/mahasiswa' },
        { title: 'Detail', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
