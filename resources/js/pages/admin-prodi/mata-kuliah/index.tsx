import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
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

type MataKuliah = {
    id: number;
    uuid: string;
    kode_mk: string;
    nama_mk: string;
    jenis: string;
    sks: number;
    semester: number;
    status: string;
};

type PaginatedData = {
    data: MataKuliah[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    mataKuliahs: PaginatedData;
    filters: {
        search?: string;
        status?: string;
        jenis?: string;
        semester?: string;
    };
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    nonaktif: 'Nonaktif',
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    aktif: 'default',
    nonaktif: 'secondary',
};

const JENIS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    Wajib: 'default',
    Pilihan: 'outline',
};

export default function MataKuliahIndex({ mataKuliahs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [jenisFilter, setJenisFilter] = useState(filters.jenis || 'all');
    const [semesterFilter, setSemesterFilter] = useState(
        filters.semester || 'all',
    );

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin-prodi/mata-kuliah',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                jenis: jenisFilter === 'all' ? '' : jenisFilter,
                semester: semesterFilter === 'all' ? '' : semesterFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin-prodi/mata-kuliah/${uuid}`);
    };

    const hasActiveFilters = Boolean(
        filters.search || filters.status || filters.jenis || filters.semester,
    );

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setJenisFilter('all');
        setSemesterFilter('all');
        router.get('/admin-prodi/mata-kuliah');
    };

    return (
        <>
            <Head title="Data Mata Kuliah" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Mata Kuliah
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola kurikulum mata kuliah program studi
                        </p>
                    </div>
                    <Link href="/admin-prodi/mata-kuliah/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Mata Kuliah
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode atau nama mata kuliah..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && applyFilters({ search })
                            }
                            className="pl-9"
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => applyFilters({ search })}
                    >
                        Cari
                    </Button>
                    <Select
                        value={jenisFilter}
                        onValueChange={(v) => {
                            setJenisFilter(v);
                            applyFilters({ jenis: v === 'all' ? '' : v });
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Semua Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jenis</SelectItem>
                            <SelectItem value="Wajib">Wajib</SelectItem>
                            <SelectItem value="Pilihan">Pilihan</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={semesterFilter}
                        onValueChange={(v) => {
                            setSemesterFilter(v);
                            applyFilters({ semester: v === 'all' ? '' : v });
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Semua Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Semester</SelectItem>
                            {Array.from({ length: 8 }, (_, i) => i + 1).map(
                                (s) => (
                                    <SelectItem key={s} value={s.toString()}>
                                        Semester {s}
                                    </SelectItem>
                                ),
                            )}
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter}
                        onValueChange={(v) => {
                            setStatusFilter(v);
                            applyFilters({ status: v === 'all' ? '' : v });
                        }}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                        >
                            <X className="mr-1 h-3.5 w-3.5" />
                            Reset
                        </Button>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode MK</TableHead>
                                    <TableHead>Nama Mata Kuliah</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>SKS</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mataKuliahs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {hasActiveFilters
                                                        ? 'Tidak ada mata kuliah yang cocok'
                                                        : 'Belum ada data mata kuliah'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Coba ubah kata kunci atau filter'
                                                        : 'Mulai dengan menambahkan mata kuliah pertama'}
                                                </p>
                                                {!hasActiveFilters && (
                                                    <Link
                                                        href="/admin-prodi/mata-kuliah/create"
                                                        className="mt-2"
                                                    >
                                                        <Button size="sm">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Tambah Mata Kuliah
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mataKuliahs.data.map((mk) => (
                                        <TableRow key={mk.id}>
                                            <TableCell className="font-mono font-medium">
                                                {mk.kode_mk}
                                            </TableCell>
                                            <TableCell>{mk.nama_mk}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        JENIS_VARIANTS[
                                                            mk.jenis
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {mk.jenis}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{mk.sks}</TableCell>
                                            <TableCell>
                                                {mk.semester}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            mk.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[
                                                        mk.status
                                                    ] || mk.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin-prodi/mata-kuliah/${mk.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin-prodi/mata-kuliah/${mk.uuid}/edit`}
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
                                                                    Hapus Mata
                                                                    Kuliah
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    mata
                                                                    kuliah{' '}
                                                                    {
                                                                        mk.nama_mk
                                                                    }
                                                                    ?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Batal
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            mk.uuid,
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

                {/* Pagination */}
                {mataKuliahs.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {mataKuliahs.data.length} dari{' '}
                            {mataKuliahs.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: mataKuliahs.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === mataKuliahs.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            '/admin-prodi/mata-kuliah',
                                            {
                                                ...filters,
                                                page,
                                            },
                                        )
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

MataKuliahIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Mata Kuliah', href: '/admin-prodi/mata-kuliah' },
        ]}
    >
        {page}
    </AppLayout>
);
