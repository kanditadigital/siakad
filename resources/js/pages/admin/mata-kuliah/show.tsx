import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type MataKuliah = {
    id: number;
    uuid: string;
    kode_mk: string;
    nama_mk: string;
    jenis: string;
    sks: number;
    semester: number;
    status: string;
    created_at: string;
    updated_at: string;
    program_studi: ProgramStudi;
};

type Props = {
    mataKuliah: MataKuliah;
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    nonaktif: 'Nonaktif',
};
const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = { aktif: 'default', nonaktif: 'secondary' };
const JENIS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = { Wajib: 'default', Pilihan: 'outline' };

export default function MataKuliahShow({ mataKuliah }: Props) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' });

    return (
        <>
            <Head title={`Mata Kuliah - ${mataKuliah.nama_mk}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href="/admin/mata-kuliah"
                            className="mb-2 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            {mataKuliah.nama_mk}
                        </h1>
                        <p className="text-muted-foreground">
                            Kode: {mataKuliah.kode_mk}
                        </p>
                    </div>
                    <Link href={`/admin/mata-kuliah/${mataKuliah.uuid}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Mata Kuliah</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kode Mata Kuliah
                                </p>
                                <p className="font-mono font-medium">
                                    {mataKuliah.kode_mk}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama Mata Kuliah
                                </p>
                                <p className="font-medium">
                                    {mataKuliah.nama_mk}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Program Studi
                                </p>
                                <p>{mataKuliah.program_studi?.nama_prodi}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Jenis
                                </p>
                                <Badge
                                    variant={
                                        JENIS_VARIANTS[mataKuliah.jenis] ||
                                        'outline'
                                    }
                                >
                                    {mataKuliah.jenis}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    SKS
                                </p>
                                <p>{mataKuliah.sks} SKS</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Semester
                                </p>
                                <p>Semester {mataKuliah.semester}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <Badge
                                    variant={
                                        STATUS_VARIANTS[mataKuliah.status] ||
                                        'outline'
                                    }
                                >
                                    {STATUS_LABELS[mataKuliah.status] ||
                                        mataKuliah.status}
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
                                <p className="text-sm text-muted-foreground">
                                    Dibuat Pada
                                </p>
                                <p>{formatDate(mataKuliah.created_at)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Terakhir Diperbarui
                                </p>
                                <p>{formatDate(mataKuliah.updated_at)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

MataKuliahShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Mata Kuliah', href: '/admin/mata-kuliah' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
