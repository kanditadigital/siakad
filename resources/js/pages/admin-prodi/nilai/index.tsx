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

type Nilai = {
    id: number;
    uuid: string;
    nilai: number | null;
    grade: string | null;
    status: string;
    krs: {
        mahasiswa: {
            nim: string;
            nama: string;
        };
        kelas: {
            mata_kuliah: {
                nama_mk: string;
            };
        };
    };
};

type PaginatedData = {
    data: Nilai[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    nilais: PaginatedData;
    filters: {
        search?: string;
    };
};

const GRADE_COLORS: Record<string, string> = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
};

export default function NilaiIndex({ nilais, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get('/admin-prodi/nilai', {
            search,
            ...overrides,
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Data Nilai" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Data Nilai</h1>
                    <p className="text-muted-foreground">Data nilai mahasiswa program studi</p>
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
                                <TableHead>Mata Kuliah</TableHead>
                                <TableHead>Nilai</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nilais.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Tidak ada data nilai
                                    </TableCell>
                                </TableRow>
                            ) : (
                                nilais.data.map((nilai) => (
                                    <TableRow key={nilai.id}>
                                        <TableCell className="font-mono font-medium">{nilai.krs?.mahasiswa?.nim}</TableCell>
                                        <TableCell>{nilai.krs?.mahasiswa?.nama}</TableCell>
                                        <TableCell>{nilai.krs?.kelas?.mata_kuliah?.nama_mk}</TableCell>
                                        <TableCell className="font-medium">{nilai.nilai ?? '-'}</TableCell>
                                        <TableCell>
                                            {nilai.grade ? (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}>
                                                    {nilai.grade}
                                                </span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin-prodi/nilai/${nilai.uuid}`}>
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

                {nilais.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {nilais.data.length} dari {nilais.total} data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: nilais.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === nilais.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get('/admin-prodi/nilai', { ...filters, page })}
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

NilaiIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'Nilai', href: '/admin-prodi/nilai' },
    ]}>
        {page}
    </AppLayout>
);
