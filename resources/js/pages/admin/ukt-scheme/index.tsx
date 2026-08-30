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

type UktScheme = {
    id: number;
    uuid: string;
    nama: string;
    jumlah: number;
    keterangan: string | null;
    aktif: boolean;
};

type PaginatedData = {
    data: UktScheme[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

type Props = {
    uktSchemes: PaginatedData;
    filters: {
        search?: string;
        aktif?: string;
    };
};

const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

export default function UktSchemeIndex({ uktSchemes, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [aktifFilter, setAktifFilter] = useState(filters.aktif || 'all');

    const applyFilters = (overrides: Record<string, string>) => {
        router.get('/admin/ukt-scheme', {
            search,
            aktif: aktifFilter === 'all' ? '' : aktifFilter,
            ...overrides,
        }, { preserveState: true });
    };

    const handleDelete = (uuid: string) => {
        router.delete(`/admin/ukt-scheme/${uuid}`);
    };

    return (
        <>
            <Head title="Data Skema UKT" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Data Skema UKT</h1>
                        <p className="text-muted-foreground">Kelola skema uang kuliah tunggal</p>
                    </div>
                    <Link href="/admin/ukt-scheme/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Skema UKT
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari nama skema UKT..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search })}
                            className="pl-9"
                        />
                    </div>
                    <Select value={aktifFilter} onValueChange={(v) => applyFilters({ aktif: v === 'all' ? '' : v })}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="true">Aktif</SelectItem>
                            <SelectItem value="false">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Skema</TableHead>
                                <TableHead>Jumlah</TableHead>
                                <TableHead>Keterangan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uktSchemes.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        Tidak ada data skema UKT
                                    </TableCell>
                                </TableRow>
                            ) : (
                                uktSchemes.data.map((scheme) => (
                                    <TableRow key={scheme.id}>
                                        <TableCell className="font-medium">{scheme.nama}</TableCell>
                                        <TableCell className="font-medium">{formatRupiah(scheme.jumlah)}</TableCell>
                                        <TableCell>{scheme.keterangan || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={scheme.aktif ? 'default' : 'secondary'}>
                                                {scheme.aktif ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/ukt-scheme/${scheme.uuid}`}><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                                                <Link href={`/admin/ukt-scheme/${scheme.uuid}/edit`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus Skema UKT</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah anda yakin ingin menghapus skema UKT {scheme.nama}?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(scheme.uuid)} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
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

                {uktSchemes.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Menampilkan {uktSchemes.data.length} dari {uktSchemes.total} data</p>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: uktSchemes.last_page }, (_, i) => i + 1).map((page) => (
                                <Button key={page} variant={page === uktSchemes.current_page ? 'default' : 'outline'} size="sm" onClick={() => router.get('/admin/ukt-scheme', { ...filters, page })}>{page}</Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

UktSchemeIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Skema UKT', href: '/admin/ukt-scheme' },
    ]}>{page}</AppLayout>
);
