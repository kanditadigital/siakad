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

type Tendik = {
    id: number;
    uuid: string;
    nip: string;
    nama: string;
    email: string;
    jabatan: string;
    unit_kerja: string;
    pendidikan_terakhir: string;
    status: string;
};

type PaginatedData = {
    data: Tendik[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    tendiks: PaginatedData;
    jabatanList: string[];
    filters: {
        search?: string;
        status?: string;
        jabatan?: string;
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

export default function TendikIndex({ tendiks, jabatanList, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [jabatanFilter, setJabatanFilter] = useState(
        filters.jabatan || 'all',
    );

    const handleSearch = () => {
        router.get(
            '/admin/tendik',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                jabatan: jabatanFilter === 'all' ? '' : jabatanFilter,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/admin/tendik',
            {
                search,
                status: value === 'all' ? '' : value,
                jabatan: jabatanFilter === 'all' ? '' : jabatanFilter,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleJabatanChange = (value: string) => {
        setJabatanFilter(value);
        router.get(
            '/admin/tendik',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                jabatan: value === 'all' ? '' : value,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/tendik/${uuid}`);
    };

    return (
        <>
            <Head title="Data Tendik" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Tendik
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data tenaga kependidikan
                        </p>
                    </div>
                    <Link href="/admin/tendik/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Tendik
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIP, nama, atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSearch()
                            }
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={jabatanFilter}
                        onValueChange={handleJabatanChange}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Jabatan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jabatan</SelectItem>
                            {jabatanList.map((jabatan) => (
                                <SelectItem key={jabatan} value={jabatan}>
                                    {jabatan}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter}
                        onValueChange={handleStatusChange}
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
                </div>

                {/* Table */}
                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIP</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Jabatan</TableHead>
                                    <TableHead>Unit Kerja</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tendiks.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-8 text-center"
                                        >
                                            Tidak ada data tendik
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    tendiks.data.map((tendik) => (
                                        <TableRow key={tendik.id}>
                                            <TableCell className="font-mono font-medium">
                                                {tendik.nip}
                                            </TableCell>
                                            <TableCell>{tendik.nama}</TableCell>
                                            <TableCell>
                                                {tendik.jabatan}
                                            </TableCell>
                                            <TableCell>
                                                {tendik.unit_kerja}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            tendik.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[
                                                        tendik.status
                                                    ] || tendik.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/tendik/${tendik.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/tendik/${tendik.uuid}/edit`}
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
                                                                    Hapus Tendik
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    tendik{' '}
                                                                    {
                                                                        tendik.nama
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
                                                                            tendik.uuid,
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
                {tendiks.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {tendiks.data.length} dari{' '}
                            {tendiks.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: tendiks.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === tendiks.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/tendik', {
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

TendikIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Tendik', href: '/admin/tendik' },
        ]}
    >
        {page}
    </AppLayout>
);
