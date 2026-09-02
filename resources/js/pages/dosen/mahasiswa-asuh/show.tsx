import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    BookOpen,
    Calendar,
    ClipboardList,
    MessageSquare,
    Plus,
    TrendingUp,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    status: string;
    semester_saat_ini: number;
    batas_semester_normal: number;
    angkatan: number | null;
    ipk: number;
    total_sks_lulus: number;
    program_studi: { nama_prodi: string };
};

type Perkembangan = {
    semester_ke: number;
    periode: string;
    ips: number;
    ipk: number;
    sks: number;
};

type MataKuliahBermasalah = {
    mata_kuliah: { kode_mk: string; nama_mk: string; sks: number };
    grade: string;
    nilai: number;
    periode: string;
};

type PresensiPerKelas = {
    mata_kuliah: string | null;
    persentase_hadir: number | null;
    total_pertemuan: number;
};

type RingkasanPresensi = {
    persentase_hadir: number | null;
    per_kelas: PresensiPerKelas[];
};

type Bimbingan = {
    id: number;
    uuid: string;
    topik: string;
    catatan: string;
    created_at: string;
    dosen: { nama: string };
    krs_id: number | null;
};

type Props = {
    mahasiswa: Mahasiswa;
    perkembanganAkademik: Perkembangan[];
    mataKuliahBermasalah: MataKuliahBermasalah[];
    ringkasanPresensi: RingkasanPresensi;
    riwayatBimbingan: Bimbingan[];
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    nonaktif: 'Nonaktif',
    lulus: 'Lulus',
};

export default function MahasiswaAsuhShow({
    mahasiswa,
    perkembanganAkademik,
    mataKuliahBermasalah,
    ringkasanPresensi,
    riwayatBimbingan,
}: Props) {
    const [openCatatan, setOpenCatatan] = useState(false);
    const catatanForm = useForm({ topik: '', catatan: '' });

    const handleCatatanSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        catatanForm.post(`/dosen/mahasiswa-asuh/${mahasiswa.uuid}/bimbingan`, {
            onSuccess: () => {
                setOpenCatatan(false);
                catatanForm.reset();
            },
        });
    };

    return (
        <>
            <Head title={`Mahasiswa Asuh - ${mahasiswa.nama}`} />

            <div className="space-y-6">
                <Link
                    href="/dosen/mahasiswa-asuh"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Mahasiswa Asuh
                </Link>

                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <User className="h-12 w-12 text-siak-pine" />
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIM</p>
                                    <p className="font-mono text-lg font-semibold">
                                        {mahasiswa.nim}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {mahasiswa.nama}
                                    </h1>
                                    <p className="text-gray-600">
                                        {mahasiswa.program_studi?.nama_prodi} •
                                        Angkatan {mahasiswa.angkatan ?? '-'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant={
                                            mahasiswa.status === 'aktif'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {STATUS_LABELS[mahasiswa.status] ||
                                            mahasiswa.status}
                                    </Badge>
                                    <Badge variant="outline">
                                        Semester {mahasiswa.semester_saat_ini}
                                    </Badge>
                                    {mahasiswa.semester_saat_ini >
                                        mahasiswa.batas_semester_normal && (
                                        <Badge
                                            variant="outline"
                                            className="border-amber-300 bg-amber-50 text-amber-700"
                                        >
                                            Melebihi Masa Studi Normal
                                        </Badge>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            IPK
                                        </p>
                                        <p className="text-xl font-bold tabular-nums text-gray-900">
                                            {mahasiswa.ipk.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Total SKS Lulus
                                        </p>
                                        <p className="text-xl font-bold tabular-nums text-gray-900">
                                            {mahasiswa.total_sks_lulus}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Kehadiran Semester Ini
                                        </p>
                                        <p className="text-xl font-bold tabular-nums text-gray-900">
                                            {ringkasanPresensi.persentase_hadir !==
                                            null
                                                ? `${ringkasanPresensi.persentase_hadir}%`
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <TrendingUp className="h-5 w-5 text-green-700" />
                                Perkembangan Akademik
                            </CardTitle>
                            <CardDescription>
                                IPS dan IPK per semester — lihat apakah
                                performa menurun
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Semester</TableHead>
                                            <TableHead className="text-right">
                                                IPS
                                            </TableHead>
                                            <TableHead className="text-right">
                                                IPK
                                            </TableHead>
                                            <TableHead className="text-right">
                                                SKS
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {perkembanganAkademik.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="py-6 text-center text-sm text-muted-foreground"
                                                >
                                                    Belum ada nilai tercatat
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            perkembanganAkademik.map(
                                                (row, index) => {
                                                    const prev =
                                                        perkembanganAkademik[
                                                            index - 1
                                                        ];
                                                    const menurun =
                                                        prev &&
                                                        row.ips < prev.ips;

                                                    return (
                                                        <TableRow
                                                            key={
                                                                row.semester_ke
                                                            }
                                                        >
                                                            <TableCell>
                                                                {row.periode}
                                                            </TableCell>
                                                            <TableCell className="text-right tabular-nums">
                                                                <span className="inline-flex items-center gap-1">
                                                                    {row.ips.toFixed(
                                                                        2,
                                                                    )}
                                                                    {menurun && (
                                                                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                                                                    )}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right tabular-nums">
                                                                {row.ipk.toFixed(
                                                                    2,
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right tabular-nums">
                                                                {row.sks}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                },
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Mata Kuliah Bermasalah
                            </CardTitle>
                            <CardDescription>
                                Nilai D/E — belum lulus, perlu diulang
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {mataKuliahBermasalah.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    Tidak ada mata kuliah bermasalah
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {mataKuliahBermasalah.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between rounded-md border p-3"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.mata_kuliah.nama_mk}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {item.mata_kuliah.kode_mk}{' '}
                                                    • {item.periode}
                                                </p>
                                            </div>
                                            <Badge variant="destructive">
                                                {item.grade}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                            <Calendar className="h-5 w-5 text-green-700" />
                            Ringkasan Presensi Semester Ini
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {ringkasanPresensi.per_kelas.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                Belum ada data presensi periode ini
                            </p>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {ringkasanPresensi.per_kelas.map(
                                    (kelas, i) => (
                                        <div
                                            key={i}
                                            className="rounded-md border p-3"
                                        >
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {kelas.mata_kuliah || '-'}
                                            </p>
                                            <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
                                                {kelas.persentase_hadir ?? '-'}
                                                %
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {kelas.total_pertemuan}{' '}
                                                pertemuan tercatat
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <MessageSquare className="h-5 w-5 text-green-700" />
                                Riwayat Bimbingan Akademik
                            </CardTitle>
                            <CardDescription>
                                Catatan konsultasi tersimpan di SIAKAD, bukan
                                hanya lewat chat
                            </CardDescription>
                        </div>
                        <Dialog
                            open={openCatatan}
                            onOpenChange={setOpenCatatan}
                        >
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Catatan
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Tambah Catatan Bimbingan
                                    </DialogTitle>
                                    <DialogDescription>
                                        Catatan ini akan tersimpan di riwayat
                                        bimbingan mahasiswa
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleCatatanSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="topik">Topik</Label>
                                        <Input
                                            id="topik"
                                            value={catatanForm.data.topik}
                                            onChange={(e) =>
                                                catatanForm.setData(
                                                    'topik',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Konsultasi KRS Semester 5"
                                            aria-invalid={
                                                !!catatanForm.errors.topik
                                            }
                                        />
                                        {catatanForm.errors.topik && (
                                            <p className="text-sm text-destructive">
                                                {catatanForm.errors.topik}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="catatan">
                                            Catatan
                                        </Label>
                                        <Textarea
                                            id="catatan"
                                            value={catatanForm.data.catatan}
                                            onChange={(e) =>
                                                catatanForm.setData(
                                                    'catatan',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder='Contoh: "Disarankan maksimal 21 SKS karena IPS semester sebelumnya 2,70."'
                                            rows={4}
                                            aria-invalid={
                                                !!catatanForm.errors.catatan
                                            }
                                        />
                                        {catatanForm.errors.catatan && (
                                            <p className="text-sm text-destructive">
                                                {catatanForm.errors.catatan}
                                            </p>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={catatanForm.processing}
                                        >
                                            {catatanForm.processing
                                                ? 'Menyimpan...'
                                                : 'Simpan'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        {riwayatBimbingan.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                Belum ada catatan bimbingan
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {riwayatBimbingan.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-md border p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium text-gray-900">
                                                {item.topik}
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(
                                                    item.created_at,
                                                ).toLocaleDateString(
                                                    'id-ID',
                                                    { dateStyle: 'long' },
                                                )}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-700">
                                            {item.catatan}
                                        </p>
                                        {item.krs_id && (
                                            <Badge
                                                variant="outline"
                                                className="mt-2"
                                            >
                                                <ClipboardList className="mr-1 h-3 w-3" />
                                                Dari review KRS
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    <BookOpen className="h-4 w-4 shrink-0" />
                    Halaman ini hanya untuk evaluasi — nilai, tagihan, jadwal,
                    dan kelulusan tidak dapat diubah dari sini.
                </div>
            </div>
        </>
    );
}

MahasiswaAsuhShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            {
                title: 'Mahasiswa Asuh (PA)',
                href: '/dosen/mahasiswa-asuh',
            },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
