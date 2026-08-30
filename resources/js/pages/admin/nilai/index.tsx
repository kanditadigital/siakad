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
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
};

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
};

type Kelas = {
    id: number;
    kode_kelas: string;
    mata_kuliah: MataKuliah;
};

type Krs = {
    id: number;
    mahasiswa: Mahasiswa;
    kelas: Kelas;
};

type Nilai = {
    id: number;
    uuid: string;
    nilai: number | null;
    grade: string | null;
    status: string;
    keterangan: string | null;
    krs: Krs;
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
        status?: string;
        grade?: string;
    };
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    belum: 'outline',
    tercatat: 'default',
};

const STATUS_LABELS: Record<string, string> = {
    belum: 'Belum',
    tercatat: 'Tercatat',
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
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [gradeFilter, setGradeFilter] = useState(filters.grade || 'all');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get('/admin/nilai', {
            search,
            status: statusFilter === 'all' ? '' : statusFilter,
            grade: gradeFilter === 'all' ? '' : gradeFilter,
            ...overrides,
        }, { preserveState: true });
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/nilai/${uuid}`);
    };

    return (
        <>
            <Head title="Data Nilai" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Data Nilai</h1>
                        <p className="text-muted-foreground">Kelola data nilai mahasiswa</p>
                    </div>
                    <Link href="/admin/nilai/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Nilai
                        </Button>
                    </Link>
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
                    <Select value={gradeFilter} onValueChange={(v) => applyFilters({ grade: v === 'all' ? '' : v })}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Semua Grade" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Grade</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                            <SelectItem value="E">E</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={(v) => applyFilters({ status: v === 'all' ? '' : v })}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="belum">Belum</SelectItem>
                            <SelectItem value="tercatat">Tercatat</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NIM</TableHead>
                                <TableHead>Nama Mahasiswa</TableHead>
                                <TableHead>Mata Kuliah</TableHead>
                                <TableHead>SKS</TableHead>
                                <TableHead>Nilai</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nilais.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        Tidak ada data nilai
                                    </TableCell>
                                </TableRow>
                            ) : (
                                nilais.data.map((nilai) => (
                                    <TableRow key={nilai.id}>
                                        <TableCell className="font-mono font-medium">{nilai.krs?.mahasiswa?.nim}</TableCell>
                                        <TableCell>{nilai.krs?.mahasiswa?.nama}</TableCell>
                                        <TableCell>{nilai.krs?.kelas?.mata_kuliah?.nama_mk}</TableCell>
                                        <TableCell>{nilai.krs?.kelas?.mata_kuliah?.sks}</TableCell>
                                        <TableCell className="font-medium">{nilai.nilai ?? '-'}</TableCell>
                                        <TableCell>
                                            {nilai.grade ? (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${GRADE_COLORS[nilai.grade] || ''}`}>
                                                    {nilai.grade}
                                                </span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell><Badge variant={STATUS_VARIANTS[nilai.status] || 'outline'}>{STATUS_LABELS[nilai.status] || nilai.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/nilai/${nilai.uuid}`}><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                                                <Link href={`/admin/nilai/${nilai.uuid}/edit`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus Nilai</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah anda yakin ingin menghapus nilai ini?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(nilai.uuid)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
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

                {nilais.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Menampilkan {nilais.data.length} dari {nilais.total} data</p>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: nilais.last_page }, (_, i) => i + 1).map((page) => (
                                <Button key={page} variant={page === nilais.current_page ? 'default' : 'outline'} size="sm" onClick={() => router.get('/admin/nilai', { ...filters, page })}>{page}</Button>
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
        { title: 'Data Nilai', href: '/admin/nilai' },
    ]}>{page}</AppLayout>
);
