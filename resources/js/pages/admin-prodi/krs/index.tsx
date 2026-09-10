import { Head, router } from '@inertiajs/react';
import {
    Check,
    ClipboardList,
    Eye,
    Search,
    X,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
};

type Dosen = {
    id: number;
    nama: string;
};

type Kelas = {
    id: number;
    kode_kelas: string;
    nama_kelas: string;
    mata_kuliah: MataKuliah;
    dosen: Dosen | null;
};

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type KrsEntry = {
    id: number;
    uuid: string;
    status: string;
    kelas: Kelas;
    academic_year_semester: AcademicYearSemester;
};

type MahasiswaGroup = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    krs: KrsEntry[];
};

type PaginatedData = {
    data: MahasiswaGroup[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    mahasiswas: PaginatedData;
    academicYearSemesters: AcademicYearSemester[];
    filters: {
        search?: string;
        status?: string;
        academic_year_semester_id?: string;
    };
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    pending: 'outline',
    disetujui: 'default',
    ditolak: 'destructive',
};

function sksTotal(krs: KrsEntry[]): number {
    return krs.reduce((sum, k) => sum + (k.kelas?.mata_kuliah?.sks || 0), 0);
}

function statusCounts(krs: KrsEntry[]): Record<string, number> {
    return krs.reduce<Record<string, number>>((acc, k) => {
        acc[k.status] = (acc[k.status] || 0) + 1;
        return acc;
    }, {});
}

export default function KrsIndex({
    mahasiswas,
    academicYearSemesters,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [semesterFilter, setSemesterFilter] = useState(
        filters.academic_year_semester_id || 'all',
    );
    const [selectedMahasiswaId, setSelectedMahasiswaId] = useState<
        number | null
    >(null);
    const [processingUuid, setProcessingUuid] = useState<string | null>(null);

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin-prodi/krs',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                academic_year_semester_id:
                    semesterFilter === 'all' ? '' : semesterFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const hasActiveFilters = Boolean(
        filters.search || filters.status || filters.academic_year_semester_id,
    );

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setSemesterFilter('all');
        router.get('/admin-prodi/krs');
    };

    const selectedMahasiswa = mahasiswas.data.find(
        (m) => m.id === selectedMahasiswaId,
    );

    const handleApprove = (krs: KrsEntry) => {
        setProcessingUuid(krs.uuid);
        router.patch(
            `/admin-prodi/krs/${krs.uuid}/approve`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingUuid(null),
            },
        );
    };

    const handleReject = (krs: KrsEntry) => {
        setProcessingUuid(krs.uuid);
        router.patch(
            `/admin-prodi/krs/${krs.uuid}/reject`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingUuid(null),
            },
        );
    };

    return (
        <>
            <Head title="Data KRS" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Data KRS
                    </h1>
                    <p className="text-muted-foreground">
                        Kartu Rencana Studi mahasiswa program studi
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
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
                    <Button
                        variant="outline"
                        onClick={() => applyFilters({ search })}
                    >
                        Cari
                    </Button>
                    <Select
                        value={semesterFilter}
                        onValueChange={(v) => {
                            setSemesterFilter(v);
                            applyFilters({
                                academic_year_semester_id:
                                    v === 'all' ? '' : v,
                            });
                        }}
                    >
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Semua Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Semester
                            </SelectItem>
                            {academicYearSemesters.map((ays) => (
                                <SelectItem
                                    key={ays.id}
                                    value={ays.id.toString()}
                                >
                                    {ays.nama_tahun_akademik} - Semester{' '}
                                    {ays.semester}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="disetujui">
                                Disetujui
                            </SelectItem>
                            <SelectItem value="ditolak">Ditolak</SelectItem>
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

                {/* Table grouped by mahasiswa */}
                <Card className="overflow-hidden py-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead className="text-right">
                                        Jumlah Kelas
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total SKS
                                    </TableHead>
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
                                                <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {hasActiveFilters
                                                        ? 'Tidak ada KRS yang cocok'
                                                        : 'Belum ada data KRS'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Coba ubah kata kunci atau filter'
                                                        : 'KRS mahasiswa program studi ini akan muncul di sini'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mahasiswas.data.map((mhs) => {
                                        const counts = statusCounts(mhs.krs);

                                        return (
                                            <TableRow key={mhs.id}>
                                                <TableCell className="font-mono font-medium">
                                                    {mhs.nim}
                                                </TableCell>
                                                <TableCell>
                                                    {mhs.nama}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {mhs.krs.length}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {sksTotal(mhs.krs)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {Object.entries(
                                                            counts,
                                                        ).map(
                                                            ([
                                                                status,
                                                                count,
                                                            ]) => (
                                                                <Badge
                                                                    key={
                                                                        status
                                                                    }
                                                                    variant={
                                                                        STATUS_VARIANTS[
                                                                            status
                                                                        ] ||
                                                                        'outline'
                                                                    }
                                                                >
                                                                    {count}{' '}
                                                                    {STATUS_LABELS[
                                                                        status
                                                                    ] ||
                                                                        status}
                                                                </Badge>
                                                            ),
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setSelectedMahasiswaId(
                                                                mhs.id,
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
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
                            {mahasiswas.total} mahasiswa
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
                                        router.get('/admin-prodi/krs', {
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

            {/* Detail / approve-reject dialog */}
            <Dialog
                open={selectedMahasiswaId !== null}
                onOpenChange={(open) =>
                    !open && setSelectedMahasiswaId(null)
                }
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedMahasiswa?.nama}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMahasiswa?.nim} — Daftar KRS yang
                            diajukan
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] space-y-3 overflow-y-auto">
                        {selectedMahasiswa?.krs.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                Belum ada KRS pada periode ini
                            </p>
                        ) : (
                            selectedMahasiswa?.krs.map((krs) => (
                                <div
                                    key={krs.id}
                                    className="rounded-lg border p-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {krs.kelas?.mata_kuliah
                                                    ?.nama_mk}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {
                                                    krs.kelas?.mata_kuliah
                                                        ?.kode_mk
                                                }{' '}
                                                • {krs.kelas?.kode_kelas} •{' '}
                                                {krs.kelas?.mata_kuliah?.sks}{' '}
                                                SKS
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Dosen:{' '}
                                                {krs.kelas?.dosen?.nama ||
                                                    '-'}{' '}
                                                •{' '}
                                                {
                                                    krs
                                                        .academic_year_semester
                                                        ?.nama_tahun_akademik
                                                }{' '}
                                                - Semester{' '}
                                                {
                                                    krs
                                                        .academic_year_semester
                                                        ?.semester
                                                }
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                STATUS_VARIANTS[
                                                    krs.status
                                                ] || 'outline'
                                            }
                                        >
                                            {STATUS_LABELS[krs.status] ||
                                                krs.status}
                                        </Badge>
                                    </div>
                                    {krs.status === 'pending' && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-green-700 hover:bg-green-800"
                                                disabled={
                                                    processingUuid ===
                                                    krs.uuid
                                                }
                                                onClick={() =>
                                                    handleApprove(krs)
                                                }
                                            >
                                                <Check className="mr-1 h-3.5 w-3.5" />
                                                Setujui
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={
                                                    processingUuid ===
                                                    krs.uuid
                                                }
                                                onClick={() =>
                                                    handleReject(krs)
                                                }
                                            >
                                                <XCircle className="mr-1 h-3.5 w-3.5" />
                                                Tolak
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

KrsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'KRS', href: '/admin-prodi/krs' },
        ]}
    >
        {page}
    </AppLayout>
);
