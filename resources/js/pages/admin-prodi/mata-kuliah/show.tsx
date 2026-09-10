import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Clock,
    Edit,
    GraduationCap,
    Hash,
    Layers,
    Trash2,
} from 'lucide-react';
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

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) {
            router.delete(`/admin-prodi/mata-kuliah/${mataKuliah.uuid}`);
        }
    };

    return (
        <>
            <Head title={`Mata Kuliah - ${mataKuliah.nama_mk}`} />

            <div className="space-y-6">
                <Link
                    href="/admin-prodi/mata-kuliah"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Mata Kuliah
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden py-0 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <BookOpen className="h-12 w-12 text-siak-pine" />
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">
                                        Kode MK
                                    </p>
                                    <p className="font-mono text-lg font-semibold">
                                        {mataKuliah.kode_mk}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {mataKuliah.nama_mk}
                                    </h1>
                                    <p className="text-gray-600">
                                        {mataKuliah.program_studi?.nama_prodi}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            JENIS_VARIANTS[
                                                mataKuliah.jenis
                                            ] || 'outline'
                                        }
                                    >
                                        {mataKuliah.jenis}
                                    </Badge>
                                    <Badge
                                        variant={
                                            STATUS_VARIANTS[
                                                mataKuliah.status
                                            ] || 'outline'
                                        }
                                    >
                                        {STATUS_LABELS[mataKuliah.status] ||
                                            mataKuliah.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        • {mataKuliah.sks} SKS • Semester{' '}
                                        {mataKuliah.semester}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin-prodi/mata-kuliah/${mataKuliah.uuid}/edit`}
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
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <BookOpen className="h-5 w-5 text-green-700" />
                                Informasi Mata Kuliah
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Hash className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Kode Mata Kuliah
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {mataKuliah.kode_mk}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <BookOpen className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Nama Mata Kuliah
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {mataKuliah.nama_mk}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <GraduationCap className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Program Studi
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {mataKuliah.program_studi?.nama_prodi}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Layers className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        SKS &amp; Semester
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {mataKuliah.sks} SKS • Semester{' '}
                                        {mataKuliah.semester}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Clock className="h-5 w-5 text-green-700" />
                                Informasi Sistem
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Calendar className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Dibuat Pada
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(mataKuliah.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Clock className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Terakhir Diperbarui
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(mataKuliah.updated_at)}
                                    </p>
                                </div>
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
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Mata Kuliah', href: '/admin-prodi/mata-kuliah' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
