import { Head, router } from '@inertiajs/react';
import { Search, UserCheck, UserCog, UserX, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

type DosenOption = {
    id: number;
    nama: string;
    nidn: string;
};

type MahasiswaOption = {
    id: number;
    nim: string;
    nama: string;
};

type Mahasiswa = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    pa_dosen: DosenOption | null;
};

type PaginatedData = {
    data: Mahasiswa[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Stats = {
    total: number;
    sudah_ada_pa: number;
    belum_ada_pa: number;
};

type Props = {
    mahasiswas: PaginatedData;
    dosens: DosenOption[];
    mahasiswaOptions: MahasiswaOption[];
    stats: Stats;
    filters: {
        search?: string;
        pa_dosen_id?: string;
        mahasiswa_id?: string;
    };
};

function DosenPaCell({
    mahasiswa,
    dosens,
}: {
    mahasiswa: Mahasiswa;
    dosens: DosenOption[];
}) {
    const [value, setValue] = useState(
        mahasiswa.pa_dosen?.id.toString() || '',
    );
    const [saving, setSaving] = useState(false);

    const handleChange = (v: string) => {
        setValue(v);
        setSaving(true);
        router.patch(
            `/admin-prodi/mahasiswa/${mahasiswa.uuid}/dosen-pa`,
            { pa_dosen_id: v || null },
            { preserveScroll: true, onFinish: () => setSaving(false) },
        );
    };

    return (
        <Select value={value} onValueChange={handleChange} disabled={saving}>
            <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Belum ada Dosen PA" />
            </SelectTrigger>
            <SelectContent>
                {dosens.map((d) => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                        {d.nama} ({d.nidn})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default function DosenPaIndex({
    mahasiswas,
    dosens,
    mahasiswaOptions,
    stats,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [dosenFilter, setDosenFilter] = useState(
        filters.pa_dosen_id || 'all',
    );
    const [mahasiswaFilter, setMahasiswaFilter] = useState(
        filters.mahasiswa_id || 'all',
    );
    const [mahasiswaSearch, setMahasiswaSearch] = useState('');

    const filteredMahasiswaOptions = useMemo(() => {
        const q = mahasiswaSearch.trim().toLowerCase();

        if (q === '') {
            return mahasiswaOptions;
        }

        return mahasiswaOptions.filter(
            (m) =>
                m.nim.toLowerCase().includes(q) ||
                m.nama.toLowerCase().includes(q),
        );
    }, [mahasiswaOptions, mahasiswaSearch]);

    const applyFilters = (overrides: Record<string, string>) => {
        router.get(
            '/admin-prodi/dosen-pa',
            {
                search,
                pa_dosen_id: dosenFilter === 'all' ? '' : dosenFilter,
                mahasiswa_id: mahasiswaFilter === 'all' ? '' : mahasiswaFilter,
                ...overrides,
            },
            { preserveState: true },
        );
    };

    const hasActiveFilters = Boolean(
        filters.search || filters.pa_dosen_id || filters.mahasiswa_id,
    );

    const resetFilters = () => {
        setSearch('');
        setDosenFilter('all');
        setMahasiswaFilter('all');
        setMahasiswaSearch('');
        router.get('/admin-prodi/dosen-pa');
    };

    return (
        <>
            <Head title="Dosen PA" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Dosen Pembimbing Akademik (PA)
                    </h1>
                    <p className="text-muted-foreground">
                        Tetapkan dosen pembimbing akademik untuk setiap
                        mahasiswa program studi
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <Users className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Total Mahasiswa
                                </p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {stats.total}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <UserCheck className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Sudah Ada Dosen PA
                                </p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {stats.sudah_ada_pa}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                                <UserX className="h-5 w-5 text-amber-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Belum Ada Dosen PA
                                </p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {stats.belum_ada_pa}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
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

                    <div className="flex flex-col gap-1.5">
                        <div className="relative w-[220px]">
                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={mahasiswaSearch}
                                onChange={(e) =>
                                    setMahasiswaSearch(e.target.value)
                                }
                                placeholder="Cari mahasiswa untuk filter..."
                                className="h-8 pl-8 text-xs"
                            />
                        </div>
                        <Select
                            value={mahasiswaFilter}
                            onValueChange={(v) => {
                                setMahasiswaFilter(v);
                                applyFilters({
                                    mahasiswa_id: v === 'all' ? '' : v,
                                });
                            }}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Semua Mahasiswa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Mahasiswa
                                </SelectItem>
                                {filteredMahasiswaOptions.length === 0 ? (
                                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                        Tidak ada mahasiswa yang cocok
                                    </div>
                                ) : (
                                    filteredMahasiswaOptions.map((m) => (
                                        <SelectItem
                                            key={m.id}
                                            value={m.id.toString()}
                                        >
                                            {m.nim} - {m.nama}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <Select
                        value={dosenFilter}
                        onValueChange={(v) => {
                            setDosenFilter(v);
                            applyFilters({
                                pa_dosen_id: v === 'all' ? '' : v,
                            });
                        }}
                    >
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Semua Dosen PA" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Dosen PA
                            </SelectItem>
                            {dosens.map((d) => (
                                <SelectItem key={d.id} value={d.id.toString()}>
                                    {d.nama}
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

                {/* Table */}
                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Dosen PA</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mahasiswas.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <UserCog className="h-8 w-8 text-muted-foreground/50" />
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
                                                {mhs.pa_dosen ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-green-200 text-green-700"
                                                    >
                                                        Sudah Ada PA
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-amber-200 text-amber-700"
                                                    >
                                                        Belum Ada PA
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DosenPaCell
                                                    mahasiswa={mhs}
                                                    dosens={dosens}
                                                />
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
                                        router.get('/admin-prodi/dosen-pa', {
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

DosenPaIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Dosen PA', href: '/admin-prodi/dosen-pa' },
        ]}
    >
        {page}
    </AppLayout>
);
