import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, Eye, Search, X } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';

type Krs = {
    id: number;
    uuid: string;
    created_at: string;
    mahasiswa: { nim: string; nama: string };
    kelas: { mata_kuliah: { nama_mk: string; sks: number } } | null;
    academic_year_semester: { nama_tahun_akademik: string; semester: string };
};

type PaginatedData = {
    data: Krs[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    krss: PaginatedData;
    filters: { search?: string };
};

export default function KrsPaIndex({ krss, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applySearch = () => {
        router.get('/dosen/krs-pa', { search }, { preserveState: true });
    };

    const resetFilters = () => {
        setSearch('');
        router.get('/dosen/krs-pa');
    };

    return (
        <>
            <Head title="Review KRS (PA)" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Review KRS (PA)
                    </h1>
                    <p className="text-muted-foreground">
                        KRS mahasiswa asuh Anda yang menunggu persetujuan —
                        independen dari persetujuan Admin Prodi
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm min-w-[200px] flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari NIM atau nama mahasiswa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && applySearch()
                            }
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline" onClick={applySearch}>
                        Cari
                    </Button>
                    {filters.search && (
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

                <div className="rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead>SKS</TableHead>
                                    <TableHead>Periode</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {krss.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {filters.search
                                                        ? 'Tidak ada KRS yang cocok'
                                                        : 'Tidak ada KRS menunggu review'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    KRS baru dari mahasiswa
                                                    asuh Anda akan muncul di
                                                    sini
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    krss.data.map((krs) => (
                                        <TableRow key={krs.id}>
                                            <TableCell className="font-mono">
                                                {krs.mahasiswa.nim}
                                            </TableCell>
                                            <TableCell>
                                                {krs.mahasiswa.nama}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.mata_kuliah
                                                    .nama_mk || '-'}
                                            </TableCell>
                                            <TableCell>
                                                {krs.kelas?.mata_kuliah.sks ??
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    krs.academic_year_semester
                                                        .nama_tahun_akademik
                                                }{' '}
                                                - Semester{' '}
                                                {
                                                    krs.academic_year_semester
                                                        .semester
                                                }
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    href={`/dosen/krs-pa/${krs.uuid}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Review"
                                                    >
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
                </div>

                {krss.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {krss.data.length} dari {krss.total}{' '}
                            data
                        </p>
                        <div className="flex items-center gap-2">
                            {Array.from(
                                { length: krss.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <Button
                                    key={page}
                                    variant={
                                        page === krss.current_page
                                            ? 'default'
                                            : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        router.get('/dosen/krs-pa', {
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

KrsPaIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Review KRS (PA)', href: '/dosen/krs-pa' },
        ]}
    >
        {page}
    </AppLayout>
);
