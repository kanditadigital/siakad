import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
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
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
};

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
};

type Kelas = {
    id: number;
    kode_kelas: string;
    nama_kelas: string;
    mata_kuliah: MataKuliah;
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

type PaginatedData = {
    data: Krs[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    krss: PaginatedData;
    academicYearSemesters: AcademicYearSemester[];
    filters: {
        search?: string;
        status?: string;
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
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

export default function KrsIndex({
    krss,
    academicYearSemesters,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [semesterFilter, setSemesterFilter] = useState(
        filters.academic_year_semester_id || 'all',
    );

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin/krs',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                academic_year_semester_id:
                    semesterFilter === 'all' ? '' : semesterFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/krs/${uuid}`);
    };

    return (
        <>
            <Head title="Data KRS" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data KRS
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola Kartu Rencana Studi mahasiswa
                        </p>
                    </div>
                    <Link href="/admin/krs/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah KRS
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIM atau nama mahasiswa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && applyFilters({ search })
                            }
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={semesterFilter}
                        onValueChange={(v) =>
                            applyFilters({
                                academic_year_semester_id: v === 'all' ? '' : v,
                            })
                        }
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Tahun Akademik" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Tahun Akademik
                            </SelectItem>
                            {academicYearSemesters.map((ays) => (
                                <SelectItem
                                    key={ays.id}
                                    value={ays.id.toString()}
                                >
                                    {ays.nama_tahun_akademik} - Gasal/Genap
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter}
                        onValueChange={(v) =>
                            applyFilters({ status: v === 'all' ? '' : v })
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="disetujui">Disetujui</SelectItem>
                            <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>SKS</TableHead>
                                    <TableHead>Tahun Akademik</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {krss.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="py-8 text-center"
                                        >
                                            Tidak ada data KRS
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    krss.data.map((krs) => (
                                        <TableRow key={krs.id}>
                                            <TableCell className="font-mono font-medium">
                                                {krs.mahasiswa?.nim}
                                            </TableCell>
                                            <TableCell>
                                                {krs.mahasiswa?.nama}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    krs.kelas?.mata_kuliah
                                                        ?.nama_mk
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.kode_kelas}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.mata_kuliah?.sks}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    krs.academic_year_semester
                                                        ?.nama_tahun_akademik
                                                }
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
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/krs/${krs.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/krs/${krs.uuid}/edit`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Hapus KRS
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    KRS ini?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Batal
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            krs.uuid,
                                                                        )
                                                                    }
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {krss.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {krss.data.length} dari {krss.total}{' '}
                            data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: krss.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === krss.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/krs', {
                                            ...filters,
                                            page,
                                        })
                                    }
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

KrsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'KRS', href: '/admin/krs' },
        ]}
    >
        {page}
    </AppLayout>
);
