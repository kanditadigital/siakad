import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    ClipboardList,
    Edit,
    GraduationCap,
    Hash,
    School,
    Trash2,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

export default function KrsShow({ krs }: { krs: Krs }) {
    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus KRS ini?')) {
            router.delete(`/admin/krs/${krs.uuid}`);
        }
    };

    return (
        <>
            <Head title={`KRS - ${krs.mahasiswa?.nama}`} />

            <div className="space-y-6">
                <Link
                    href="/admin/krs"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar KRS
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden py-0 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <ClipboardList className="h-12 w-12 text-siak-pine" />
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIM</p>
                                    <p className="font-mono text-lg font-semibold">
                                        {krs.mahasiswa?.nim}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {krs.mahasiswa?.nama}
                                    </h1>
                                    <p className="text-gray-600">
                                        {krs.kelas?.mata_kuliah?.nama_mk}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="border-green-200 text-green-700"
                                    >
                                        {STATUS_LABELS[krs.status] ||
                                            krs.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        •{' '}
                                        {
                                            krs.academic_year_semester
                                                ?.nama_tahun_akademik
                                        }{' '}
                                        - Semester{' '}
                                        {krs.academic_year_semester?.semester}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/admin/krs/${krs.uuid}/edit`}>
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
                    {/* Informasi Mahasiswa */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <User className="h-5 w-5 text-green-700" />
                                Informasi Mahasiswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Hash className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        NIM
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {krs.mahasiswa?.nim}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <User className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Nama
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {krs.mahasiswa?.nama}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <School className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Program Studi
                                    </p>
                                    <p className="text-gray-900">
                                        {
                                            krs.mahasiswa?.program_studi
                                                ?.nama_prodi
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mata Kuliah & Kelas */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <BookOpen className="h-5 w-5 text-green-700" />
                                Mata Kuliah & Kelas
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
                                        {krs.kelas?.mata_kuliah?.nama_mk}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {krs.kelas?.mata_kuliah?.kode_mk} •{' '}
                                        {krs.kelas?.mata_kuliah?.sks} SKS
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Hash className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Kode Kelas
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {krs.kelas?.kode_kelas}
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
                                        {krs.kelas?.dosen?.nama || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Calendar className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Tahun Akademik
                                    </p>
                                    <p className="text-gray-900">
                                        {
                                            krs.academic_year_semester
                                                ?.nama_tahun_akademik
                                        }{' '}
                                        - Semester{' '}
                                        {krs.academic_year_semester?.semester}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <ClipboardList className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Status
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="border-green-200 text-green-700"
                                    >
                                        {STATUS_LABELS[krs.status] ||
                                            krs.status}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

KrsShow.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KRS', href: '/admin/krs' },
        { title: 'Detail', href: '#' },
    ],
});
