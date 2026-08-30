import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    jenis_kelamin: string;
    status: string;
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
    filters: {
        search?: string;
        status?: string;
    };
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    nonaktif: 'Nonaktif',
    lulus: 'Lulus',
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    aktif: 'default',
    cuti: 'secondary',
    nonaktif: 'destructive',
    lulus: 'outline',
};

export default function MahasiswaIndex({ mahasiswas, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get('/admin-prodi/mahasiswa', {
            search,
            status: statusFilter === 'all' ? '' : statusFilter,
            ...overrides,
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Data Mahasiswa" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Data Mahasiswa</h1>
                    <p className="text-muted-foreground">Daftar mahasiswa program studi</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIM atau nama..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => applyFilters({ status: v === 'all' ? '' : v })}>
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
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NIM</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mahasiswas.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Tidak ada data mahasiswa
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mahasiswas.data.map((mhs) => (
                                    <TableRow key={mhs.id}>
                                        <TableCell className="font-mono font-medium">{mhs.nim}</TableCell>
                                        <TableCell>{mhs.nama}</TableCell>
                                        <TableCell>{mhs.jenis_kelamin}</TableCell>
                                        <TableCell>
                                            <Badge variant={STATUS_VARIANTS[mhs.status] || 'outline'}>
                                                {STATUS_LABELS[mhs.status] || mhs.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin-prodi/mahasiswa/${mhs.uuid}`}>
                                                <Button variant="ghost" size="icon">
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

                {mahasiswas.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {mahasiswas.data.length} dari {mahasiswas.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: mahasiswas.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === mahasiswas.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get('/admin-prodi/mahasiswa', { ...filters, page })}
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
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'Mahasiswa', href: '/admin-prodi/mahasiswa' },
    ]}>
        {page}
    </AppLayout>
);
