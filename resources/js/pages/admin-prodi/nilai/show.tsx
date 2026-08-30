import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Nilai = {
    id: number;
    uuid: string;
    nilai: number | null;
    grade: string | null;
    status: string;
    keterangan: string | null;
    krs: {
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
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    belum: 'outline',
    tercatat: 'default',
};

const STATUS_LABELS: Record<string, string> = {
    belum: 'Belum',
    tercatat: 'Tercatat',
};

const GRADE_COLORS: Record<string, string> = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
};

export default function NilaiShow({ nilai }: { nilai: Nilai }) {
    return (
        <>
            <Head title="Detail Nilai" />

            <div className="space-y-6">
                <div>
                    <Link href="/admin-prodi/nilai" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold">Detail Nilai</h1>
                    <p className="text-muted-foreground">Informasi lengkap nilai mahasiswa</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">NIM</p>
                                <p className="font-mono font-medium">{nilai.krs?.mahasiswa?.nim}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama</p>
                                <p className="font-medium">{nilai.krs?.mahasiswa?.nama}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Program Studi</p>
                                <p>{nilai.krs?.mahasiswa?.program_studi?.nama_prodi}</p>
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
                                <p className="font-medium">{nilai.krs?.kelas?.mata_kuliah?.nama_mk}</p>
                                <p className="text-sm text-muted-foreground">{nilai.krs?.kelas?.mata_kuliah?.kode_mk} • {nilai.krs?.kelas?.mata_kuliah?.sks} SKS</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Kelas</p>
                                <p className="font-mono font-medium">{nilai.krs?.kelas?.kode_kelas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Dosen Pengampu</p>
                                <p className="font-medium">{nilai.krs?.kelas?.dosen?.nama || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Akademik</p>
                                <p>{nilai.krs?.academic_year_semester?.nama_tahun_akademik} - Semester {nilai.krs?.academic_year_semester?.semester}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Nilai</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nilai Angka</p>
                                    <p className="text-2xl font-bold">{nilai.nilai ?? '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Grade</p>
                                    {nilai.grade ? (
                                        <span className={`px-3 py-1 rounded text-sm font-medium ${GRADE_COLORS[nilai.grade] || ''}`}>
                                            {nilai.grade}
                                        </span>
                                    ) : '-'}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={STATUS_VARIANTS[nilai.status] || 'outline'}>
                                        {STATUS_LABELS[nilai.status] || nilai.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Keterangan</p>
                                    <p>{nilai.keterangan || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

NilaiShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'Nilai', href: '/admin-prodi/nilai' },
        { title: 'Detail', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
