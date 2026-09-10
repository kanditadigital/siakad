import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Eye, CalendarDays, X } from 'lucide-react';
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

type AcademicYear = {
    id: number;
    uuid: string;
    nama_tahun_akademik: string;
    semester: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: string;
    periode_krs: string | null;
    periode_input_nilai: string | null;
};

type PaginatedData = {
    data: AcademicYear[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    academicYears: PaginatedData;
    filters: {
        search?: string;
        status?: string;
    };
};

export default function DataAkademikIndex({ academicYears, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get(
            '/admin/data-akademik',
            {
                search,
                status: status === 'all' ? '' : status,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(
            '/admin/data-akademik',
            {
                search,
                status: value === 'all' ? '' : value,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/data-akademik/${uuid}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'aktif':
                return (
                    <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                );
            case 'nonaktif':
                return (
                    <Badge className="bg-gray-100 text-gray-800">
                        Nonaktif
                    </Badge>
                );
            case 'arsip':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Arsip
                    </Badge>
                );
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Data Akademik" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Akademik
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola tahun akademik dan semester
                        </p>
                    </div>
                    <Link href="/admin/data-akademik/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Tahun Akademik
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari tahun akademik..."
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
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                            <SelectItem value="arsip">Arsip</SelectItem>
                        </SelectContent>
                    </Select>
                    {(filters.search || filters.status) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearch('');
                                setStatus('all');
                                router.get('/admin/data-akademik');
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
                                    <TableHead>Tahun Akademik</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Tanggal Mulai</TableHead>
                                    <TableHead>Tanggal Selesai</TableHead>
                                    <TableHead>Periode KRS</TableHead>
                                    <TableHead>Periode Input Nilai</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {academicYears.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <CalendarDays className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {filters.search ||
                                                    filters.status
                                                        ? 'Tidak ada tahun akademik yang cocok'
                                                        : 'Belum ada tahun akademik'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {filters.search ||
                                                    filters.status
                                                        ? 'Coba ubah kata kunci atau filter status'
                                                        : 'Mulai dengan menambahkan tahun akademik pertama'}
                                                </p>
                                                {!filters.search &&
                                                    !filters.status && (
                                                        <Link
                                                            href="/admin/data-akademik/create"
                                                            className="mt-2"
                                                        >
                                                            <Button size="sm">
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Tambah Tahun
                                                                Akademik
                                                            </Button>
                                                        </Link>
                                                    )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    academicYears.data.map((year) => (
                                        <TableRow key={year.id}>
                                            <TableCell className="font-medium">
                                                {year.nama_tahun_akademik}
                                            </TableCell>
                                            <TableCell>
                                                {year.semester}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    year.tanggal_mulai,
                                                ).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    year.tanggal_selesai,
                                                ).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell>
                                                {year.periode_krs || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {year.periode_input_nilai ||
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(year.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/data-akademik/${year.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/data-akademik/${year.uuid}/edit`}
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
                                                                    Hapus Tahun
                                                                    Akademik
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    tahun
                                                                    akademik{' '}
                                                                    {
                                                                        year.nama_tahun_akademik
                                                                    }{' '}
                                                                    {
                                                                        year.semester
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
                                                                            year.uuid,
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
                {academicYears.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {academicYears.data.length} dari{' '}
                            {academicYears.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: academicYears.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === academicYears.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/data-akademik', {
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

DataAkademikIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Data Akademik', href: '/admin/data-akademik' },
        ]}
    >
        {page}
    </AppLayout>
);
