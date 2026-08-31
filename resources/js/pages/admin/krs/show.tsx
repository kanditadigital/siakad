import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
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

type Kelas = {
    id: number;
    kode_kelas: string;
    nama_kelas: string;
    mata_kuliah: MataKuliah;
    dosen: Dosen | null;
};

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type Krs = {
    id: number;
    uuid: string;
    status: string;
    mahasiswa: Mahasiswa;
    kelas: Kelas;
    academic_year_semester: AcademicYearSemester;
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    pending: 'outline',
    disetujui: 'default',
    ditolak: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

export default function KrsShow({ krs }: { krs: Krs }) {
    const handleDelete = () => {
        router.delete(`/admin/krs/${krs.uuid}`);
    };

    return (
        <>
            <Head title="Detail KRS" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/krs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Detail KRS
                        </h1>
                        <p className="text-muted-foreground">
                            Informasi lengkap Kartu Rencana Studi
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/krs/${krs.uuid}/edit`}>
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
                                    {krs.mahasiswa?.nim}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama
                                </p>
                                <p className="font-medium">
                                    {krs.mahasiswa?.nama}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Program Studi
                                </p>
                                <p>
                                    {krs.mahasiswa?.program_studi?.nama_prodi}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mata Kuliah & Kelas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Mata Kuliah
                                </p>
                                <p className="font-medium">
                                    {krs.kelas?.mata_kuliah?.nama_mk}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {krs.kelas?.mata_kuliah?.kode_mk} •{' '}
                                    {krs.kelas?.mata_kuliah?.sks} SKS
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kode Kelas
                                </p>
                                <p className="font-mono font-medium">
                                    {krs.kelas?.kode_kelas}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Dosen Pengampu
                                </p>
                                <p className="font-medium">
                                    {krs.kelas?.dosen?.nama || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tahun Akademik
                                </p>
                                <p>
                                    {
                                        krs.academic_year_semester
                                            ?.nama_tahun_akademik
                                    }{' '}
                                    - Semester{' '}
                                    {krs.academic_year_semester?.semester}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <Badge
                                    variant={
                                        STATUS_VARIANTS[krs.status] || 'outline'
                                    }
                                >
                                    {STATUS_LABELS[krs.status] || krs.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

KrsShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'KRS', href: '/admin/krs' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
