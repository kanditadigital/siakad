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
import { Search, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Kelas = {
    id: number;
    uuid: string;
    kode_kelas: string;
    nama_kelas: string;
    semester: string;
    tahun_akademik: string;
    kapasitas: number;
    status: string;
    mata_kuliah: {
        nama_mk: string;
        kode_mk: string;
        sks: number;
    };
    dosen: {
        nama: string;
    } | null;
    ruang: {
        kode_ruang: string;
    } | null;
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
    filters: {
        search?: string;
    };
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Aktif: 'default',
    'Tidak Aktif': 'secondary',
    Selesai: 'outline',
};

export default function PenjadwalanIndex({ kelases, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get('/admin-prodi/penjadwalan', {
            search,
            ...overrides,
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Data Penjadwalan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Data Penjadwalan</h1>
                    <p className="text-muted-foreground">Jadwal kelas perkuliahan program studi</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode atau nama kelas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kode Kelas</TableHead>
                                <TableHead>Nama Kelas</TableHead>
                                <TableHead>Mata Kuliah</TableHead>
                                <TableHead>SKS</TableHead>
                                <TableHead>Dosen</TableHead>
                                <TableHead>Ruang</TableHead>
                                <TableHead>Semester</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {kelases.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8">
                                        Tidak ada data penjadwalan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                kelases.data.map((kelas) => (
                                    <TableRow key={kelas.id}>
                                        <TableCell className="font-mono font-medium">{kelas.kode_kelas}</TableCell>
                                        <TableCell>{kelas.nama_kelas}</TableCell>
                                        <TableCell>{kelas.mata_kuliah?.nama_mk}</TableCell>
                                        <TableCell>{kelas.mata_kuliah?.sks}</TableCell>
                                        <TableCell>{kelas.dosen?.nama || '-'}</TableCell>
                                        <TableCell>{kelas.ruang?.kode_ruang || '-'}</TableCell>
                                        <TableCell>Sem {kelas.semester}</TableCell>
                                        <TableCell>
                                            <Badge variant={STATUS_VARIANTS[kelas.status] || 'outline'}>
                                                {kelas.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin-prodi/penjadwalan/${kelas.uuid}`}>
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

                {kelases.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {kelases.data.length} dari {kelases.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: kelases.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === kelases.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get('/admin-prodi/penjadwalan', { ...filters, page })}
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
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'Penjadwalan', href: '/admin-prodi/penjadwalan' },
    ]}>
        {page}
    </AppLayout>
);
