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
    program_studi: {
        nama_prodi: string;
    };
};

type Yudisium = {
    id: number;
    uuid: string;
    tanggal_yudisium: string;
    ipk: number;
    total_sks: number;
    judul_skripsi: string | null;
    status: string;
    predikat: string | null;
    mahasiswa: Mahasiswa;
};

type PaginatedData = {
    data: Yudisium[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    yudisiums: PaginatedData;
    filters: {
        search?: string;
        status?: string;
        predikat?: string;
    };
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    lulus: 'default',
    'tidak lulus': 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    lulus: 'Lulus',
    'tidak lulus': 'Tidak Lulus',
};

export default function YudisiumIndex({ yudisiums, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [predikatFilter, setPredikatFilter] = useState(
        filters.predikat || 'all',
    );

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin/yudisium',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                predikat: predikatFilter === 'all' ? '' : predikatFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/yudisium/${uuid}`);
    };

    return (
        <>
            <Head title="Data Yudisium" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Yudisium
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data yudisium mahasiswa
                        </p>
                    </div>
                    <Link href="/admin/yudisium/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Yudisium
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
                        value={predikatFilter}
                        onValueChange={(v) =>
                            applyFilters({ predikat: v === 'all' ? '' : v })
                        }
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Predikat" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Predikat</SelectItem>
                            <SelectItem value="Cum Laude">Cum Laude</SelectItem>
                            <SelectItem value="Sangat Memuaskan">
                                Sangat Memuaskan
                            </SelectItem>
                            <SelectItem value="Memuaskan">Memuaskan</SelectItem>
                            <SelectItem value="Cukup">Cukup</SelectItem>
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
                            <SelectItem value="lulus">Lulus</SelectItem>
                            <SelectItem value="tidak lulus">
                                Tidak Lulus
                            </SelectItem>
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
                                    <TableHead>Program Studi</TableHead>
                                    <TableHead>Tanggal Yudisium</TableHead>
                                    <TableHead>IPK</TableHead>
                                    <TableHead>SKS</TableHead>
                                    <TableHead>Predikat</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {yudisiums.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={9}
                                            className="py-8 text-center"
                                        >
                                            Tidak ada data yudisium
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    yudisiums.data.map((yudisium) => (
                                        <TableRow key={yudisium.id}>
                                            <TableCell className="font-mono font-medium">
                                                {yudisium.mahasiswa?.nim}
                                            </TableCell>
                                            <TableCell>
                                                {yudisium.mahasiswa?.nama}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    yudisium.mahasiswa
                                                        ?.program_studi
                                                        ?.nama_prodi
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    yudisium.tanggal_yudisium,
                                                ).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {Number(yudisium.ipk).toFixed(
                                                    2,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {yudisium.total_sks}
                                            </TableCell>
                                            <TableCell>
                                                {yudisium.predikat || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            yudisium.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[
                                                        yudisium.status
                                                    ] || yudisium.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/yudisium/${yudisium.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/yudisium/${yudisium.uuid}/edit`}
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
                                                                    Yudisium
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    data
                                                                    yudisium
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
                                                                            yudisium.uuid,
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

                {yudisiums.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {yudisiums.data.length} dari{' '}
                            {yudisiums.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: yudisiums.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === yudisiums.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/yudisium', {
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

YudisiumIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Yudisium', href: '/admin/yudisium' },
        ]}
    >
        {page}
    </AppLayout>
);
