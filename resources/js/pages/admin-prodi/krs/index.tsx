import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type Krs = {
    id: number;
    uuid: string;
    mahasiswa: {
        nim: string;
        nama: string;
    };
    kelas: {
        kode_kelas: string;
        nama_kelas: string;
        mata_kuliah: {
            nama_mk: string;
            sks: number;
        };
    };
};

type PaginatedData = {
    data: Krs[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    krss: PaginatedData;
    filters: {
        search?: string;
    };
};

export default function KrsIndex({ krss, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get('/admin-prodi/krs', {
            search,
            ...overrides,
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Data KRS" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Data KRS</h1>
                    <p className="text-muted-foreground">Kartu Rencana Studi mahasiswa program studi</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIM atau nama mahasiswa..."
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
                                <TableHead>NIM Mahasiswa</TableHead>
                                <TableHead>Nama Mahasiswa</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Mata Kuliah</TableHead>
                                <TableHead>SKS</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {krss.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Tidak ada data KRS
                                    </TableCell>
                                </TableRow>
                            ) : (
                                krss.data.map((krs) => (
                                    <TableRow key={krs.id}>
                                        <TableCell className="font-mono font-medium">{krs.mahasiswa?.nim}</TableCell>
                                        <TableCell>{krs.mahasiswa?.nama}</TableCell>
                                        <TableCell>{krs.kelas?.kode_kelas}</TableCell>
                                        <TableCell>{krs.kelas?.mata_kuliah?.nama_mk}</TableCell>
                                        <TableCell>{krs.kelas?.mata_kuliah?.sks}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin-prodi/krs/${krs.uuid}`}>
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

                {krss.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {krss.data.length} dari {krss.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: krss.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === krss.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get('/admin-prodi/krs', { ...filters, page })}
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

KrsIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'KRS', href: '/admin-prodi/krs' },
    ]}>
        {page}
    </AppLayout>
);
