import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, TrendingUp, Users, X } from 'lucide-react';
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
    uuid: string;
    nim: string;
    nama: string;
    jenis_kelamin: string;
    status: string;
    semester_saat_ini: number;
    batas_semester_normal: number;
};

type PaginatedData = {
    data: Mahasiswa[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    mahasiswas: PaginatedData;
    maxSemester: number;
    activeCount: number;
    filters: {
        search?: string;
        status?: string;
        semester?: string;
    };
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    nonaktif: 'Nonaktif',
    lulus: 'Lulus',
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    aktif: 'default',
    cuti: 'secondary',
    nonaktif: 'destructive',
    lulus: 'outline',
};

export default function MahasiswaIndex({
    mahasiswas,
    maxSemester,
    activeCount,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [semesterFilter, setSemesterFilter] = useState(
        filters.semester || 'all',
    );
    const [promoting, setPromoting] = useState(false);

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin-prodi/mahasiswa',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                semester: semesterFilter === 'all' ? '' : semesterFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const hasActiveFilters = Boolean(
        filters.search || filters.status || filters.semester,
    );

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setSemesterFilter('all');
        router.get('/admin-prodi/mahasiswa');
    };

    const handlePromote = () => {
        setPromoting(true);
        router.post(
            '/admin-prodi/mahasiswa/naikkan-semester',
            {},
            { preserveScroll: true, onFinish: () => setPromoting(false) },
        );
    };

    return (
        <>
            <Head title="Data Mahasiswa" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Mahasiswa
                        </h1>
                        <p className="text-muted-foreground">
                            Daftar mahasiswa program studi
                        </p>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" disabled={activeCount === 0}>
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Naikkan Semester
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Naikkan Semester Mahasiswa
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Semester akan bertambah satu untuk{' '}
                                    {activeCount} mahasiswa aktif di program
                                    studi ini. Mahasiswa cuti, nonaktif, dan
                                    lulus tidak terpengaruh. Tindakan ini
                                    tidak dapat dibatalkan.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handlePromote}
                                    disabled={promoting}
                                >
                                    {promoting
                                        ? 'Memproses...'
                                        : 'Naikkan Semester'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIM atau nama..."
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
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="cuti">Cuti</SelectItem>
                            <SelectItem value="nonaktif">
                                Nonaktif
                            </SelectItem>
                            <SelectItem value="lulus">Lulus</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={semesterFilter}
                        onValueChange={(v) => {
                            setSemesterFilter(v);
                            applyFilters({ semester: v === 'all' ? '' : v });
                        }}
                    >
                        <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="Semua Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Semester
                            </SelectItem>
                            {Array.from(
                                { length: maxSemester },
                                (_, i) => i + 1,
                            ).map((sem) => (
                                <SelectItem
                                    key={sem}
                                    value={sem.toString()}
                                >
                                    Semester {sem}
                                </SelectItem>
                            ))}
                            <SelectItem value="over">
                                Melebihi Masa Studi Normal
                            </SelectItem>
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
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Jenis Kelamin</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mahasiswas.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {hasActiveFilters
                                                        ? 'Tidak ada mahasiswa yang cocok'
                                                        : 'Belum ada data mahasiswa'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Coba ubah kata kunci atau filter'
                                                        : 'Mahasiswa program studi ini akan muncul di sini'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mahasiswas.data.map((mhs) => (
                                        <TableRow key={mhs.id}>
                                            <TableCell className="font-mono font-medium">
                                                {mhs.nim}
                                            </TableCell>
                                            <TableCell>{mhs.nama}</TableCell>
                                            <TableCell>
                                                {mhs.jenis_kelamin}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="tabular-nums">
                                                        {mhs.semester_saat_ini}
                                                    </span>
                                                    {mhs.semester_saat_ini >
                                                        mhs.batas_semester_normal && (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-amber-300 bg-amber-50 text-[11px] text-amber-700"
                                                        >
                                                            Melebihi normal
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            mhs.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[
                                                        mhs.status
                                                    ] || mhs.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    href={`/admin-prodi/mahasiswa/${mhs.uuid}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {mahasiswas.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {mahasiswas.data.length} dari{' '}
                            {mahasiswas.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: mahasiswas.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === mahasiswas.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get(
                                            '/admin-prodi/mahasiswa',
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

MahasiswaIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Mahasiswa', href: '/admin-prodi/mahasiswa' },
        ]}
    >
        {page}
    </AppLayout>
);
