import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CalendarClock,
    Clock,
    DoorOpen,
    Edit,
    GraduationCap,
    Hash,
    Trash2,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    semester: number;
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
    hari: string | null;
    jam_mulai: string | null;
    jam_selesai: string | null;
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
        if (confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
            router.delete(`/admin-prodi/penjadwalan/${kelas.uuid}`);
        }
    };

    return (
        <>
            <Head title={`Kelas - ${kelas.nama_kelas}`} />

            <div className="space-y-6">
                <Link
                    href="/admin-prodi/penjadwalan"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Penjadwalan
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden py-0 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <CalendarClock className="h-12 w-12 text-siak-pine" />
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">
                                        Kode Kelas
                                    </p>
                                    <p className="font-mono text-lg font-semibold">
                                        {kelas.kode_kelas}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {kelas.nama_kelas}
                                    </h1>
                                    <p className="text-gray-600">
                                        {kelas.mata_kuliah?.nama_mk}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            STATUS_VARIANTS[kelas.status] ||
                                            'outline'
                                        }
                                    >
                                        {kelas.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        • Semester {kelas.semester} •{' '}
                                        {kelas.tahun_akademik}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin-prodi/penjadwalan/${kelas.uuid}/edit`}
                                    >
                                        <Button className="bg-green-700 hover:bg-green-800">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Informasi Kelas */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <CalendarClock className="h-5 w-5 text-green-700" />
                                Informasi Kelas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Hash className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Kode Kelas
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {kelas.kode_kelas}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Users className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Kapasitas
                                    </p>
                                    <p className="text-gray-900">
                                        {kelas.kapasitas} mahasiswa
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Clock className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Semester
                                    </p>
                                    <p className="text-gray-900">
                                        Semester {kelas.semester}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <GraduationCap className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Tahun Akademik
                                    </p>
                                    <p className="text-gray-900">
                                        {kelas.tahun_akademik}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Clock className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Waktu
                                    </p>
                                    <p className="text-gray-900">
                                        {kelas.hari
                                            ? `${kelas.hari}, ${kelas.jam_mulai?.slice(0, 5) ?? '-'} - ${kelas.jam_selesai?.slice(0, 5) ?? '-'}`
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mata Kuliah, Dosen & Ruang */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <BookOpen className="h-5 w-5 text-green-700" />
                                Mata Kuliah, Dosen & Ruang
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <BookOpen className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Mata Kuliah
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {kelas.mata_kuliah?.nama_mk}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {kelas.mata_kuliah?.kode_mk} •{' '}
                                        {kelas.mata_kuliah?.sks} SKS
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <GraduationCap className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Dosen Pengampu
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {kelas.dosen?.nama || '-'}
                                    </p>
                                    {kelas.dosen && (
                                        <p className="text-xs text-gray-500">
                                            NIDN: {kelas.dosen.nidn}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <DoorOpen className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Ruang
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {kelas.ruang?.kode_ruang || '-'}
                                    </p>
                                    {kelas.ruang && (
                                        <p className="text-xs text-gray-500">
                                            {kelas.ruang.nama_ruang}
                                        </p>
                                    )}
                                </div>
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
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Penjadwalan', href: '/admin-prodi/penjadwalan' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
