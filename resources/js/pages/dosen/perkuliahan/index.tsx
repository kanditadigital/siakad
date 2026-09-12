import { Head, router, useForm } from '@inertiajs/react';
import {
    BookUp,
    ClipboardCheck,
    Download,
    Eye,
    FileText,
    FileUp,
    PenLine,
    Plus,
    Search,
    Trash2,
    Upload,
} from 'lucide-react';
import { useState } from 'react';
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
import { cn } from '@/lib/utils';

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
    file_name: string | null;
    file_url: string | null;
    file_download_url: string | null;
    created_at: string;
};

type PresensiHariIni = {
    id: number;
    mahasiswa_id: number;
    status: string;
    keterangan: string | null;
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
    file_url: string | null;
    catatan: string | null;
    uploaded_at: string | null;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
};

type Props = {
    kelas: Kelas[];
    presensis: Paginated<Presensi> | Presensi[];
    presensiHariIni: Record<number, PresensiHariIni>;
    presensiTanggal: string;
    riwayatTanggal: string;
    materis: Paginated<Materi> | Materi[];
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

const PRESENSI_OPTIONS: {
    value: string;
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    activeClassName?: string;
}[] = [
    { value: 'hadir', label: 'Hadir', variant: 'default' },
    {
        value: 'izin',
        label: 'Izin',
        variant: 'outline',
        activeClassName: 'border-amber-600 bg-amber-500 text-white hover:bg-amber-600',
    },
    { value: 'sakit', label: 'Sakit', variant: 'secondary' },
    { value: 'alpha', label: 'Alpha', variant: 'destructive' },
];

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

function isPaginated<T>(value: Paginated<T> | T[]): value is Paginated<T> {
    return !Array.isArray(value);
}

function Pagination({
    data,
    onPageChange,
}: {
    data: Paginated<unknown>;
    onPageChange: (page: number) => void;
}) {
    if (data.last_page <= 1) {
        return null;
    }

    return (
        <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Menampilkan {data.data.length} dari {data.total} data
            </p>
            <div className="flex items-center gap-2">
                {Array.from(
                    { length: data.last_page },
                    (_, i) => i + 1,
                ).map((page) => (
                    <Button
                        key={page}
                        variant={
                            page === data.current_page ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default function PerkuliahanIndex({
    kelas,
    presensis,
    presensiHariIni,
    presensiTanggal,
    riwayatTanggal,
    materis,
    krss,
    rps,
    selectedKelasId,
    filters,
}: Props) {
    const [openMateri, setOpenMateri] = useState(false);
    const [editingMateri, setEditingMateri] = useState<Materi | null>(null);
    const [editingKrs, setEditingKrs] = useState<Krs | null>(null);
    const [search, setSearch] = useState(filters?.search || '');
    const [tanggal, setTanggal] = useState(presensiTanggal);
    const [riwayatFilter, setRiwayatFilter] = useState(riwayatTanggal);
    const [submittingPresensiFor, setSubmittingPresensiFor] = useState<
        number | null
    >(null);
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

    const materiForm = useForm<{
        kelas_id: string;
        judul: string;
        deskripsi: string;
        file: File | null;
    }>({
        kelas_id: selectedKelasId || '',
        judul: '',
        deskripsi: '',
        file: null,
    });

    const editMateriForm = useForm<{
        judul: string;
        deskripsi: string;
        file: File | null;
    }>({
        judul: '',
        deskripsi: '',
        file: null,
    });

    const nilaiForm = useForm({
        nilai: '',
        nilai_angka: '',
        status: 'selesai',
    });

    const presensiList = isPaginated(presensis) ? presensis.data : presensis;
    const materiList = isPaginated(materis) ? materis.data : materis;

    const goToPresensiPage = (page: number) => {
        router.get(
            '/dosen/perkuliahan',
            {
                kelas_id: selectedKelasId,
                riwayat_tanggal: riwayatFilter,
                presensi_page: page,
            },
            { preserveState: true },
        );
    };

    const goToMateriPage = (page: number) => {
        router.get(
            '/dosen/perkuliahan',
            { kelas_id: selectedKelasId, materi_page: page },
            { preserveState: true },
        );
    };

    const handleKelasChange = (value: string) => {
        router.get(
            '/dosen/perkuliahan',
            { kelas_id: value },
            { preserveState: true },
        );
    };

    const handleTanggalChange = (value: string) => {
        setTanggal(value);
        router.get(
            '/dosen/perkuliahan',
            { kelas_id: selectedKelasId, presensi_tanggal: value },
            { preserveState: true, only: ['presensiHariIni', 'presensiTanggal'] },
        );
    };

    const handleRiwayatTanggalChange = (value: string) => {
        setRiwayatFilter(value);
        router.get(
            '/dosen/perkuliahan',
            { kelas_id: selectedKelasId, riwayat_tanggal: value },
            { preserveState: true },
        );
    };

    const handleQuickPresensi = (mahasiswaId: number, status: string) => {
        setSubmittingPresensiFor(mahasiswaId);
        router.post(
            '/dosen/perkuliahan/presensi',
            {
                kelas_id: selectedKelasId,
                mahasiswa_id: mahasiswaId,
                tanggal,
                status,
            },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['presensiHariIni', 'presensis'],
                onFinish: () => setSubmittingPresensiFor(null),
            },
        );
    };

    const handleMateriSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        materiForm.post('/dosen/perkuliahan/materi', {
            forceFormData: true,
            onSuccess: () => {
                setOpenMateri(false);
                materiForm.reset();
            },
        });
    };

    const handleDeleteMateri = (id: number) => {
        router.delete(`/dosen/perkuliahan/materi/${id}`);
    };

    const openEditMateri = (materi: Materi) => {
        setEditingMateri(materi);
        editMateriForm.setData({
            judul: materi.judul,
            deskripsi: materi.deskripsi || '',
            file: null,
        });
    };

    const handleUpdateMateri = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingMateri) {
            return;
        }

        // PHP/nginx can silently drop the body of a PUT request sent as
        // multipart/form-data (e.g. when a new file is attached), so this
        // spoofs the method via POST instead.
        editMateriForm.transform((data) => ({ ...data, _method: 'put' }));
        editMateriForm.post(`/dosen/perkuliahan/materi/${editingMateri.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setEditingMateri(null);
                editMateriForm.reset();
            },
        });
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
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
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
                        <Badge
                            variant="outline"
                            className="border-green-200 text-sm text-green-700"
                        >
                            {kelas[0].nama_kelas} -{' '}
                            {kelas[0].mata_kuliah?.nama_mk}
                        </Badge>
                    )}
                </div>

                {kelas.length === 0 && (
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
                            <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
                            <p className="text-sm font-medium text-gray-900">
                                Belum ada kelas yang diampu
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Kelas yang ditugaskan admin akan muncul di sini
                            </p>
                        </CardContent>
                    </Card>
                )}

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
                        <TabsContent value="presensi" className="space-y-6">
                            <Card className="border border-gray-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">
                                        Presensi Hari Ini
                                    </CardTitle>
                                    <CardDescription>
                                        Klik status kehadiran tiap mahasiswa
                                        untuk tanggal yang dipilih — tersimpan
                                        otomatis, tanpa formulir
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="presensi-tanggal">
                                            Tanggal
                                        </Label>
                                        <Input
                                            id="presensi-tanggal"
                                            type="date"
                                            className="w-[180px]"
                                            value={tanggal}
                                            onChange={(e) =>
                                                handleTanggalChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="rounded-lg border">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            NIM
                                                        </TableHead>
                                                        <TableHead>
                                                            Nama
                                                        </TableHead>
                                                        <TableHead>
                                                            Kehadiran
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {krss.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={3}
                                                                className="py-12 text-center"
                                                            >
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        Belum
                                                                        ada
                                                                        mahasiswa
                                                                        terdaftar
                                                                        di
                                                                        kelas
                                                                        ini
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        krss.map((krs) => {
                                                            const current =
                                                                presensiHariIni[
                                                                    krs
                                                                        .mahasiswa
                                                                        .id
                                                                ]?.status;
                                                            const isSubmitting =
                                                                submittingPresensiFor ===
                                                                krs.mahasiswa
                                                                    .id;

                                                            return (
                                                                <TableRow
                                                                    key={
                                                                        krs
                                                                            .mahasiswa
                                                                            .id
                                                                    }
                                                                >
                                                                    <TableCell className="font-mono">
                                                                        {
                                                                            krs
                                                                                .mahasiswa
                                                                                .nim
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            krs
                                                                                .mahasiswa
                                                                                .nama
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {PRESENSI_OPTIONS.map(
                                                                                (
                                                                                    option,
                                                                                ) => {
                                                                                    const isActive =
                                                                                        current ===
                                                                                        option.value;

                                                                                    return (
                                                                                        <Button
                                                                                            key={
                                                                                                option.value
                                                                                            }
                                                                                            type="button"
                                                                                            size="sm"
                                                                                            variant={
                                                                                                isActive
                                                                                                    ? option.variant
                                                                                                    : 'outline'
                                                                                            }
                                                                                            className={cn(
                                                                                                isActive &&
                                                                                                    option.activeClassName,
                                                                                            )}
                                                                                            disabled={
                                                                                                isSubmitting
                                                                                            }
                                                                                            onClick={() =>
                                                                                                handleQuickPresensi(
                                                                                                    krs
                                                                                                        .mahasiswa
                                                                                                        .id,
                                                                                                    option.value,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                option.label
                                                                                            }
                                                                                        </Button>
                                                                                    );
                                                                                },
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-gray-200 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-gray-900">
                                            Riwayat Presensi
                                        </CardTitle>
                                        <CardDescription>
                                            {riwayatFilter === 'all'
                                                ? 'Seluruh catatan kehadiran kelas ini, lintas tanggal'
                                                : 'Catatan kehadiran kelas ini pada tanggal terpilih'}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="date"
                                            className="w-[180px]"
                                            value={
                                                riwayatFilter === 'all'
                                                    ? ''
                                                    : riwayatFilter
                                            }
                                            onChange={(e) =>
                                                handleRiwayatTanggalChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {riwayatFilter !== 'all' && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    handleRiwayatTanggalChange(
                                                        'all',
                                                    )
                                                }
                                            >
                                                Semua Tanggal
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Tanggal
                                                        </TableHead>
                                                        <TableHead>
                                                            NIM
                                                        </TableHead>
                                                        <TableHead>
                                                            Nama
                                                        </TableHead>
                                                        <TableHead>
                                                            Status
                                                        </TableHead>
                                                        <TableHead>
                                                            Keterangan
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {presensiList.length ===
                                                    0 ? (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={5}
                                                                className="py-12 text-center"
                                                            >
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {riwayatFilter ===
                                                                        'all'
                                                                            ? 'Belum ada data presensi'
                                                                            : 'Belum ada presensi pada tanggal ini'}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {riwayatFilter ===
                                                                        'all'
                                                                            ? 'Klik status kehadiran di atas untuk mulai mencatat'
                                                                            : 'Coba pilih tanggal lain atau lihat semua tanggal'}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        presensiList.map(
                                                            (p) => (
                                                                <TableRow
                                                                    key={p.id}
                                                                >
                                                                    <TableCell>
                                                                        {new Date(
                                                                            p.tanggal,
                                                                        ).toLocaleDateString(
                                                                            'id-ID',
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="font-mono">
                                                                        {
                                                                            p
                                                                                .mahasiswa
                                                                                ?.nim
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {
                                                                            p
                                                                                .mahasiswa
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
                                                                            {
                                                                                p.status
                                                                            }
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {p.keterangan ||
                                                                            '-'}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    {isPaginated(presensis) && (
                                        <Pagination
                                            data={presensis}
                                            onPageChange={goToPresensiPage}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Materi */}
                        <TabsContent value="materi">
                            <Card className="border border-gray-200 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-gray-900">
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
                                                        <p className="text-sm text-destructive">
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
                                                    <Label>File PDF</Label>
                                                    <Input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) =>
                                                            materiForm.setData(
                                                                'file',
                                                                e.target
                                                                    .files?.[0] ||
                                                                    null,
                                                            )
                                                        }
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Format PDF, maksimal 10
                                                        MB.
                                                    </p>
                                                    {materiForm.errors
                                                        .file && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                materiForm
                                                                    .errors
                                                                    .file
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            materiForm.processing ||
                                                            !materiForm.data
                                                                .file
                                                        }
                                                    >
                                                        {materiForm.processing
                                                            ? 'Mengunggah...'
                                                            : 'Simpan'}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog
                                        open={editingMateri !== null}
                                        onOpenChange={(open) => {
                                            if (!open) {
                                                setEditingMateri(null);
                                                editMateriForm.reset();
                                            }
                                        }}
                                    >
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Edit Materi
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Ubah judul, deskripsi, atau
                                                    ganti file PDF materi ini
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form
                                                onSubmit={handleUpdateMateri}
                                                className="space-y-4"
                                            >
                                                <div className="space-y-2">
                                                    <Label>Judul</Label>
                                                    <Input
                                                        value={
                                                            editMateriForm
                                                                .data.judul
                                                        }
                                                        onChange={(e) =>
                                                            editMateriForm.setData(
                                                                'judul',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Judul materi"
                                                    />
                                                    {editMateriForm.errors
                                                        .judul && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                editMateriForm
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
                                                            editMateriForm
                                                                .data.deskripsi
                                                        }
                                                        onChange={(e) =>
                                                            editMateriForm.setData(
                                                                'deskripsi',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Deskripsi materi"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>
                                                        Ganti File PDF{' '}
                                                        <span className="font-normal text-muted-foreground">
                                                            (opsional)
                                                        </span>
                                                    </Label>
                                                    {editingMateri?.file_name && (
                                                        <p className="text-xs text-muted-foreground">
                                                            File saat ini:{' '}
                                                            {
                                                                editingMateri.file_name
                                                            }
                                                        </p>
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) =>
                                                            editMateriForm.setData(
                                                                'file',
                                                                e.target
                                                                    .files?.[0] ||
                                                                    null,
                                                            )
                                                        }
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Biarkan kosong untuk
                                                        mempertahankan file
                                                        yang sudah ada. Format
                                                        PDF, maksimal 10 MB.
                                                    </p>
                                                    {editMateriForm.errors
                                                        .file && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                editMateriForm
                                                                    .errors
                                                                    .file
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            editMateriForm.processing
                                                        }
                                                    >
                                                        {editMateriForm.processing
                                                            ? 'Menyimpan...'
                                                            : 'Simpan Perubahan'}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Judul
                                                        </TableHead>
                                                        <TableHead>
                                                            Deskripsi
                                                        </TableHead>
                                                        <TableHead>
                                                            File
                                                        </TableHead>
                                                        <TableHead>
                                                            Tanggal
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Aksi
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {materiList.length ===
                                                    0 ? (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={5}
                                                                className="py-12 text-center"
                                                            >
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <BookUp className="h-8 w-8 text-muted-foreground/50" />
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        Belum
                                                                        ada
                                                                        data
                                                                        materi
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Mulai
                                                                        dengan
                                                                        menambahkan
                                                                        materi
                                                                        pertama
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        materiList.map(
                                                            (m) => (
                                                                <TableRow
                                                                    key={m.id}
                                                                >
                                                                    <TableCell className="font-medium">
                                                                        {
                                                                            m.judul
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {m.deskripsi ||
                                                                            '-'}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {m.file_url ? (
                                                                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                                                                <FileText className="h-3.5 w-3.5" />
                                                                                {m.file_name ||
                                                                                    'materi.pdf'}
                                                                            </span>
                                                                        ) : (
                                                                            '-'
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {new Date(
                                                                            m.created_at,
                                                                        ).toLocaleDateString(
                                                                            'id-ID',
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex items-center justify-end gap-1">
                                                                            {m.file_url && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    title="Preview"
                                                                                    asChild
                                                                                >
                                                                                    <a
                                                                                        href={
                                                                                            m.file_url
                                                                                        }
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                    >
                                                                                        <Eye className="h-4 w-4" />
                                                                                    </a>
                                                                                </Button>
                                                                            )}
                                                                            {m.file_download_url && (
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    title="Download"
                                                                                    asChild
                                                                                >
                                                                                    <a
                                                                                        href={
                                                                                            m.file_download_url
                                                                                        }
                                                                                    >
                                                                                        <Download className="h-4 w-4" />
                                                                                    </a>
                                                                                </Button>
                                                                            )}
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                title="Edit"
                                                                                onClick={() =>
                                                                                    openEditMateri(
                                                                                        m,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <PenLine className="h-4 w-4" />
                                                                            </Button>
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger
                                                                                    asChild
                                                                                >
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        title="Hapus"
                                                                                    >
                                                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                                                    </Button>
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent>
                                                                                    <AlertDialogHeader>
                                                                                        <AlertDialogTitle>
                                                                                            Hapus
                                                                                            Materi
                                                                                        </AlertDialogTitle>
                                                                                        <AlertDialogDescription>
                                                                                            Apakah
                                                                                            Anda
                                                                                            yakin
                                                                                            ingin
                                                                                            menghapus
                                                                                            materi
                                                                                            "
                                                                                            {
                                                                                                m.judul
                                                                                            }

                                                                                            "?
                                                                                            File
                                                                                            PDF
                                                                                            yang
                                                                                            sudah
                                                                                            diunggah
                                                                                            akan
                                                                                            ikut
                                                                                            terhapus
                                                                                            dan
                                                                                            tidak
                                                                                            dapat
                                                                                            dikembalikan.
                                                                                        </AlertDialogDescription>
                                                                                    </AlertDialogHeader>
                                                                                    <AlertDialogFooter>
                                                                                        <AlertDialogCancel>
                                                                                            Batal
                                                                                        </AlertDialogCancel>
                                                                                        <AlertDialogAction
                                                                                            onClick={() =>
                                                                                                handleDeleteMateri(
                                                                                                    m.id,
                                                                                                )
                                                                                            }
                                                                                            className="bg-red-600 hover:bg-red-700"
                                                                                        >
                                                                                            Hapus
                                                                                        </AlertDialogAction>
                                                                                    </AlertDialogFooter>
                                                                                </AlertDialogContent>
                                                                            </AlertDialog>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                    {isPaginated(materis) && (
                                        <Pagination
                                            data={materis}
                                            onPageChange={goToMateriPage}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Nilai */}
                        <TabsContent value="nilai">
                            <Card className="border border-gray-200 shadow-sm">
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-gray-900">
                                            Input Nilai
                                        </CardTitle>
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
                                                asChild
                                            >
                                                <a
                                                    href={`/dosen/perkuliahan/${selectedKelasId}/export-mahasiswa`}
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Export
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-lg border">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            NIM
                                                        </TableHead>
                                                        <TableHead>
                                                            Nama
                                                        </TableHead>
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
                                                                className="py-12 text-center"
                                                            >
                                                                <div className="flex flex-col items-center gap-2">
                                                                    <PenLine className="h-8 w-8 text-muted-foreground/50" />
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {search
                                                                            ? 'Tidak ada mahasiswa yang cocok'
                                                                            : 'Belum ada data nilai'}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {search
                                                                            ? 'Coba ubah kata kunci pencarian'
                                                                            : 'Mahasiswa dengan KRS disetujui akan muncul di sini'}
                                                                    </p>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        krss.map((krs) => (
                                                            <TableRow
                                                                key={krs.id}
                                                            >
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
                                                                                        <p className="text-sm text-destructive">
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
                                                                                        <p className="text-sm text-destructive">
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
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab RPS */}
                        <TabsContent value="rps">
                            <Card className="border border-gray-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">
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

                                    {rps?.file_url && (
                                        <a
                                            href={rps.file_url}
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
