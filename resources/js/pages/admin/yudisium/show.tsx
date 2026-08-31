import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
    program_studi: {
        nama_prodi: string;
    };
};

type Yudisium = {
    id: number;
    uuid: string;
    tanggal_yudisium: string;
    ipk: number;
    total_sks: number;
    judul_skripsi: string | null;
    status: string;
    predikat: string | null;
    keterangan: string | null;
    mahasiswa: Mahasiswa;
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    lulus: 'default',
    'tidak lulus': 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    lulus: 'Lulus',
    'tidak lulus': 'Tidak Lulus',
};

export default function YudisiumShow({ yudisium }: { yudisium: Yudisium }) {
    const handleDelete = () => {
        router.delete(`/admin/yudisium/${yudisium.uuid}`);
    };

    return (
        <>
            <Head title="Detail Yudisium" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/yudisium">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Detail Yudisium
                        </h1>
                        <p className="text-muted-foreground">
                            Informasi lengkap yudisium mahasiswa
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {yudisium.status === 'lulus' && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        (window.location.href = `/admin/yudisium/${yudisium.uuid}/berita-acara`)
                                    }
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Berita Acara
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        (window.location.href = `/admin/yudisium/${yudisium.uuid}/sk`)
                                    }
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    SK Yudisium
                                </Button>
                            </>
                        )}
                        <Link href={`/admin/yudisium/${yudisium.uuid}/edit`}>
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

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    NIM
                                </p>
                                <p className="font-mono font-medium">
                                    {yudisium.mahasiswa?.nim}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama
                                </p>
                                <p className="font-medium">
                                    {yudisium.mahasiswa?.nama}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Program Studi
                                </p>
                                <p>
                                    {
                                        yudisium.mahasiswa?.program_studi
                                            ?.nama_prodi
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Yudisium</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tanggal Yudisium
                                </p>
                                <p className="font-medium">
                                    {new Date(
                                        yudisium.tanggal_yudisium,
                                    ).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    IPK
                                </p>
                                <p className="text-2xl font-bold tabular-nums">
                                    {Number(yudisium.ipk).toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total SKS
                                </p>
                                <p className="font-medium">
                                    {yudisium.total_sks}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Predikat
                                </p>
                                <p className="font-medium">
                                    {yudisium.predikat || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <Badge
                                    variant={
                                        STATUS_VARIANTS[yudisium.status] ||
                                        'outline'
                                    }
                                >
                                    {STATUS_LABELS[yudisium.status] ||
                                        yudisium.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {yudisium.judul_skripsi && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Judul Skripsi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{yudisium.judul_skripsi}</p>
                            </CardContent>
                        </Card>
                    )}

                    {yudisium.keterangan && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Keterangan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{yudisium.keterangan}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

YudisiumShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Yudisium', href: '/admin/yudisium' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
