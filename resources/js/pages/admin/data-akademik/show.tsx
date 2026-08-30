import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';

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
};

type Props = {
    academicYear: AcademicYear;
};

export default function DataAkademikShow({ academicYear }: Props) {
    const handleDelete = () => {
        router.delete(`/admin/data-akademik/${academicYear.uuid}`, {
            onSuccess: () => {
                router.visit('/admin/data-akademik');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'aktif':
                return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
            case 'nonaktif':
                return <Badge className="bg-gray-100 text-gray-800">Nonaktif</Badge>;
            case 'arsip':
                return <Badge className="bg-yellow-100 text-yellow-800">Arsip</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <>
            <Head title={`${academicYear.nama_tahun_akademik} ${academicYear.semester}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/data-akademik">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {academicYear.nama_tahun_akademik} {academicYear.semester}
                        </h1>
                        <p className="text-muted-foreground">
                            Detail tahun akademik
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/data-akademik/${academicYear.uuid}/edit`}>
                            <Button variant="outline">
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
                                    <AlertDialogTitle>Hapus Tahun Akademik</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Apakah anda yakin ingin menghapus tahun akademik{' '}
                                        {academicYear.nama_tahun_akademik} {academicYear.semester}?
                                        Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Umum</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun Akademik</p>
                                <p className="font-medium">{academicYear.nama_tahun_akademik}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Semester</p>
                                <p className="font-medium">{academicYear.semester}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                {getStatusBadge(academicYear.status)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                                <p className="font-medium">
                                    {new Date(academicYear.tanggal_mulai).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tanggal Selesai</p>
                                <p className="font-medium">
                                    {new Date(academicYear.tanggal_selesai).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Periode</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Periode KRS</p>
                                <p className="font-medium">{academicYear.periode_krs || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Periode Input Nilai</p>
                                <p className="font-medium">{academicYear.periode_input_nilai || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

DataAkademikShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Akademik', href: '/admin/data-akademik' },
        { title: 'Detail', href: '/admin/data-akademik/show' },
    ]}>
        {page}
    </AppLayout>
);
