import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ClipboardList, BookOpen, User, Clock } from 'lucide-react';

type Krs = {
    id: number;
    status: string;
    created_at: string;
    kelas: {
        nama_kelas: string;
        mata_kuliah: {
            kode_mk: string;
            nama_mk: string;
            sks: number;
        };
        dosen: {
            nama: string;
        } | null;
        ruang: {
            kode_ruang: string;
        } | null;
    };
    academic_year_semester: {
        nama_tahun_akademik: string;
        semester: string;
    };
};

type Props = {
    krss: Krs[];
    mahasiswa: {
        nim: string;
        nama: string;
    };
};

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'outline',
    approved: 'default',
    rejected: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    approved: 'Disetujui',
    rejected: 'Ditolak',
};

export default function KrsMahasiswa({ krss, mahasiswa }: Props) {
    const totalSks = krss
        .filter((k) => k.status === 'approved')
        .reduce((sum, k) => sum + (k.kelas?.mata_kuliah?.sks || 0), 0);

    return (
        <>
            <Head title="KRS Mahasiswa" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                        Kartu Rencana Studi (KRS)
                    </h1>
                    <p className="text-siak-sage">
                        {mahasiswa.nama} ({mahasiswa.nim})
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total KRS
                            </CardTitle>
                            <ClipboardList className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {krss.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total SKS Disetujui
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {totalSks}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Disetujui
                            </CardTitle>
                            <Clock className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {krss.filter((k) => k.status === 'approved').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card className="border-siak-moss/60">
                    <CardHeader>
                        <CardTitle className="text-siak-pine">Daftar KRS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kode MK</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead>SKS</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Dosen</TableHead>
                                    <TableHead>Ruang</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {krss.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8">
                                            Belum ada data KRS
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    krss.map((krs) => (
                                        <TableRow key={krs.id}>
                                            <TableCell className="font-mono font-medium">
                                                {krs.kelas?.mata_kuliah?.kode_mk}
                                            </TableCell>
                                            <TableCell>{krs.kelas?.mata_kuliah?.nama_mk}</TableCell>
                                            <TableCell>{krs.kelas?.mata_kuliah?.sks}</TableCell>
                                            <TableCell>{krs.kelas?.nama_kelas}</TableCell>
                                            <TableCell>{krs.kelas?.dosen?.nama || '-'}</TableCell>
                                            <TableCell>{krs.kelas?.ruang?.kode_ruang || '-'}</TableCell>
                                            <TableCell>
                                                {krs.academic_year_semester?.nama_tahun_akademik} - {krs.academic_year_semester?.semester}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={STATUS_VARIANTS[krs.status] || 'outline'}>
                                                    {STATUS_LABELS[krs.status] || krs.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

KrsMahasiswa.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'KRS', href: '/mahasiswa/krs' },
    ],
});
