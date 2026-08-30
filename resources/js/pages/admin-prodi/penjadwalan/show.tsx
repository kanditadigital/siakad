import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Kelas = {
    id: number;
    uuid: string;
    kode_kelas: string;
    nama_kelas: string;
    semester: string;
    tahun_akademik: string;
    kapasitas: number;
    status: string;
    mata_kuliah: {
        kode_mk: string;
        nama_mk: string;
        sks: number;
        semester: number;
    };
    dosen: {
        nama: string;
        nidn: string;
    } | null;
    ruang: {
        kode_ruang: string;
        nama_ruang: string;
    } | null;
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Aktif: 'default',
    'Tidak Aktif': 'secondary',
    Selesai: 'outline',
};

export default function PenjadwalanShow({ kelas }: { kelas: Kelas }) {
    return (
        <>
            <Head title="Detail Penjadwalan" />

            <div className="space-y-6">
                <div>
                    <Link href="/admin-prodi/penjadwalan" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold">Detail Penjadwalan</h1>
                    <p className="text-muted-foreground">Informasi lengkap kelas perkuliahan</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kelas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Kode Kelas</p>
                                <p className="font-mono font-medium">{kelas.kode_kelas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Kelas</p>
                                <p className="font-medium">{kelas.nama_kelas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Akademik</p>
                                <p>{kelas.tahun_akademik} - Semester {kelas.semester}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Kapasitas</p>
                                <p>{kelas.kapasitas} mahasiswa</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={STATUS_VARIANTS[kelas.status] || 'outline'}>
                                    {kelas.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Mata Kuliah</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Kode MK</p>
                                <p className="font-mono font-medium">{kelas.mata_kuliah?.kode_mk}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Mata Kuliah</p>
                                <p className="font-medium">{kelas.mata_kuliah?.nama_mk}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">SKS</p>
                                <p>{kelas.mata_kuliah?.sks} SKS</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Semester Mata Kuliah</p>
                                <p>Semester {kelas.mata_kuliah?.semester}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dosen Pengampu</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {kelas.dosen ? (
                                <>
                                    <div>
                                        <p className="text-sm text-muted-foreground">NIDN</p>
                                        <p className="font-mono font-medium">{kelas.dosen.nidn}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nama Dosen</p>
                                        <p className="font-medium">{kelas.dosen.nama}</p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground">Belum ditentukan</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ruang</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {kelas.ruang ? (
                                <>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Kode Ruang</p>
                                        <p className="font-mono font-medium">{kelas.ruang.kode_ruang}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nama Ruang</p>
                                        <p className="font-medium">{kelas.ruang.nama_ruang}</p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground">Belum ditentukan</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

PenjadwalanShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'Penjadwalan', href: '/admin-prodi/penjadwalan' },
        { title: 'Detail', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
