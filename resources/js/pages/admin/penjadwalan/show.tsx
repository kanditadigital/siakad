import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
};

type Dosen = {
    id: number;
    nama: string;
    nidn: string;
};

type Ruang = {
    id: number;
    kode_ruang: string;
    nama_ruang: string;
    kapasitas: number;
    lantai: string;
    gedung: string;
};

type Kelas = {
    id: number;
    uuid: string;
    kode_kelas: string;
    nama_kelas: string;
    kapasitas: number;
    semester: string;
    tahun_akademik: string;
    status: string;
    mata_kuliah: MataKuliah;
    dosen: Dosen | null;
    ruang: Ruang | null;
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    Aktif: 'default',
    'Tidak Aktif': 'secondary',
    Selesai: 'outline',
};

export default function PenjadwalanShow({ kelas }: { kelas: Kelas }) {
    const handleDelete = () => {
        router.delete(`/admin/penjadwalan/${kelas.uuid}`);
    };

    return (
        <>
            <Head title="Detail Kelas" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/penjadwalan">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Detail Kelas
                        </h1>
                        <p className="text-muted-foreground">
                            Informasi lengkap kelas {kelas.nama_kelas}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/penjadwalan/${kelas.uuid}/edit`}>
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
                            <CardTitle>Informasi Kelas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kode Kelas
                                </p>
                                <p className="font-mono font-medium">
                                    {kelas.kode_kelas}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama Kelas
                                </p>
                                <p className="font-medium">
                                    {kelas.nama_kelas}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kapasitas
                                </p>
                                <p>{kelas.kapasitas} mahasiswa</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Semester
                                </p>
                                <p>Semester {kelas.semester}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tahun Akademik
                                </p>
                                <p>{kelas.tahun_akademik}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <Badge
                                    variant={
                                        STATUS_VARIANTS[kelas.status] ||
                                        'outline'
                                    }
                                >
                                    {kelas.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mata Kuliah & Dosen</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Mata Kuliah
                                </p>
                                <p className="font-medium">
                                    {kelas.mata_kuliah?.nama_mk}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {kelas.mata_kuliah?.kode_mk} •{' '}
                                    {kelas.mata_kuliah?.sks} SKS
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Dosen Pengampu
                                </p>
                                <p className="font-medium">
                                    {kelas.dosen?.nama || '-'}
                                </p>
                                {kelas.dosen && (
                                    <p className="text-sm text-muted-foreground">
                                        NIDN: {kelas.dosen.nidn}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Ruang
                                </p>
                                <p className="font-medium">
                                    {kelas.ruang?.kode_ruang || '-'}
                                </p>
                                {kelas.ruang && (
                                    <p className="text-sm text-muted-foreground">
                                        {kelas.ruang.nama_ruang} • Lantai{' '}
                                        {kelas.ruang.lantai} •{' '}
                                        {kelas.ruang.gedung}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

PenjadwalanShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Penjadwalan', href: '/admin/penjadwalan' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
