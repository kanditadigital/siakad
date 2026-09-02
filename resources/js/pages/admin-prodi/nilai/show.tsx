import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    BookOpen,
    Calendar,
    FileText,
    GraduationCap,
    Hash,
    School,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
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
            <Head title={`Nilai - ${nilai.krs?.mahasiswa?.nama}`} />

            <div className="space-y-6">
                <Link
                    href="/admin-prodi/nilai"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Nilai
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <Award className="h-12 w-12 text-siak-pine" />
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIM</p>
                                    <p className="font-mono text-lg font-semibold">
                                        {nilai.krs?.mahasiswa?.nim}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {nilai.krs?.mahasiswa?.nama}
                                    </h1>
                                    <p className="text-gray-600">
                                        {
                                            nilai.krs?.kelas?.mata_kuliah
                                                ?.nama_mk
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            STATUS_VARIANTS[nilai.status] ||
                                            'outline'
                                        }
                                    >
                                        {STATUS_LABELS[nilai.status] ||
                                            nilai.status}
                                    </Badge>
                                    {nilai.grade && (
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}
                                        >
                                            Grade {nilai.grade}
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-500">
                                        •{' '}
                                        {
                                            nilai.krs?.academic_year_semester
                                                ?.nama_tahun_akademik
                                        }{' '}
                                        - Semester{' '}
                                        {
                                            nilai.krs?.academic_year_semester
                                                ?.semester
                                        }
                                    </span>
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
                                        {nilai.krs?.mahasiswa?.nim}
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
                                        {nilai.krs?.mahasiswa?.nama}
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
                                            nilai.krs?.mahasiswa
                                                ?.program_studi?.nama_prodi
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
                                        {
                                            nilai.krs?.kelas?.mata_kuliah
                                                ?.nama_mk
                                        }
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {
                                            nilai.krs?.kelas?.mata_kuliah
                                                ?.kode_mk
                                        }{' '}
                                        •{' '}
                                        {nilai.krs?.kelas?.mata_kuliah?.sks}{' '}
                                        SKS
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
                                        {nilai.krs?.kelas?.kode_kelas}
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
                                        {nilai.krs?.kelas?.dosen?.nama || '-'}
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
                                            nilai.krs?.academic_year_semester
                                                ?.nama_tahun_akademik
                                        }{' '}
                                        - Semester{' '}
                                        {
                                            nilai.krs?.academic_year_semester
                                                ?.semester
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Nilai */}
                    <Card className="border border-gray-200 shadow-sm md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Award className="h-5 w-5 text-green-700" />
                                Nilai
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Hash className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Nilai Angka
                                        </p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {nilai.nilai ?? '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Award className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Grade
                                        </p>
                                        {nilai.grade ? (
                                            <span
                                                className={`inline-block rounded px-2 py-1 text-sm font-medium ${GRADE_COLORS[nilai.grade] || ''}`}
                                            >
                                                {nilai.grade}
                                            </span>
                                        ) : (
                                            <p className="text-gray-900">-</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Award className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Status
                                        </p>
                                        <Badge
                                            variant={
                                                STATUS_VARIANTS[
                                                    nilai.status
                                                ] || 'outline'
                                            }
                                        >
                                            {STATUS_LABELS[nilai.status] ||
                                                nilai.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <FileText className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Keterangan
                                        </p>
                                        <p className="text-gray-900">
                                            {nilai.keterangan || '-'}
                                        </p>
                                    </div>
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
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Nilai', href: '/admin-prodi/nilai' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
