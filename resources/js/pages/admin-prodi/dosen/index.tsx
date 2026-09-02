import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, GraduationCap, Plus, Search, Trash2, X } from 'lucide-react';
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

type Dosen = {
    id: number;
    uuid: string;
    nidn: string;
    nuptk: string;
    nama: string;
    status: string;
};

type PaginatedData = {
    data: Dosen[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    dosens: PaginatedData;
    filters: {
        search?: string;
        status?: string;
    };
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    pensiun: 'Pensiun',
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    aktif: 'default',
    cuti: 'secondary',
    pensiun: 'outline',
};

export default function DosenIndex({ dosens, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin-prodi/dosen',
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
        router.get('/admin-prodi/dosen');
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin-prodi/dosen/${uuid}`);
    };

    return (
        <>
            <Head title="Data Dosen" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Dosen
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola dosen program studi
                        </p>
                    </div>
                    <Link href="/admin-prodi/dosen/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Dosen
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIDN, NUPTK, atau nama..."
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
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="cuti">Cuti</SelectItem>
                            <SelectItem value="pensiun">Pensiun</SelectItem>
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
                                    <TableHead>NIDN</TableHead>
                                    <TableHead>NUPTK</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dosens.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {hasActiveFilters
                                                        ? 'Tidak ada dosen yang cocok'
                                                        : 'Belum ada data dosen'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Coba ubah kata kunci atau filter'
                                                        : 'Mulai dengan menambahkan dosen pertama'}
                                                </p>
                                                {!hasActiveFilters && (
                                                    <Link
                                                        href="/admin-prodi/dosen/create"
                                                        className="mt-2"
                                                    >
                                                        <Button size="sm">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Tambah Dosen
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    dosens.data.map((dosen) => (
                                        <TableRow key={dosen.id}>
                                            <TableCell className="font-mono font-medium">
                                                {dosen.nidn}
                                            </TableCell>
                                            <TableCell className="font-mono font-medium">
                                                {dosen.nuptk}
                                            </TableCell>
                                            <TableCell>
                                                {dosen.nama}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            dosen.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[
                                                        dosen.status
                                                    ] || dosen.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin-prodi/dosen/${dosen.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin-prodi/dosen/${dosen.uuid}/edit`}
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
                                                                    Dosen
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    dosen{' '}
                                                                    {
                                                                        dosen.nama
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
                                                                            dosen.uuid,
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
                {dosens.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {dosens.data.length} dari{' '}
                            {dosens.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: dosens.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === dosens.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin-prodi/dosen', {
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

DosenIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Dosen', href: '/admin-prodi/dosen' },
        ]}
    >
        {page}
    </AppLayout>
);
