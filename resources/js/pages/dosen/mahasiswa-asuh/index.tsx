import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { UserMinus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
    jenis_kelamin: string;
    status: string;
    program_studi: { nama_prodi: string };
    user: { email: string };
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
};

export default function MahasiswaAsuhIndex({ mahasiswas }: Props) {
    const handleRemove = (id: number) => {
        router.delete(`/dosen/mahasiswa-asuh/${id}`);
    };

    return (
        <>
            <Head title="Mahasiswa Asuh (PA)" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Mahasiswa Asuh (PA)</h1>
                    <p className="text-muted-foreground">Daftar mahasiswa yang menjadi bimbingan akademik anda</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Mahasiswa Asuh</CardTitle>
                        <CardDescription>Total {mahasiswas.total} mahasiswa</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Program Studi</TableHead>
                                    <TableHead>Jenis Kelamin</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mahasiswas.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8">
                                            Belum ada mahasiswa asuh
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    mahasiswas.data.map((mhs) => (
                                        <TableRow key={mhs.id}>
                                            <TableCell className="font-mono font-medium">{mhs.nim}</TableCell>
                                            <TableCell>{mhs.nama}</TableCell>
                                            <TableCell>{mhs.program_studi?.nama_prodi}</TableCell>
                                            <TableCell>{mhs.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                                            <TableCell>{mhs.user?.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={mhs.status === 'aktif' ? 'default' : 'secondary'}>
                                                    {mhs.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <UserMinus className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus Mahasiswa Asuh</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah anda yakin ingin menghapus {mhs.nama} dari daftar mahasiswa asuh?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleRemove(mhs.id)} className="bg-red-600 hover:bg-red-700">
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {mahasiswas.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Menampilkan {mahasiswas.data.length} dari {mahasiswas.total} data
                                </p>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: mahasiswas.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === mahasiswas.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => router.get('/dosen/mahasiswa-asuh', { page })}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MahasiswaAsuhIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mahasiswa Asuh (PA)', href: '/dosen/mahasiswa-asuh' },
    ]}>{page}</AppLayout>
);
