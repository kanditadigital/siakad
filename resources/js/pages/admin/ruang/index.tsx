import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Eye, DoorOpen, X } from 'lucide-react';
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

type Ruang = {
    id: number;
    uuid: string;
    kode_ruang: string;
    nama_ruang: string;
    kapasitas: number;
    lantai: string;
    gedung: string;
};

type PaginatedData = {
    data: Ruang[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    ruangs: PaginatedData;
    filters: {
        search?: string;
        gedung?: string;
        lantai?: string;
    };
};

export default function RuangIndex({ ruangs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [gedungFilter, setGedungFilter] = useState(filters.gedung || 'all');
    const [lantaiFilter, setLantaiFilter] = useState(filters.lantai || 'all');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin/ruang',
            {
                search,
                gedung: gedungFilter === 'all' ? '' : gedungFilter,
                lantai: lantaiFilter === 'all' ? '' : lantaiFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/ruang/${uuid}`);
    };

    const gedungList = [...new Set(ruangs.data.map((r) => r.gedung))];

    const hasActiveFilters = Boolean(
        filters.search || filters.gedung || filters.lantai,
    );

    const resetFilters = () => {
        setSearch('');
        setGedungFilter('all');
        setLantaiFilter('all');
        router.get('/admin/ruang');
    };

    return (
        <>
            <Head title="Data Ruang" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Ruang
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data ruang kelas
                        </p>
                    </div>
                    <Link href="/admin/ruang/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Ruang
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode atau nama ruang..."
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
                        value={gedungFilter}
                        onValueChange={(v) =>
                            applyFilters({ gedung: v === 'all' ? '' : v })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Semua Gedung" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Gedung</SelectItem>
                            {gedungList.map((g) => (
                                <SelectItem key={g} value={g}>
                                    {g}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={lantaiFilter}
                        onValueChange={(v) =>
                            applyFilters({ lantai: v === 'all' ? '' : v })
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Semua Lantai" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Lantai</SelectItem>
                            {[1, 2, 3, 4, 5].map((l) => (
                                <SelectItem key={l} value={l.toString()}>
                                    Lantai {l}
                                </SelectItem>
                            ))}
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

                <Card className="overflow-hidden py-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode Ruang</TableHead>
                                    <TableHead>Nama Ruang</TableHead>
                                    <TableHead>Gedung</TableHead>
                                    <TableHead>Lantai</TableHead>
                                    <TableHead>Kapasitas</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ruangs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <DoorOpen className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-foreground">
                                                    {hasActiveFilters
                                                        ? 'Tidak ada ruang yang cocok'
                                                        : 'Belum ada data ruang'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Coba ubah kata kunci atau filter'
                                                        : 'Mulai dengan menambahkan ruang pertama'}
                                                </p>
                                                {!hasActiveFilters && (
                                                    <Link
                                                        href="/admin/ruang/create"
                                                        className="mt-2"
                                                    >
                                                        <Button size="sm">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Tambah Ruang
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ruangs.data.map((ruang) => (
                                        <TableRow key={ruang.id}>
                                            <TableCell className="font-mono font-medium">
                                                {ruang.kode_ruang}
                                            </TableCell>
                                            <TableCell>
                                                {ruang.nama_ruang}
                                            </TableCell>
                                            <TableCell>
                                                {ruang.gedung}
                                            </TableCell>
                                            <TableCell>
                                                {ruang.lantai}
                                            </TableCell>
                                            <TableCell>
                                                {ruang.kapasitas}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/ruang/${ruang.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/ruang/${ruang.uuid}/edit`}
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
                                                                    Hapus Ruang
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    ruang{' '}
                                                                    {
                                                                        ruang.nama_ruang
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
                                                                            ruang.uuid,
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

                {ruangs.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {ruangs.data.length} dari {ruangs.total}{' '}
                            data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: ruangs.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === ruangs.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/ruang', {
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

RuangIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Ruang', href: '/admin/ruang' },
        ]}
    >
        {page}
    </AppLayout>
);
