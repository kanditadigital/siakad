import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit, Trash2, Eye, Users, X, TrendingUp } from 'lucide-react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
    kode_prodi: string;
    nama_prodi: string;
    lama_studi: number;
};

type Mahasiswa = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    jenis_kelamin: string;
    alamat: string;
    status: string;
    semester_saat_ini: number;
    batas_semester_normal: number;
    program_studi_id: number;
    program_studi: ProgramStudi;
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
    programStudis: ProgramStudi[];
    filters: {
        search?: string;
        status?: string;
        program_studi_id?: string;
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
    programStudis,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [prodiFilter, setProdiFilter] = useState(
        filters.program_studi_id || 'all',
    );
    const [semesterFilter, setSemesterFilter] = useState(
        filters.semester || 'all',
    );

    // Highest semester count across all jenjang (S1 = 8, D3 = 6, …) — the
    // filter dropdown lists every semester up to whichever prodi runs longest,
    // since this page spans every program studi at once.
    const maxSemesterOption = Math.max(
        8,
        ...programStudis.map((p) => p.lama_studi * 2),
    );

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin/mahasiswa',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                program_studi_id: prodiFilter === 'all' ? '' : prodiFilter,
                semester: semesterFilter === 'all' ? '' : semesterFilter,
                ...overrides,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleSearch = () => applyFilters({});

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        applyFilters({ status: value === 'all' ? '' : value });
    };

    const handleProdiChange = (value: string) => {
        setProdiFilter(value);
        applyFilters({ program_studi_id: value === 'all' ? '' : value });
    };

    const handleSemesterChange = (value: string) => {
        setSemesterFilter(value);
        applyFilters({ semester: value === 'all' ? '' : value });
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/mahasiswa/${uuid}`);
    };

    const [promoteOpen, setPromoteOpen] = useState(false);
    const [promoteProdiId, setPromoteProdiId] = useState('');
    const [promoting, setPromoting] = useState(false);

    const handlePromote = () => {
        if (!promoteProdiId) {
            return;
        }

        setPromoting(true);
        router.post(
            '/admin/mahasiswa/naikkan-semester',
            { program_studi_id: promoteProdiId },
            {
                preserveScroll: true,
                onFinish: () => setPromoting(false),
                onSuccess: () => {
                    setPromoteOpen(false);
                    setPromoteProdiId('');
                },
            },
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
                            Kelola data mahasiswa
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Dialog open={promoteOpen} onOpenChange={setPromoteOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Naikkan Semester
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Naikkan Semester Mahasiswa
                                    </DialogTitle>
                                    <DialogDescription>
                                        Semester seluruh mahasiswa berstatus
                                        aktif pada program studi terpilih akan
                                        bertambah satu. Mahasiswa cuti,
                                        nonaktif, dan lulus tidak terpengaruh.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2">
                                    <Select
                                        value={promoteProdiId}
                                        onValueChange={setPromoteProdiId}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih program studi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programStudis.map((prodi) => (
                                                <SelectItem
                                                    key={prodi.id}
                                                    value={prodi.id.toString()}
                                                >
                                                    {prodi.nama_prodi}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={handlePromote}
                                        disabled={
                                            !promoteProdiId || promoting
                                        }
                                    >
                                        {promoting
                                            ? 'Memproses...'
                                            : 'Naikkan Semester'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Link href="/admin/mahasiswa/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Mahasiswa
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIM, nama, atau alamat..."
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
                        value={prodiFilter}
                        onValueChange={handleProdiChange}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Program Studi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Program Studi
                            </SelectItem>
                            {programStudis.map((prodi) => (
                                <SelectItem
                                    key={prodi.id}
                                    value={prodi.id.toString()}
                                >
                                    {prodi.nama_prodi}
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
                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                            <SelectItem value="lulus">Lulus</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={semesterFilter}
                        onValueChange={handleSemesterChange}
                    >
                        <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="Semua Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Semester
                            </SelectItem>
                            {Array.from(
                                { length: maxSemesterOption },
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
                    {(filters.search ||
                        filters.status ||
                        filters.program_studi_id ||
                        filters.semester) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearch('');
                                setStatusFilter('all');
                                setProdiFilter('all');
                                setSemesterFilter('all');
                                router.get('/admin/mahasiswa');
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
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Program Studi</TableHead>
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
                                            colSpan={7}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-foreground">
                                                    {filters.search ||
                                                    filters.status ||
                                                    filters.program_studi_id ||
                                                    filters.semester
                                                        ? 'Tidak ada mahasiswa yang cocok'
                                                        : 'Belum ada data mahasiswa'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {filters.search ||
                                                    filters.status ||
                                                    filters.program_studi_id ||
                                                    filters.semester
                                                        ? 'Coba ubah kata kunci atau filter'
                                                        : 'Mulai dengan menambahkan mahasiswa pertama'}
                                                </p>
                                                {!filters.search &&
                                                    !filters.status &&
                                                    !filters.program_studi_id &&
                                                    !filters.semester && (
                                                        <Link
                                                            href="/admin/mahasiswa/create"
                                                            className="mt-2"
                                                        >
                                                            <Button size="sm">
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Tambah
                                                                Mahasiswa
                                                            </Button>
                                                        </Link>
                                                    )}
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
                                                {mhs.program_studi?.nama_prodi}
                                            </TableCell>
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
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/mahasiswa/${mhs.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/mahasiswa/${mhs.uuid}/edit`}
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
                                                                    Mahasiswa
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    mahasiswa{' '}
                                                                    {mhs.nama}?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>
                                                                    Batal
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            mhs.uuid,
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
                                        router.get('/admin/mahasiswa', {
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

MahasiswaIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Mahasiswa', href: '/admin/mahasiswa' },
        ]}
    >
        {page}
    </AppLayout>
);
