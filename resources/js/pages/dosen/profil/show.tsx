import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Edit,
    Mail,
    Phone,
    MapPin,
    User,
    BookOpen,
    GraduationCap,
    Briefcase,
    Award,
    Plus,
    PenLine,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

const JENJANG_OPTIONS = ['SMA/SMK', 'D3', 'D4', 'S1', 'S2', 'S3'];

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    semester: number;
};

type Kelas = {
    id: number;
    nama_kelas: string;
    mata_kuliah: MataKuliah;
    semester: string;
    tahun_akademik: string;
    status: string;
};

type RiwayatPendidikan = {
    uuid: string;
    jenjang: string;
    nama_institusi: string;
    fakultas_prodi: string | null;
};

type Dosen = {
    id: number;
    nidn: string;
    nama: string;
    email: string;
    no_telepon: string | null;
    jenis_kelamin: string;
    pangkat_golongan: string | null;
    pendidikan_terakhir: string | null;
    alamat: string | null;
    status: string;
    program_studi: ProgramStudi;
    kelas: Kelas[];
    riwayat_pendidikan: RiwayatPendidikan[];
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function DosenProfilShow({ dosen }: { dosen: Dosen }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<RiwayatPendidikan | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            jenjang: '',
            nama_institusi: '',
            fakultas_prodi: '',
        });

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        setDialogOpen(true);
    };

    const openEdit = (riwayat: RiwayatPendidikan) => {
        setEditing(riwayat);
        setData({
            jenjang: riwayat.jenjang,
            nama_institusi: riwayat.nama_institusi,
            fakultas_prodi: riwayat.fakultas_prodi ?? '',
        });
        clearErrors();
        setDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => setDialogOpen(false);

        if (editing) {
            put(`/dosen/riwayat-pendidikan/${editing.uuid}`, { onSuccess });
        } else {
            post('/dosen/riwayat-pendidikan', { onSuccess });
        }
    };

    const handleDelete = (riwayat: RiwayatPendidikan) => {
        if (!confirm(`Hapus riwayat pendidikan ${riwayat.jenjang}?`)) {
            return;
        }

        router.delete(`/dosen/riwayat-pendidikan/${riwayat.uuid}`);
    };

    const uniqueMataKuliah =
        dosen.kelas
            ?.filter((k) => k.status === 'Aktif')
            .reduce((acc, kelas) => {
                if (!acc.find((mk) => mk.id === kelas.mata_kuliah.id)) {
                    acc.push(kelas.mata_kuliah);
                }

                return acc;
            }, [] as MataKuliah[]) || [];

    return (
        <>
            <Head title="Profil Dosen" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-primary">
                            Profil Dosen
                        </h1>
                        <p className="text-muted-foreground">
                            Lihat data profil anda
                        </p>
                    </div>
                    <Link href="/dosen/profil/edit">
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profil
                        </Button>
                    </Link>
                </div>

                {/* Card 1: Photo & Biodata Singkat */}
                <Card className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Photo Section */}
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[280px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-sm">
                                    <span className="text-4xl font-semibold text-siak-pine">
                                        {getInitials(dosen.nama)}
                                    </span>
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIDN</p>
                                    <p className="font-mono text-lg font-semibold">
                                        {dosen.nidn}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Biodata Section */}
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        {dosen.nama}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {dosen.program_studi?.nama_prodi}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Jenis Kelamin
                                            </p>
                                            <p className="font-medium">
                                                {dosen.jenis_kelamin}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Award className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Pangkat / Golongan
                                            </p>
                                            <p className="font-medium">
                                                {dosen.pangkat_golongan || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Pendidikan Terakhir
                                            </p>
                                            <p className="font-medium">
                                                {dosen.pendidikan_terakhir ||
                                                    '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Mail className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Email
                                            </p>
                                            <p className="truncate font-medium">
                                                {dosen.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                No. Telepon
                                            </p>
                                            <p className="font-medium">
                                                {dosen.no_telepon || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Alamat
                                            </p>
                                            <p className="truncate font-medium">
                                                {dosen.alamat || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            dosen.status === 'aktif'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {dosen.status === 'aktif'
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        • {dosen.program_studi?.nama_prodi}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Card 2: Tab Pane */}
                <Card>
                    <CardContent className="p-6">
                        <Tabs defaultValue="biodata">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="biodata">
                                    <User className="mr-2 h-4 w-4" />
                                    Biodata
                                </TabsTrigger>
                                <TabsTrigger value="pendidikan">
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    Riwayat Pendidikan
                                </TabsTrigger>
                                <TabsTrigger value="pengalaman">
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    Pengalaman
                                </TabsTrigger>
                                <TabsTrigger value="matakuliah">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Mata Kuliah
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="biodata">
                                <div className="space-y-6 pt-4">
                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold">
                                            Biodata Lengkap
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Nama Lengkap
                                                    </p>
                                                    <p className="font-medium">
                                                        {dosen.nama}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        NIDN
                                                    </p>
                                                    <p className="font-mono font-medium">
                                                        {dosen.nidn}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Email
                                                    </p>
                                                    <p className="font-medium">
                                                        {dosen.email}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        No. Telepon
                                                    </p>
                                                    <p className="font-medium">
                                                        {dosen.no_telepon ||
                                                            '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Jenis Kelamin
                                                    </p>
                                                    <p className="font-medium">
                                                        {dosen.jenis_kelamin}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Pangkat / Golongan
                                                    </p>
                                                    <p className="font-medium">
                                                        {dosen.pangkat_golongan ||
                                                            '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Pendidikan Terakhir
                                                    </p>
                                                    <p className="font-medium">
                                                        {dosen.pendidikan_terakhir ||
                                                            '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Alamat
                                                    </p>
                                                    <p className="font-medium">
                                                        {dosen.alamat || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="pendidikan">
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">
                                            Riwayat Pendidikan
                                        </h3>
                                        <Button size="sm" onClick={openCreate}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah
                                        </Button>
                                    </div>
                                    {dosen.riwayat_pendidikan.length > 0 ? (
                                        <div className="space-y-4">
                                            {dosen.riwayat_pendidikan.map(
                                                (riwayat) => (
                                                    <div
                                                        key={riwayat.uuid}
                                                        className="flex items-start gap-4 rounded-lg border bg-card p-4"
                                                    >
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-siak-pine/10">
                                                            <GraduationCap className="h-6 w-6 text-siak-pine" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold">
                                                                {
                                                                    riwayat.nama_institusi
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {riwayat.fakultas_prodi ||
                                                                    '-'}
                                                            </p>
                                                        </div>
                                                        <Badge variant="default">
                                                            {riwayat.jenjang}
                                                        </Badge>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    openEdit(
                                                                        riwayat,
                                                                    )
                                                                }
                                                            >
                                                                <PenLine className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        riwayat,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            Belum ada riwayat pendidikan
                                        </p>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="pengalaman">
                                <div className="space-y-4 pt-4">
                                    <h3 className="text-lg font-semibold">
                                        Pengalaman Mengajar
                                    </h3>
                                    {dosen.kelas && dosen.kelas.length > 0 ? (
                                        <div className="space-y-3">
                                            {dosen.kelas
                                                .slice(0, 5)
                                                .map((kelas) => (
                                                    <div
                                                        key={kelas.id}
                                                        className="flex items-center gap-4 rounded-lg border bg-card p-4"
                                                    >
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                            <BookOpen className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium">
                                                                {
                                                                    kelas
                                                                        .mata_kuliah
                                                                        ?.nama_mk
                                                                }
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    kelas.nama_kelas
                                                                }{' '}
                                                                •{' '}
                                                                {
                                                                    kelas.tahun_akademik
                                                                }{' '}
                                                                - Semester{' '}
                                                                {kelas.semester}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                kelas.status ===
                                                                'Aktif'
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {kelas.status}
                                                        </Badge>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            Belum ada pengalaman mengajar
                                        </p>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="matakuliah">
                                <div className="space-y-4 pt-4">
                                    <h3 className="text-lg font-semibold">
                                        Mata Kuliah yang Diampu
                                    </h3>
                                    {uniqueMataKuliah.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {uniqueMataKuliah.map((mk) => (
                                                <div
                                                    key={mk.id}
                                                    className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-semibold">
                                                                {mk.nama_mk}
                                                            </p>
                                                            <p className="font-mono text-sm text-muted-foreground">
                                                                {mk.kode_mk}
                                                            </p>
                                                        </div>
                                                        <Badge variant="outline">
                                                            {mk.sks} SKS
                                                        </Badge>
                                                    </div>
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        Semester {mk.semester}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            Belum ada mata kuliah yang diampu
                                        </p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <form onSubmit={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editing
                                        ? 'Edit Riwayat Pendidikan'
                                        : 'Tambah Riwayat Pendidikan'}
                                </DialogTitle>
                                <DialogDescription>
                                    Jenjang, nama sekolah/universitas, dan
                                    fakultas/prodi.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="jenjang">
                                        Jenjang{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.jenjang}
                                        onValueChange={(value) =>
                                            setData('jenjang', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="jenjang"
                                            aria-invalid={!!errors.jenjang}
                                        >
                                            <SelectValue placeholder="Pilih jenjang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JENJANG_OPTIONS.map((option) => (
                                                <SelectItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jenjang && (
                                        <p className="text-sm text-destructive">
                                            {errors.jenjang}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_institusi">
                                        Nama Sekolah/Universitas{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="nama_institusi"
                                        value={data.nama_institusi}
                                        onChange={(e) =>
                                            setData(
                                                'nama_institusi',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.nama_institusi}
                                    />
                                    {errors.nama_institusi && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_institusi}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fakultas_prodi">
                                        Fakultas/Prodi
                                    </Label>
                                    <Input
                                        id="fakultas_prodi"
                                        value={data.fakultas_prodi}
                                        onChange={(e) =>
                                            setData(
                                                'fakultas_prodi',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.fakultas_prodi}
                                    />
                                    {errors.fakultas_prodi && (
                                        <p className="text-sm text-destructive">
                                            {errors.fakultas_prodi}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

DosenProfilShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Profil Dosen', href: '/dosen/profil' },
        ]}
    >
        {page}
    </AppLayout>
);
