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

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type MataKuliah = {
    id: number;
    uuid: string;
    kode_mk: string;
    nama_mk: string;
    jenis: string;
    sks: number;
    semester: number;
    status: string;
    program_studi: ProgramStudi;
};

type PaginatedData = {
    data: MataKuliah[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    mataKuliahs: PaginatedData;
    programStudis: ProgramStudi[];
    filters: {
        search?: string;
        status?: string;
        program_studi_id?: string;
        jenis?: string;
        semester?: string;
    };
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    nonaktif: 'Nonaktif',
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    aktif: 'default',
    nonaktif: 'secondary',
};

const JENIS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    Wajib: 'default',
    Pilihan: 'outline',
};

export default function MataKuliahIndex({
    mataKuliahs,
    programStudis,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [prodiFilter, setProdiFilter] = useState(
        filters.program_studi_id || 'all',
    );
    const [jenisFilter, setJenisFilter] = useState(filters.jenis || 'all');
    const [semesterFilter, setSemesterFilter] = useState(
        filters.semester || 'all',
    );

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin/mata-kuliah',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                program_studi_id: prodiFilter === 'all' ? '' : prodiFilter,
                jenis: jenisFilter === 'all' ? '' : jenisFilter,
                semester: semesterFilter === 'all' ? '' : semesterFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/mata-kuliah/${uuid}`);
    };

    return (
        <>
            <Head title="Data Mata Kuliah" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Data Mata Kuliah
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola data mata kuliah
                        </p>
                    </div>
                    <Link href="/admin/mata-kuliah/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Mata Kuliah
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode atau nama mata kuliah..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && applyFilters({ search })
                            }
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={prodiFilter}
                        onValueChange={(v) =>
                            applyFilters({
                                program_studi_id: v === 'all' ? '' : v,
                            })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Semua Prodi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Prodi</SelectItem>
                            {programStudis.map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.nama_prodi}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={jenisFilter}
                        onValueChange={(v) =>
                            applyFilters({ jenis: v === 'all' ? '' : v })
                        }
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Semua Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Jenis</SelectItem>
                            <SelectItem value="Wajib">Wajib</SelectItem>
                            <SelectItem value="Pilihan">Pilihan</SelectItem>
                        </SelectContent>
                    </Select>
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
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode MK</TableHead>
                                    <TableHead>Nama Mata Kuliah</TableHead>
                                    <TableHead>Program Studi</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>SKS</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mataKuliahs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            className="py-8 text-center"
                                        >
                                            Tidak ada data mata kuliah
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mataKuliahs.data.map((mk) => (
                                        <TableRow key={mk.id}>
                                            <TableCell className="font-mono font-medium">
                                                {mk.kode_mk}
                                            </TableCell>
                                            <TableCell>{mk.nama_mk}</TableCell>
                                            <TableCell>
                                                {mk.program_studi?.nama_prodi}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        JENIS_VARIANTS[
                                                            mk.jenis
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {mk.jenis}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{mk.sks}</TableCell>
                                            <TableCell>{mk.semester}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            mk.status
                                                        ] || 'outline'
                                                    }
                                                >
                                                    {STATUS_LABELS[mk.status] ||
                                                        mk.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/mata-kuliah/${mk.uuid}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={`/admin/mata-kuliah/${mk.uuid}/edit`}
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
                                                                    Hapus Mata
                                                                    Kuliah
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah anda
                                                                    yakin ingin
                                                                    menghapus
                                                                    mata kuliah{' '}
                                                                    {mk.nama_mk}
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
                                                                            mk.uuid,
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

                {mataKuliahs.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {mataKuliahs.data.length} dari{' '}
                            {mataKuliahs.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: mataKuliahs.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === mataKuliahs.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/admin/mata-kuliah', {
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

MataKuliahIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Mata Kuliah', href: '/admin/mata-kuliah' },
        ]}
    >
        {page}
    </AppLayout>
);
