import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle, ClipboardList, Download, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Krs = {
    id: number;
    uuid: string;
    status: string;
    catatan: string | null;
    created_at: string;
    kelas: {
        nama_kelas: string;
        mata_kuliah: {
            kode_mk: string;
            nama_mk: string;
            sks: number;
        };
        dosen: {
            nama: string;
        } | null;
        ruang: {
            kode_ruang: string;
        } | null;
    };
    academic_year_semester: {
        nama_tahun_akademik: string;
        semester: string;
    };
};

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type Props = {
    krss: Krs[];
    mahasiswa: {
        nim: string;
        nama: string;
    };
    academicYearSemesters: AcademicYearSemester[];
    filters: {
        academic_year_semester_id?: string;
    };
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    pending: 'outline',
    disetujui: 'default',
    ditolak: 'destructive',
    revisi: 'outline',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    revisi: 'Perlu Revisi',
};

const CAN_WITHDRAW = ['pending', 'revisi'];

export default function KrsMahasiswa({
    krss,
    mahasiswa,
    academicYearSemesters,
    filters,
}: Props) {
    const [semesterFilter, setSemesterFilter] = useState(
        filters.academic_year_semester_id || 'all',
    );

    const totalSks = krss
        .filter((k) => k.status === 'disetujui')
        .reduce((sum, k) => sum + (k.kelas?.mata_kuliah?.sks || 0), 0);

    const applySemesterFilter = (value: string) => {
        setSemesterFilter(value);
        router.get(
            '/mahasiswa/krs',
            { academic_year_semester_id: value === 'all' ? '' : value },
            { preserveState: true },
        );
    };

    const handleWithdraw = (krs: Krs) => {
        router.delete(`/mahasiswa/krs/${krs.uuid}`);
    };

    const exportHref = filters.academic_year_semester_id
        ? `/mahasiswa/krs/export-pdf?academic_year_semester_id=${filters.academic_year_semester_id}`
        : '/mahasiswa/krs/export-pdf';

    return (
        <>
            <Head title="KRS Mahasiswa" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Kartu Rencana Studi (KRS)
                        </h1>
                        <p className="text-gray-600">
                            {mahasiswa.nama} ({mahasiswa.nim})
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/mahasiswa/krs/create">
                            <Button className="bg-green-700 hover:bg-green-800">
                                <Plus className="mr-2 h-4 w-4" />
                                Ajukan KRS
                            </Button>
                        </Link>
                        <Button variant="outline" asChild>
                            <a href={exportHref} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Cetak PDF
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                {academicYearSemesters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={semesterFilter}
                            onValueChange={applySemesterFilter}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Semua Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Semester
                                </SelectItem>
                                {academicYearSemesters.map((ays) => (
                                    <SelectItem
                                        key={ays.id}
                                        value={ays.id.toString()}
                                    >
                                        {ays.nama_tahun_akademik} - Semester{' '}
                                        {ays.semester}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {filters.academic_year_semester_id && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => applySemesterFilter('all')}
                            >
                                <X className="mr-1 h-3.5 w-3.5" />
                                Reset
                            </Button>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total KRS
                            </CardTitle>
                            <div className="rounded-lg bg-green-600 p-2">
                                <ClipboardList className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {krss.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total SKS Disetujui
                            </CardTitle>
                            <div className="rounded-lg bg-green-700 p-2">
                                <BookOpen className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {totalSks}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Disetujui
                            </CardTitle>
                            <div className="rounded-lg bg-green-800 p-2">
                                <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900 tabular-nums">
                                {
                                    krss.filter((k) => k.status === 'disetujui')
                                        .length
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Mobile card list */}
                <div className="space-y-3 sm:hidden">
                    {krss.length === 0 ? (
                        <Card className="border border-gray-200 shadow-sm">
                            <CardContent className="py-8 text-center text-gray-500">
                                Belum ada data KRS
                            </CardContent>
                        </Card>
                    ) : (
                        krss.map((krs) => (
                            <Card
                                key={krs.id}
                                className="border border-gray-200 shadow-sm"
                            >
                                <CardContent className="space-y-2 pt-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {
                                                    krs.kelas?.mata_kuliah
                                                        ?.nama_mk
                                                }
                                            </p>
                                            <p className="font-mono text-xs text-gray-500">
                                                {
                                                    krs.kelas?.mata_kuliah
                                                        ?.kode_mk
                                                }{' '}
                                                • {krs.kelas?.nama_kelas}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                STATUS_VARIANTS[krs.status] ||
                                                'outline'
                                            }
                                        >
                                            {STATUS_LABELS[krs.status] ||
                                                krs.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>
                                            {krs.kelas?.mata_kuliah?.sks} SKS •{' '}
                                            {krs.kelas?.dosen?.nama || '-'}
                                        </span>
                                        <span>
                                            {
                                                krs.academic_year_semester
                                                    ?.semester
                                            }{' '}
                                            -{' '}
                                            {
                                                krs.academic_year_semester
                                                    ?.nama_tahun_akademik
                                            }
                                        </span>
                                    </div>
                                    {krs.catatan && (
                                        <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-800">
                                            {krs.catatan}
                                        </p>
                                    )}
                                    {CAN_WITHDRAW.includes(krs.status) && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                    Batalkan
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Batalkan KRS
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        KRS untuk{' '}
                                                        {
                                                            krs.kelas
                                                                ?.mata_kuliah
                                                                ?.nama_mk
                                                        }{' '}
                                                        akan dibatalkan. Anda
                                                        dapat mengajukan
                                                        kembali setelahnya.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleWithdraw(krs)
                                                        }
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Ya, Batalkan
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Table (desktop/tablet) */}
                <Card className="hidden overflow-hidden py-0 sm:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead className="text-right">
                                        SKS
                                    </TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Dosen</TableHead>
                                    <TableHead>Ruang</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {krss.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    Belum ada data KRS
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    KRS yang telah disetujui
                                                    akan muncul di sini
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    krss.map((krs) => (
                                        <TableRow key={krs.id}>
                                            <TableCell>
                                                <div>
                                                    {
                                                        krs.kelas?.mata_kuliah
                                                            ?.nama_mk
                                                    }
                                                </div>
                                                <div className="font-mono text-xs text-muted-foreground">
                                                    {
                                                        krs.kelas?.mata_kuliah
                                                            ?.kode_mk
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right tabular-nums">
                                                {krs.kelas?.mata_kuliah?.sks}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.nama_kelas}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.dosen?.nama ||
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.ruang
                                                    ?.kode_ruang || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {
                                                        krs
                                                            .academic_year_semester
                                                            ?.nama_tahun_akademik
                                                    }
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Semester{' '}
                                                    {
                                                        krs
                                                            .academic_year_semester
                                                            ?.semester
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            krs.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[
                                                        krs.status
                                                    ] || krs.status}
                                                </Badge>
                                                {krs.catatan && (
                                                    <p className="mt-1 max-w-[220px] text-xs text-amber-700">
                                                        {krs.catatan}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {CAN_WITHDRAW.includes(
                                                    krs.status,
                                                ) && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Batalkan"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Batalkan
                                                                    KRS
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    KRS untuk{' '}
                                                                    {
                                                                        krs
                                                                            .kelas
                                                                            ?.mata_kuliah
                                                                            ?.nama_mk
                                                                    }{' '}
                                                                    akan
                                                                    dibatalkan.
                                                                    Anda dapat
                                                                    mengajukan
                                                                    kembali
                                                                    setelahnya.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Batal
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleWithdraw(
                                                                            krs,
                                                                        )
                                                                    }
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Ya,
                                                                    Batalkan
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </>
    );
}

KrsMahasiswa.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KRS', href: '/mahasiswa/krs' },
    ],
});
