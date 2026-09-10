import { Head, Link, router } from '@inertiajs/react';
import { CalendarClock, Edit, Eye, Plus, Search, Trash2, X } from 'lucide-react';
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

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
};

type Kelas = {
    id: number;
    uuid: string;
    kode_kelas: string;
    nama_kelas: string;
    semester: string;
    tahun_akademik: string;
    kapasitas: number;
    status: string;
    mata_kuliah: MataKuliah;
    dosen: { nama: string } | null;
    ruang: { kode_ruang: string } | null;
};

type PaginatedData = {
    data: Kelas[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    kelases: PaginatedData;
    mataKuliahs: MataKuliah[];
    filters: {
        search?: string;
        status?: string;
    };
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    Aktif: 'default',
    'Tidak Aktif': 'secondary',
    Selesai: 'outline',
};

export default function PenjadwalanIndex({
    kelases,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin-prodi/penjadwalan',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const hasActiveFilters = Boolean(filters.search || filters.status);

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        router.get('/admin-prodi/penjadwalan');
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin-prodi/penjadwalan/${uuid}`);
    };

    return (
        <>
            <Head title="Data Penjadwalan" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Penjadwalan
                        </h1>
                        <p className="text-muted-foreground">
                            Jadwal kelas perkuliahan program studi
                        </p>
                    </div>
                    <Link href="/admin-prodi/penjadwalan/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kelas
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode atau nama kelas..."
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
                        value={statusFilter}
                        onValueChange={(v) => {
                            setStatusFilter(v);
                            applyFilters({ status: v === 'all' ? '' : v });
                        }}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="Aktif">Aktif</SelectItem>
                            <SelectItem value="Tidak Aktif">
                                Tidak Aktif
                            </SelectItem>
                            <SelectItem value="Selesai">Selesai</SelectItem>
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
                <Card className="overflow-hidden py-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode Kelas</TableHead>
                                    <TableHead>Nama Kelas</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead>Dosen</TableHead>
                                    <TableHead>Ruang</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kelases.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <CalendarClock className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {hasActiveFilters
                                                        ? 'Tidak ada kelas yang cocok'
                                                        : 'Belum ada jadwal kelas'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Coba ubah kata kunci atau filter'
                                                        : 'Mulai dengan menambahkan kelas pertama'}
                                                </p>
                                                {!hasActiveFilters && (
                                                    <Link
                                                        href="/admin-prodi/penjadwalan/create"
                                                        className="mt-2"
                                                    >
                                                        <Button size="sm">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Tambah Kelas
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    kelases.data.map((kelas) => (
                                        <TableRow key={kelas.id}>
                                            <TableCell className="font-mono font-medium">
                                                {kelas.kode_kelas}
                                            </TableCell>
                                            <TableCell>
                                                {kelas.nama_kelas}
                                            </TableCell>
                                            <TableCell>
                                                {kelas.mata_kuliah?.nama_mk}
                                            </TableCell>
                                            <TableCell>
                                                {kelas.dosen?.nama || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {kelas.ruang?.kode_ruang ||
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                Semester {kelas.semester}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            kelas.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {kelas.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin-prodi/penjadwalan/${kelas.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin-prodi/penjadwalan/${kelas.uuid}/edit`}
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
                                                                    Hapus Kelas
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    kelas{' '}
                                                                    {
                                                                        kelas.nama_kelas
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
                                                                            kelas.uuid,
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

                {/* Pagination */}
                {kelases.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {kelases.data.length} dari{' '}
                            {kelases.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: kelases.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === kelases.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            '/admin-prodi/penjadwalan',
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

PenjadwalanIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Penjadwalan', href: '/admin-prodi/penjadwalan' },
        ]}
    >
        {page}
    </AppLayout>
);
