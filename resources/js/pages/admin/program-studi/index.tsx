import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Eye, School, X } from 'lucide-react';
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

type ProgramStudi = {
    id: number;
    uuid: string;
    kode_prodi: string;
    nama_prodi: string;
    fakultas: string;
    lama_studi: number;
    jenis_prodi: string;
};

type PaginatedData = {
    data: ProgramStudi[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    programStudis: PaginatedData;
    fakultas: string[];
    filters: {
        search?: string;
        fakultas?: string;
    };
};

export default function ProgramStudiIndex({
    programStudis,
    fakultas,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [fakultasFilter, setFakultasFilter] = useState(
        filters.fakultas || 'all',
    );

    const handleSearch = () => {
        router.get(
            '/admin/program-studi',
            {
                search,
                fakultas: fakultasFilter === 'all' ? '' : fakultasFilter,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleFakultasChange = (value: string) => {
        setFakultasFilter(value);
        router.get(
            '/admin/program-studi',
            {
                search,
                fakultas: value === 'all' ? '' : value,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/program-studi/${uuid}`);
    };

    return (
        <>
            <Head title="Program Studi" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Program Studi
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data program studi
                        </p>
                    </div>
                    <Link href="/admin/program-studi/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Program Studi
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode atau nama program studi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSearch()
                            }
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline" onClick={handleSearch}>
                        Cari
                    </Button>
                    <Select
                        value={fakultasFilter}
                        onValueChange={handleFakultasChange}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Fakultas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Fakultas</SelectItem>
                            {fakultas.map((f) => (
                                <SelectItem key={f} value={f}>
                                    {f}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {(filters.search || filters.fakultas) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearch('');
                                setFakultasFilter('all');
                                router.get('/admin/program-studi');
                            }}
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
                                    <TableHead>Kode Prodi</TableHead>
                                    <TableHead>Nama Program Studi</TableHead>
                                    <TableHead>Fakultas</TableHead>
                                    <TableHead>Jenjang</TableHead>
                                    <TableHead>Lama Studi</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {programStudis.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <School className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {filters.search ||
                                                    filters.fakultas
                                                        ? 'Tidak ada program studi yang cocok'
                                                        : 'Belum ada program studi'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {filters.search ||
                                                    filters.fakultas
                                                        ? 'Coba ubah kata kunci atau filter fakultas'
                                                        : 'Mulai dengan menambahkan program studi pertama'}
                                                </p>
                                                {!filters.search &&
                                                    !filters.fakultas && (
                                                        <Link
                                                            href="/admin/program-studi/create"
                                                            className="mt-2"
                                                        >
                                                            <Button size="sm">
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Tambah Program
                                                                Studi
                                                            </Button>
                                                        </Link>
                                                    )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    programStudis.data.map((prodi) => (
                                        <TableRow key={prodi.id}>
                                            <TableCell className="font-mono font-medium">
                                                {prodi.kode_prodi}
                                            </TableCell>
                                            <TableCell>
                                                {prodi.nama_prodi}
                                            </TableCell>
                                            <TableCell>
                                                {prodi.fakultas}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {prodi.jenis_prodi}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {prodi.lama_studi} Tahun
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/program-studi/${prodi.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/program-studi/${prodi.uuid}/edit`}
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
                                                                    Program
                                                                    Studi
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    program
                                                                    studi{' '}
                                                                    {
                                                                        prodi.nama_prodi
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
                                                                            prodi.uuid,
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
                {programStudis.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {programStudis.data.length} dari{' '}
                            {programStudis.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: programStudis.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === programStudis.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/program-studi', {
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

ProgramStudiIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Program Studi', href: '/admin/program-studi' },
        ]}
    >
        {page}
    </AppLayout>
);
