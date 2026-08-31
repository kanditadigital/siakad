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

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
};

type Dosen = {
    id: number;
    nama: string;
    nidn: string;
};

type Ruang = {
    id: number;
    kode_ruang: string;
    nama_ruang: string;
};

type Kelas = {
    id: number;
    uuid: string;
    kode_kelas: string;
    nama_kelas: string;
    kapasitas: number;
    semester: string;
    tahun_akademik: string;
    status: string;
    mata_kuliah: MataKuliah;
    dosen: Dosen | null;
    ruang: Ruang | null;
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
    dosens: Dosen[];
    ruangs: Ruang[];
    filters: {
        search?: string;
        status?: string;
        semester?: string;
        mata_kuliah_id?: string;
        dosen_id?: string;
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
    mataKuliahs,
    dosens,
    ruangs,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [semesterFilter, setSemesterFilter] = useState(
        filters.semester || 'all',
    );

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin/penjadwalan',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                semester: semesterFilter === 'all' ? '' : semesterFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/penjadwalan/${uuid}`);
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
                            Kelola jadwal kelas perkuliahan
                        </p>
                    </div>
                    <Link href="/admin/penjadwalan/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Kelas
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4">
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
                    <Select
                        value={semesterFilter}
                        onValueChange={(v) =>
                            applyFilters({ semester: v === 'all' ? '' : v })
                        }
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
                        onValueChange={(v) =>
                            applyFilters({ status: v === 'all' ? '' : v })
                        }
                    >
                        <SelectTrigger className="w-[150px]">
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
                </div>

                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode Kelas</TableHead>
                                    <TableHead>Nama Kelas</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead>Dosen</TableHead>
                                    <TableHead>Ruang</TableHead>
                                    <TableHead>Kapasitas</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Tahun Akademik</TableHead>
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
                                            colSpan={10}
                                            className="py-8 text-center"
                                        >
                                            Tidak ada data penjadwalan
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
                                                {kelas.ruang?.kode_ruang || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {kelas.kapasitas}
                                            </TableCell>
                                            <TableCell>
                                                {kelas.semester}
                                            </TableCell>
                                            <TableCell>
                                                {kelas.tahun_akademik}
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
                                                        href={`/admin/penjadwalan/${kelas.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/penjadwalan/${kelas.uuid}/edit`}
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
                </div>

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
                                        router.get('/admin/penjadwalan', {
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

PenjadwalanIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Penjadwalan', href: '/admin/penjadwalan' },
        ]}
    >
        {page}
    </AppLayout>
);
