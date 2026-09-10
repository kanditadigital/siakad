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
import { Card } from '@/components/ui/card';
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

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type UktScheme = {
    id: number;
    nama: string;
};

type TagihanUkt = {
    id: number;
    uuid: string;
    jumlah_tagihan: number;
    jumlah_bayar: number;
    jatuh_tempo: string;
    status: string;
    mahasiswa: Mahasiswa;
    academic_year_semester: AcademicYearSemester;
    ukt_scheme: UktScheme | null;
};

type PaginatedData = {
    data: TagihanUkt[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    tagihanUkts: PaginatedData;
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
    belum: 'outline',
    lunas: 'default',
    terlambat: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    belum: 'Belum',
    lunas: 'Lunas',
    terlambat: 'Terlambat',
};

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function TagihanUktIndex({
    tagihanUkts,
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
            '/admin/tagihan-ukt',
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
        router.delete(`/admin/tagihan-ukt/${uuid}`);
    };

    return (
        <>
            <Head title="Data Tagihan UKT" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Tagihan UKT
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola tagihan uang kuliah tunggal
                        </p>
                    </div>
                    <Link href="/admin/tagihan-ukt/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Tagihan
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
                                    {ays.nama_tahun_akademik} - {ays.semester}
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
                            <SelectItem value="belum">Belum</SelectItem>
                            <SelectItem value="lunas">Lunas</SelectItem>
                            <SelectItem value="terlambat">Terlambat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="overflow-hidden py-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Tahun Akademik</TableHead>
                                    <TableHead>Skema UKT</TableHead>
                                    <TableHead>Jumlah Tagihan</TableHead>
                                    <TableHead>Jumlah Bayar</TableHead>
                                    <TableHead>Jatuh Tempo</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tagihanUkts.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="py-8 text-center"
                                        >
                                            Tidak ada data tagihan UKT
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tagihanUkts.data.map((tagihan) => (
                                        <TableRow key={tagihan.id}>
                                            <TableCell className="font-mono font-medium">
                                                {tagihan.mahasiswa?.nim}
                                            </TableCell>
                                            <TableCell>
                                                {tagihan.mahasiswa?.nama}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    tagihan
                                                        .academic_year_semester
                                                        ?.nama_tahun_akademik
                                                }{' '}
                                                -{' '}
                                                {
                                                    tagihan
                                                        .academic_year_semester
                                                        ?.semester
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {tagihan.ukt_scheme?.nama ||
                                                    '-'}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatRupiah(
                                                    tagihan.jumlah_tagihan,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatRupiah(
                                                    tagihan.jumlah_bayar,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    tagihan.jatuh_tempo,
                                                ).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            tagihan.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[
                                                        tagihan.status
                                                    ] || tagihan.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/tagihan-ukt/${tagihan.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/tagihan-ukt/${tagihan.uuid}/edit`}
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
                                                                    Hapus
                                                                    Tagihan UKT
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    tagihan UKT
                                                                    ini?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Batal
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            tagihan.uuid,
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
                </Card>

                {tagihanUkts.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {tagihanUkts.data.length} dari{' '}
                            {tagihanUkts.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: tagihanUkts.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === tagihanUkts.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/tagihan-ukt', {
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

TagihanUktIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Tagihan UKT', href: '/admin/tagihan-ukt' },
        ]}
    >
        {page}
    </AppLayout>
);
