import { Head, router, useForm } from '@inertiajs/react';
import {
    Plus,
    Trash2,
    ClipboardCheck,
    BookUp,
    PenLine,
    Search,
    Download,
    FileUp,
    Upload,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

type Kelas = {
    id: number;
    nama_kelas: string;
    mata_kuliah: { nama_mk: string };
    semester: string;
    tahun_akademik: string;
};

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
};

type Presensi = {
    id: number;
    tanggal: string;
    status: string;
    keterangan: string | null;
    mahasiswa: Mahasiswa;
};

type Materi = {
    id: number;
    judul: string;
    deskripsi: string | null;
    file_path: string | null;
    created_at: string;
};

type Krs = {
    id: number;
    uuid: string;
    nilai: string | null;
    nilai_angka: number | null;
    status: string;
    mahasiswa: Mahasiswa;
};

type Rps = {
    id: number;
    status: string;
    file_path: string | null;
    catatan: string | null;
    uploaded_at: string | null;
};

type Props = {
    kelas: Kelas[];
    presensis: { data: Presensi[] } | Presensi[];
    materis: { data: Materi[] } | Materi[];
    krss: Krs[];
    rps: Rps | null;
    selectedKelasId: string | null;
    filters?: { search?: string };
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    hadir: 'default',
    izin: 'secondary',
    sakit: 'outline',
    alpha: 'destructive',
};

const RPS_STATUS_LABELS: Record<string, string> = {
    belum_upload: 'Belum Upload',
    sudah_upload: 'Sudah Upload',
    perlu_revisi: 'Perlu Revisi',
    disetujui: 'Disetujui',
};

const RPS_STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    belum_upload: 'outline',
    sudah_upload: 'secondary',
    perlu_revisi: 'destructive',
    disetujui: 'default',
};

export default function PerkuliahanIndex({
    kelas,
    presensis,
    materis,
    krss,
    rps,
    selectedKelasId,
    filters,
}: Props) {
    const [openPresensi, setOpenPresensi] = useState(false);
    const [openMateri, setOpenMateri] = useState(false);
    const [editingKrs, setEditingKrs] = useState<Krs | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const rpsForm = useForm<{ file: File | null }>({ file: null });

    const handleUploadRps = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedKelasId) {
            return;
        }

        rpsForm.post(`/dosen/perkuliahan/${selectedKelasId}/rps`, {
            forceFormData: true,
            onSuccess: () => rpsForm.reset(),
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/dosen/perkuliahan',
            { kelas_id: selectedKelasId, search },
            { preserveState: true },
        );
    };

    const presensiForm = useForm({
        kelas_id: selectedKelasId || '',
        mahasiswa_id: '',
        tanggal: new Date().toISOString().split('T')[0],
        status: 'hadir',
        keterangan: '',
    });

    const materiForm = useForm({
        kelas_id: selectedKelasId || '',
        judul: '',
        deskripsi: '',
        file_path: '',
    });

    const nilaiForm = useForm({
        nilai: '',
        nilai_angka: '',
        status: 'selesai',
    });

    const presensiList = Array.isArray(presensis)
        ? presensis
        : presensis?.data || [];
    const materiList = Array.isArray(materis) ? materis : materis?.data || [];

    const handleKelasChange = (value: string) => {
        router.get(
            '/dosen/perkuliahan',
            { kelas_id: value },
            { preserveState: true },
        );
    };

    const handlePresensiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        presensiForm.post('/dosen/perkuliahan/presensi', {
            onSuccess: () => {
                setOpenPresensi(false);
                presensiForm.reset();
            },
        });
    };

    const handleMateriSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        materiForm.post('/dosen/perkuliahan/materi', {
            onSuccess: () => {
                setOpenMateri(false);
                materiForm.reset();
            },
        });
    };

    const handleDeleteMateri = (id: number) => {
        router.delete(`/dosen/perkuliahan/materi/${id}`);
    };

    const handleEditNilai = (krs: Krs) => {
        setEditingKrs(krs);
        nilaiForm.setData({
            nilai: krs.nilai || '',
            nilai_angka: krs.nilai_angka?.toString() || '',
            status: krs.status || 'selesai',
        });
    };

    const handleNilaiSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingKrs) {
            return;
        }

        nilaiForm.put(`/dosen/perkuliahan/nilai/${editingKrs.uuid}`, {
            onSuccess: () => {
                setEditingKrs(null);
                nilaiForm.reset();
            },
        });
    };

    return (
        <>
            <Head title="Perkuliahan" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-primary">
                            Perkuliahan
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola presensi, materi, dan nilai perkuliahan
                        </p>
                    </div>
                    {kelas.length > 1 && (
                        <div className="flex items-center gap-2">
                            <Label>Kelas:</Label>
                            <Select
                                value={selectedKelasId || ''}
                                onValueChange={handleKelasChange}
                            >
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Pilih kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelas.map((k) => (
                                        <SelectItem
                                            key={k.id}
                                            value={k.id.toString()}
                                        >
                                            {k.nama_kelas} -{' '}
                                            {k.mata_kuliah?.nama_mk}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {kelas.length === 1 && selectedKelasId && (
                        <Badge variant="outline" className="text-sm">
                            {kelas[0].nama_kelas} -{' '}
                            {kelas[0].mata_kuliah?.nama_mk}
                        </Badge>
                    )}
                </div>

                {selectedKelasId && (
                    <Tabs defaultValue="presensi">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="presensi">
                                <ClipboardCheck className="mr-2 h-4 w-4" />
                                Presensi
                            </TabsTrigger>
                            <TabsTrigger value="materi">
                                <BookUp className="mr-2 h-4 w-4" />
                                Materi
                            </TabsTrigger>
                            <TabsTrigger value="nilai">
                                <PenLine className="mr-2 h-4 w-4" />
                                Nilai
                            </TabsTrigger>
                            <TabsTrigger value="rps">
                                <FileUp className="mr-2 h-4 w-4" />
                                RPS
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab Presensi */}
                        <TabsContent value="presensi">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            Presensi Mahasiswa
                                        </CardTitle>
                                        <CardDescription>
                                            Data kehadiran mahasiswa
                                        </CardDescription>
                                    </div>
                                    <Dialog
                                        open={openPresensi}
                                        onOpenChange={setOpenPresensi}
                                    >
                                        <DialogTrigger asChild>
                                            <Button size="sm">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Tambah Presensi
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Isi data presensi mahasiswa
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form
                                                onSubmit={handlePresensiSubmit}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label>Mahasiswa ID</Label>
                                                    <Input
                                                        value={
                                                            presensiForm.data
                                                                .mahasiswa_id
                                                        }
                                                        onChange={(e) =>
                                                            presensiForm.setData(
                                                                'mahasiswa_id',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="ID Mahasiswa"
                                                    />
                                                    {presensiForm.errors
                                                        .mahasiswa_id && (
                                                        <p className="text-sm text-red-500">
                                                            {
                                                                presensiForm
                                                                    .errors
                                                                    .mahasiswa_id
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Tanggal</Label>
                                                    <Input
                                                        type="date"
                                                        value={
                                                            presensiForm.data
                                                                .tanggal
                                                        }
                                                        onChange={(e) =>
                                                            presensiForm.setData(
                                                                'tanggal',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Status</Label>
                                                    <Select
                                                        value={
                                                            presensiForm.data
                                                                .status
                                                        }
                                                        onValueChange={(v) =>
                                                            presensiForm.setData(
                                                                'status',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="hadir">
                                                                Hadir
                                                            </SelectItem>
                                                            <SelectItem value="izin">
                                                                Izin
                                                            </SelectItem>
                                                            <SelectItem value="sakit">
                                                                Sakit
                                                            </SelectItem>
                                                            <SelectItem value="alpha">
                                                                Alpha
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Keterangan</Label>
                                                    <Input
                                                        value={
                                                            presensiForm.data
                                                                .keterangan
                                                        }
                                                        onChange={(e) =>
                                                            presensiForm.setData(
                                                                'keterangan',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Opsional"
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            presensiForm.processing
                                                        }
                                                    >
                                                        {presensiForm.processing
                                                            ? 'Menyimpan...'
                                                            : 'Simpan'}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Tanggal
                                                    </TableHead>
                                                    <TableHead>NIM</TableHead>
                                                    <TableHead>Nama</TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead>
                                                        Keterangan
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {presensiList.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={5}
                                                            className="py-8 text-center"
                                                        >
                                                            Belum ada data
                                                            presensi
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    presensiList.map((p) => (
                                                        <TableRow key={p.id}>
                                                            <TableCell>
                                                                {new Date(
                                                                    p.tanggal,
                                                                ).toLocaleDateString(
                                                                    'id-ID',
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-mono">
                                                                {
                                                                    p.mahasiswa
                                                                        ?.nim
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    p.mahasiswa
                                                                        ?.nama
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        STATUS_VARIANTS[
                                                                            p
                                                                                .status
                                                                        ] ||
                                                                        'outline'
                                                                    }
                                                                >
                                                                    {p.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {p.keterangan ||
                                                                    '-'}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Materi */}
                        <TabsContent value="materi">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>
                                            Materi Perkuliahan
                                        </CardTitle>
                                        <CardDescription>
                                            Materi yang telah diunggah
                                        </CardDescription>
                                    </div>
                                    <Dialog
                                        open={openMateri}
                                        onOpenChange={setOpenMateri}
                                    >
                                        <DialogTrigger asChild>
                                            <Button size="sm">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Tambah
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Tambah Materi
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Isi data materi perkuliahan
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form
                                                onSubmit={handleMateriSubmit}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label>Judul</Label>
                                                    <Input
                                                        value={
                                                            materiForm.data
                                                                .judul
                                                        }
                                                        onChange={(e) =>
                                                            materiForm.setData(
                                                                'judul',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Judul materi"
                                                    />
                                                    {materiForm.errors
                                                        .judul && (
                                                        <p className="text-sm text-red-500">
                                                            {
                                                                materiForm
                                                                    .errors
                                                                    .judul
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Deskripsi</Label>
                                                    <Textarea
                                                        value={
                                                            materiForm.data
                                                                .deskripsi
                                                        }
                                                        onChange={(e) =>
                                                            materiForm.setData(
                                                                'deskripsi',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Deskripsi materi"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>File Path</Label>
                                                    <Input
                                                        value={
                                                            materiForm.data
                                                                .file_path
                                                        }
                                                        onChange={(e) =>
                                                            materiForm.setData(
                                                                'file_path',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Path file (opsional)"
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            materiForm.processing
                                                        }
                                                    >
                                                        {materiForm.processing
                                                            ? 'Menyimpan...'
                                                            : 'Simpan'}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Judul</TableHead>
                                                    <TableHead>
                                                        Deskripsi
                                                    </TableHead>
                                                    <TableHead>File</TableHead>
                                                    <TableHead>
                                                        Tanggal
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Aksi
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {materiList.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={5}
                                                            className="py-8 text-center"
                                                        >
                                                            Belum ada data
                                                            materi
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    materiList.map((m) => (
                                                        <TableRow key={m.id}>
                                                            <TableCell className="font-medium">
                                                                {m.judul}
                                                            </TableCell>
                                                            <TableCell>
                                                                {m.deskripsi ||
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {m.file_path ||
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(
                                                                    m.created_at,
                                                                ).toLocaleDateString(
                                                                    'id-ID',
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleDeleteMateri(
                                                                            m.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Nilai */}
                        <TabsContent value="nilai">
                            <Card>
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>Input Nilai</CardTitle>
                                        <CardDescription>
                                            Nilai mahasiswa yang telah disetujui
                                            KRS-nya
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <form
                                            onSubmit={handleSearch}
                                            className="flex items-center gap-2"
                                        >
                                            <Input
                                                placeholder="Cari NIM/nama..."
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                className="h-9 w-48"
                                            />
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                size="icon"
                                                className="h-9 w-9"
                                            >
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </form>
                                        {selectedKelasId && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    (window.location.href = `/dosen/perkuliahan/${selectedKelasId}/export-mahasiswa`)
                                                }
                                            >
                                                <Download className="mr-2 h-4 w-4" />
                                                Export
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>NIM</TableHead>
                                                    <TableHead>Nama</TableHead>
                                                    <TableHead>
                                                        Nilai Huruf
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Nilai Angka
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Aksi
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {krss.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={6}
                                                            className="py-8 text-center"
                                                        >
                                                            Belum ada data nilai
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    krss.map((krs) => (
                                                        <TableRow key={krs.id}>
                                                            <TableCell className="font-mono">
                                                                {
                                                                    krs
                                                                        .mahasiswa
                                                                        ?.nim
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    krs
                                                                        .mahasiswa
                                                                        ?.nama
                                                                }
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {krs.nilai ||
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell className="text-right tabular-nums">
                                                                {krs.nilai_angka ??
                                                                    '-'}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        krs.status ===
                                                                        'selesai'
                                                                            ? 'default'
                                                                            : 'secondary'
                                                                    }
                                                                >
                                                                    {krs.status ===
                                                                    'selesai'
                                                                        ? 'Selesai'
                                                                        : 'Proses'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Dialog
                                                                    open={
                                                                        editingKrs?.id ===
                                                                        krs.id
                                                                    }
                                                                    onOpenChange={(
                                                                        open,
                                                                    ) =>
                                                                        !open &&
                                                                        setEditingKrs(
                                                                            null,
                                                                        )
                                                                    }
                                                                >
                                                                    <DialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() =>
                                                                                handleEditNilai(
                                                                                    krs,
                                                                                )
                                                                            }
                                                                        >
                                                                            <PenLine className="h-4 w-4" />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>
                                                                                Input
                                                                                Nilai
                                                                            </DialogTitle>
                                                                            <DialogDescription>
                                                                                Input
                                                                                nilai
                                                                                untuk{' '}
                                                                                {
                                                                                    krs
                                                                                        .mahasiswa
                                                                                        ?.nama
                                                                                }
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <form
                                                                            onSubmit={
                                                                                handleNilaiSubmit
                                                                            }
                                                                            className="space-y-4"
                                                                        >
                                                                            <div className="space-y-2">
                                                                                <Label>
                                                                                    Nilai
                                                                                    Huruf
                                                                                </Label>
                                                                                <Select
                                                                                    value={
                                                                                        nilaiForm
                                                                                            .data
                                                                                            .nilai
                                                                                    }
                                                                                    onValueChange={(
                                                                                        v,
                                                                                    ) =>
                                                                                        nilaiForm.setData(
                                                                                            'nilai',
                                                                                            v,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <SelectTrigger>
                                                                                        <SelectValue placeholder="Pilih nilai" />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        <SelectItem value="A">
                                                                                            A
                                                                                        </SelectItem>
                                                                                        <SelectItem value="B+">
                                                                                            B+
                                                                                        </SelectItem>
                                                                                        <SelectItem value="B">
                                                                                            B
                                                                                        </SelectItem>
                                                                                        <SelectItem value="C+">
                                                                                            C+
                                                                                        </SelectItem>
                                                                                        <SelectItem value="C">
                                                                                            C
                                                                                        </SelectItem>
                                                                                        <SelectItem value="D">
                                                                                            D
                                                                                        </SelectItem>
                                                                                        <SelectItem value="E">
                                                                                            E
                                                                                        </SelectItem>
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                {nilaiForm
                                                                                    .errors
                                                                                    .nilai && (
                                                                                    <p className="text-sm text-red-500">
                                                                                        {
                                                                                            nilaiForm
                                                                                                .errors
                                                                                                .nilai
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <Label>
                                                                                    Nilai
                                                                                    Angka
                                                                                </Label>
                                                                                <Input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min="0"
                                                                                    max="4"
                                                                                    value={
                                                                                        nilaiForm
                                                                                            .data
                                                                                            .nilai_angka
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        nilaiForm.setData(
                                                                                            'nilai_angka',
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                />
                                                                                {nilaiForm
                                                                                    .errors
                                                                                    .nilai_angka && (
                                                                                    <p className="text-sm text-red-500">
                                                                                        {
                                                                                            nilaiForm
                                                                                                .errors
                                                                                                .nilai_angka
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <DialogFooter>
                                                                                <Button
                                                                                    type="submit"
                                                                                    disabled={
                                                                                        nilaiForm.processing
                                                                                    }
                                                                                >
                                                                                    {nilaiForm.processing
                                                                                        ? 'Menyimpan...'
                                                                                        : 'Simpan'}
                                                                                </Button>
                                                                            </DialogFooter>
                                                                        </form>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab RPS */}
                        <TabsContent value="rps">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Rencana Pembelajaran Semester (RPS)
                                    </CardTitle>
                                    <CardDescription>
                                        Unggah dokumen RPS untuk kelas ini —
                                        akan ditinjau oleh admin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-muted-foreground">
                                            Status:
                                        </span>
                                        <Badge
                                            variant={
                                                RPS_STATUS_VARIANTS[
                                                    rps?.status ||
                                                        'belum_upload'
                                                ]
                                            }
                                        >
                                            {
                                                RPS_STATUS_LABELS[
                                                    rps?.status ||
                                                        'belum_upload'
                                                ]
                                            }
                                        </Badge>
                                    </div>

                                    {rps?.status === 'perlu_revisi' &&
                                        rps.catatan && (
                                            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                                                <strong>Catatan revisi:</strong>{' '}
                                                {rps.catatan}
                                            </div>
                                        )}

                                    {rps?.file_path && (
                                        <a
                                            href={`/storage/${rps.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                        >
                                            <FileUp className="h-4 w-4" />
                                            Lihat file RPS saat ini
                                        </a>
                                    )}

                                    <form
                                        onSubmit={handleUploadRps}
                                        className="flex items-center gap-3"
                                    >
                                        <Input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) =>
                                                rpsForm.setData(
                                                    'file',
                                                    e.target.files?.[0] || null,
                                                )
                                            }
                                        />
                                        <Button
                                            type="submit"
                                            disabled={
                                                rpsForm.processing ||
                                                !rpsForm.data.file
                                            }
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            {rpsForm.processing
                                                ? 'Mengunggah...'
                                                : 'Unggah'}
                                        </Button>
                                    </form>
                                    {rpsForm.errors.file && (
                                        <p className="text-sm text-destructive">
                                            {rpsForm.errors.file}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </>
    );
}

PerkuliahanIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Perkuliahan', href: '/dosen/perkuliahan' },
        ]}
    >
        {page}
    </AppLayout>
);
