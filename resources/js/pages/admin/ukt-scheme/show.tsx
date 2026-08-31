import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type UktScheme = {
    id: number;
    uuid: string;
    nama: string;
    jumlah: number;
    keterangan: string | null;
    aktif: boolean;
};

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function UktSchemeShow({ uktScheme }: { uktScheme: UktScheme }) {
    const handleDelete = () => {
        router.delete(`/admin/ukt-scheme/${uktScheme.uuid}`);
    };

    return (
        <>
            <Head title="Detail Skema UKT" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/ukt-scheme">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Detail Skema UKT
                        </h1>
                        <p className="text-muted-foreground">
                            Informasi lengkap skema UKT
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/ukt-scheme/${uktScheme.uuid}/edit`}>
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

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Skema UKT</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama Skema
                                </p>
                                <p className="text-lg font-medium">
                                    {uktScheme.nama}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Jumlah
                                </p>
                                <p className="text-2xl font-bold">
                                    {formatRupiah(uktScheme.jumlah)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <Badge
                                    variant={
                                        uktScheme.aktif
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {uktScheme.aktif ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Keterangan
                                </p>
                                <p>{uktScheme.keterangan || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UktSchemeShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Skema UKT', href: '/admin/ukt-scheme' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
