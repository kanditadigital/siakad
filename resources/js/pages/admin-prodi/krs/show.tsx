import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Krs = {
    id: number;
    uuid: string;
    status: string;
    mahasiswa: {
        nim: string;
        nama: string;
        program_studi: {
            nama_prodi: string;
        };
    };
    kelas: {
        kode_kelas: string;
        nama_kelas: string;
        mata_kuliah: {
            kode_mk: string;
            nama_mk: string;
            sks: number;
        };
        dosen: {
            nama: string;
        } | null;
    };
    academic_year_semester: {
        nama_tahun_akademik: string;
        semester: string;
    };
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
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
    return (
        <>
            <Head title="Detail KRS" />

            <div className="space-y-6">
                <div>
                    <Link href="/admin-prodi/krs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold">Detail KRS</h1>
                    <p className="text-muted-foreground">Informasi lengkap Kartu Rencana Studi</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">NIM</p>
                                <p className="font-mono font-medium">{krs.mahasiswa?.nim}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama</p>
                                <p className="font-medium">{krs.mahasiswa?.nama}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Program Studi</p>
                                <p>{krs.mahasiswa?.program_studi?.nama_prodi}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mata Kuliah & Kelas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Mata Kuliah</p>
                                <p className="font-medium">{krs.kelas?.mata_kuliah?.nama_mk}</p>
                                <p className="text-sm text-muted-foreground">{krs.kelas?.mata_kuliah?.kode_mk} • {krs.kelas?.mata_kuliah?.sks} SKS</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Kelas</p>
                                <p className="font-mono font-medium">{krs.kelas?.kode_kelas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Dosen Pengampu</p>
                                <p className="font-medium">{krs.kelas?.dosen?.nama || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Akademik</p>
                                <p>{krs.academic_year_semester?.nama_tahun_akademik} - Semester {krs.academic_year_semester?.semester}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={STATUS_VARIANTS[krs.status] || 'outline'}>
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
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'KRS', href: '/admin-prodi/krs' },
        { title: 'Detail', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
