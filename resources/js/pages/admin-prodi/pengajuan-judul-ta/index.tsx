import { Head, router, usePage } from '@inertiajs/react';
import { Check, Eye, FileText, Search, X, XCircle } from 'lucide-react';
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

type Pengajuan = {
    id: number;
    uuid: string;
    judul: string;
    status: string;
    catatan: string | null;
    created_at: string;
};

type BimbinganTugasAkhir = {
    id: number;
    judul: string;
    pembimbing1: { id: number; nama: string } | null;
    pembimbing2: { id: number; nama: string } | null;
};

type MahasiswaGroup = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    pengajuan_judul_ta: Pengajuan[];
    bimbingan_tugas_akhir: BimbinganTugasAkhir | null;
};

type PaginatedData = {
    data: MahasiswaGroup[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type DosenOption = {
    id: number;
    nama: string;
    nidn: string | null;
};

type Props = {
    mahasiswas: PaginatedData;
    dosenOptions: DosenOption[];
    filters: {
        search?: string;
        status?: string;
    };
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Belum Disetujui',
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

function statusCounts(pengajuan: Pengajuan[]): Record<string, number> {
    return pengajuan.reduce<Record<string, number>>((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
    }, {});
}

export default function PengajuanJudulTaIndex({
    mahasiswas,
    dosenOptions,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [selectedMahasiswaId, setSelectedMahasiswaId] = useState<
        number | null
    >(null);
    const [processingUuid, setProcessingUuid] = useState<string | null>(null);
    const [erroredUuid, setErroredUuid] = useState<string | null>(null);
    const [pembimbing1ByItem, setPembimbing1ByItem] = useState<
        Record<number, string>
    >({});
    const [pembimbing2ByItem, setPembimbing2ByItem] = useState<
        Record<number, string>
    >({});
    const errors = usePage().props.errors as Record<string, string>;

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin-prodi/pengajuan-judul-ta',
            {
                search,
                status: statusFilter === 'all' ? '' : statusFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const hasActiveFilters = Boolean(filters.search || filters.status);

    const resetFilters = () => {
        setSearch('');
        setStatusFilter('all');
        router.get('/admin-prodi/pengajuan-judul-ta');
    };

    const selectedMahasiswa = mahasiswas.data.find(
        (m) => m.id === selectedMahasiswaId,
    );

    const handleApprove = (item: Pengajuan) => {
        setProcessingUuid(item.uuid);
        setErroredUuid(null);
        router.patch(
            `/admin-prodi/pengajuan-judul-ta/${item.uuid}/approve`,
            {
                pembimbing_1_id: pembimbing1ByItem[item.id] || '',
                pembimbing_2_id: pembimbing2ByItem[item.id] || '',
            },
            {
                preserveScroll: true,
                onError: () => setErroredUuid(item.uuid),
                onFinish: () => setProcessingUuid(null),
            },
        );
    };

    const handleReject = (item: Pengajuan) => {
        setProcessingUuid(item.uuid);
        router.patch(
            `/admin-prodi/pengajuan-judul-ta/${item.uuid}/reject`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingUuid(null),
            },
        );
    };

    return (
        <>
            <Head title="Pengajuan Judul Tugas Akhir" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Pengajuan Judul Tugas Akhir
                    </h1>
                    <p className="text-muted-foreground">
                        Judul tugas akhir yang diajukan mahasiswa program
                        studi, dikelompokkan per mahasiswa
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
                        value={statusFilter}
                        onValueChange={(v) => {
                            setStatusFilter(v);
                            applyFilters({ status: v === 'all' ? '' : v });
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">
                                Belum Disetujui
                            </SelectItem>
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
                                        Jumlah Judul
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
                                            colSpan={5}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {hasActiveFilters
                                                        ? 'Tidak ada pengajuan yang cocok'
                                                        : 'Belum ada pengajuan judul'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Coba ubah kata kunci atau filter'
                                                        : 'Judul tugas akhir yang diajukan mahasiswa akan muncul di sini'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mahasiswas.data.map((mhs) => {
                                        const counts = statusCounts(
                                            mhs.pengajuan_judul_ta,
                                        );

                                        return (
                                            <TableRow key={mhs.id}>
                                                <TableCell className="font-mono font-medium">
                                                    {mhs.nim}
                                                </TableCell>
                                                <TableCell>
                                                    {mhs.nama}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {
                                                        mhs.pengajuan_judul_ta
                                                            .length
                                                    }
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
                                        router.get(
                                            '/admin-prodi/pengajuan-judul-ta',
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

            {/* Detail / approve-reject dialog */}
            <Dialog
                open={selectedMahasiswaId !== null}
                onOpenChange={(open) =>
                    !open && setSelectedMahasiswaId(null)
                }
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{selectedMahasiswa?.nama}</DialogTitle>
                        <DialogDescription>
                            {selectedMahasiswa?.nim} — Daftar judul tugas
                            akhir yang diajukan
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] space-y-3 overflow-y-auto">
                        {selectedMahasiswa?.pengajuan_judul_ta.length ===
                        0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                Belum ada judul yang diajukan pada filter ini
                            </p>
                        ) : (
                            selectedMahasiswa?.pengajuan_judul_ta.map(
                                (item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border p-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="font-medium text-gray-900">
                                                {item.judul}
                                            </p>
                                            <Badge
                                                variant={
                                                    STATUS_VARIANTS[
                                                        item.status
                                                    ] || 'outline'
                                                }
                                            >
                                                {STATUS_LABELS[item.status] ||
                                                    item.status}
                                            </Badge>
                                        </div>
                                        {item.catatan && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Catatan: {item.catatan}
                                            </p>
                                        )}
                                        {item.status === 'disetujui' &&
                                            selectedMahasiswa
                                                ?.bimbingan_tugas_akhir
                                                ?.judul === item.judul && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Pembimbing I:{' '}
                                                    {selectedMahasiswa
                                                        .bimbingan_tugas_akhir
                                                        .pembimbing1?.nama ||
                                                        '-'}
                                                    {selectedMahasiswa
                                                        .bimbingan_tugas_akhir
                                                        .pembimbing2 && (
                                                        <>
                                                            {' '}
                                                            · Pembimbing
                                                            II:{' '}
                                                            {
                                                                selectedMahasiswa
                                                                    .bimbingan_tugas_akhir
                                                                    .pembimbing2
                                                                    .nama
                                                            }
                                                        </>
                                                    )}
                                                </p>
                                            )}
                                        {item.status === 'pending' && (
                                            <div className="mt-3 space-y-2">
                                                <div className="grid gap-2 sm:grid-cols-2">
                                                    <Select
                                                        value={
                                                            pembimbing1ByItem[
                                                                item.id
                                                            ] || ''
                                                        }
                                                        onValueChange={(v) =>
                                                            setPembimbing1ByItem(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [item.id]:
                                                                        v,
                                                                }),
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="text-xs">
                                                            <SelectValue placeholder="Pembimbing I" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {dosenOptions.map(
                                                                (d) => (
                                                                    <SelectItem
                                                                        key={
                                                                            d.id
                                                                        }
                                                                        value={d.id.toString()}
                                                                    >
                                                                        {
                                                                            d.nama
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <Select
                                                        value={
                                                            pembimbing2ByItem[
                                                                item.id
                                                            ] || ''
                                                        }
                                                        onValueChange={(v) =>
                                                            setPembimbing2ByItem(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [item.id]:
                                                                        v,
                                                                }),
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="text-xs">
                                                            <SelectValue placeholder="Pembimbing II (opsional)" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {dosenOptions
                                                                .filter(
                                                                    (d) =>
                                                                        d.id.toString() !==
                                                                        pembimbing1ByItem[
                                                                            item
                                                                                .id
                                                                        ],
                                                                )
                                                                .map((d) => (
                                                                    <SelectItem
                                                                        key={
                                                                            d.id
                                                                        }
                                                                        value={d.id.toString()}
                                                                    >
                                                                        {
                                                                            d.nama
                                                                        }
                                                                    </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {erroredUuid === item.uuid &&
                                                    (errors?.pembimbing_1_id ||
                                                        errors?.pembimbing_2_id) && (
                                                        <p className="text-xs text-destructive">
                                                            {errors.pembimbing_1_id ||
                                                                errors.pembimbing_2_id}
                                                        </p>
                                                    )}
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-700 hover:bg-green-800"
                                                        disabled={
                                                            processingUuid ===
                                                                item.uuid ||
                                                            !pembimbing1ByItem[
                                                                item.id
                                                            ]
                                                        }
                                                        onClick={() =>
                                                            handleApprove(item)
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
                                                            item.uuid
                                                        }
                                                        onClick={() =>
                                                            handleReject(item)
                                                        }
                                                    >
                                                        <XCircle className="mr-1 h-3.5 w-3.5" />
                                                        Tolak
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ),
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

PengajuanJudulTaIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            {
                title: 'Pengajuan Judul TA',
                href: '/admin-prodi/pengajuan-judul-ta',
            },
        ]}
    >
        {page}
    </AppLayout>
);
