import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    CalendarDays,
    Calendar,
    Clock,
    FileText,
    Trash2,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AcademicYear = {
    id: number;
    uuid: string;
    nama_tahun_akademik: string;
    semester: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: string;
    periode_krs: string | null;
    periode_input_nilai: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    academicYear: AcademicYear;
};

export default function DataAkademikShow({ academicYear }: Props) {
    const handleDelete = () => {
        router.delete(`/admin/data-akademik/${academicYear.uuid}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'aktif':
                return (
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                );
            case 'nonaktif':
                return (
                    <Badge className="bg-gray-100 text-gray-800">
                        Nonaktif
                    </Badge>
                );
            case 'arsip':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Arsip
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <>
            <Head
                title={`Tahun Akademik - ${academicYear.nama_tahun_akademik} ${academicYear.semester}`}
            />

            <div className="space-y-6">
                <Link
                    href="/admin/data-akademik"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Data Akademik
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden py-0 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <CalendarDays className="h-12 w-12 text-siak-pine" />
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">
                                        Semester
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {academicYear.semester}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {academicYear.nama_tahun_akademik}
                                    </h1>
                                    <p className="text-gray-600">
                                        Tahun Akademik {academicYear.semester}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(academicYear.status)}
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/data-akademik/${academicYear.uuid}/edit`}
                                    >
                                        <Button className="bg-green-700 hover:bg-green-800">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Hapus
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Hapus Tahun Akademik
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Apakah anda yakin ingin
                                                    menghapus tahun akademik{' '}
                                                    {
                                                        academicYear.nama_tahun_akademik
                                                    }{' '}
                                                    {academicYear.semester}?
                                                    Tindakan ini tidak dapat
                                                    dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Batal
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDelete}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Hapus
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Info Utama */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <CalendarDays className="h-5 w-5 text-green-700" />
                                Informasi Umum
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <CalendarDays className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Tahun Akademik
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {academicYear.nama_tahun_akademik}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Calendar className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Semester
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {academicYear.semester}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Clock className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Status
                                    </p>
                                    {getStatusBadge(academicYear.status)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Jadwal */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Clock className="h-5 w-5 text-green-700" />
                                    Jadwal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Calendar className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Tanggal Mulai
                                        </p>
                                        <p className="text-gray-900">
                                            {new Date(
                                                academicYear.tanggal_mulai,
                                            ).toLocaleDateString('id-ID', {
                                                dateStyle: 'full',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Calendar className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Tanggal Selesai
                                        </p>
                                        <p className="text-gray-900">
                                            {new Date(
                                                academicYear.tanggal_selesai,
                                            ).toLocaleDateString('id-ID', {
                                                dateStyle: 'full',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Periode */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <FileText className="h-5 w-5 text-green-700" />
                                    Periode
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <FileText className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Periode KRS
                                        </p>
                                        <p className="text-gray-900">
                                            {academicYear.periode_krs || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <FileText className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Periode Input Nilai
                                        </p>
                                        <p className="text-gray-900">
                                            {academicYear.periode_input_nilai ||
                                                '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informasi Sistem */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Clock className="h-5 w-5 text-green-700" />
                                    Informasi Sistem
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Dibuat Pada
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(
                                            academicYear.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            dateStyle: 'full',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Terakhir Diperbarui
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(
                                            academicYear.updated_at,
                                        ).toLocaleDateString('id-ID', {
                                            dateStyle: 'full',
                                        })}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

DataAkademikShow.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Akademik', href: '/admin/data-akademik' },
        { title: 'Detail', href: '#' },
    ],
});
