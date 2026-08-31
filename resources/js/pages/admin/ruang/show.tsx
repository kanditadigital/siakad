import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type Ruang = {
    id: number;
    uuid: string;
    kode_ruang: string;
    nama_ruang: string;
    kapasitas: number;
    lantai: string;
    gedung: string;
};

export default function RuangShow({ ruang }: { ruang: Ruang }) {
    const handleDelete = () => {
        router.delete(`/admin/ruang/${ruang.uuid}`);
    };

    return (
        <>
            <Head title="Detail Ruang" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/ruang">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Detail Ruang
                        </h1>
                        <p className="text-muted-foreground">
                            Informasi lengkap ruang {ruang.nama_ruang}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/ruang/${ruang.uuid}/edit`}>
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
                        <CardTitle>Informasi Ruang</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kode Ruang
                                </p>
                                <p className="font-mono text-lg font-medium">
                                    {ruang.kode_ruang}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama Ruang
                                </p>
                                <p className="text-lg font-medium">
                                    {ruang.nama_ruang}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Gedung
                                </p>
                                <p className="font-medium">{ruang.gedung}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Lantai
                                </p>
                                <p className="font-medium">{ruang.lantai}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kapasitas
                                </p>
                                <p className="font-medium">
                                    {ruang.kapasitas} orang
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RuangShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Ruang', href: '/admin/ruang' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
