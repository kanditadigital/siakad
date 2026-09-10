import { Head, router, useForm } from '@inertiajs/react';
import { FileText, GraduationCap, MessageSquare, Plus, Send, Trash2 } from 'lucide-react';
import { BabTugasAkhirChecklist  } from '@/components/bab-tugas-akhir-checklist';
import type {Bab} from '@/components/bab-tugas-akhir-checklist';
import { ProgressTugasAkhirTimeline } from '@/components/progress-tugas-akhir-timeline';
import { TahapTugasAkhirStepper } from '@/components/tahap-tugas-akhir-stepper';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

type Pengajuan = {
    id: number;
    uuid: string;
    judul: string;
    status: string;
    catatan: string | null;
    created_at: string;
};

type ProgressEntry = {
    id: number;
    tipe: string;
    tahap: string | null;
    catatan: string | null;
    created_at: string;
    dibuat_oleh: { name: string } | null;
};

type Bimbingan = {
    id: number;
    judul: string;
    tahap_saat_ini: string;
    selesai_pada: string | null;
    acc_pembimbing_1_pada: string | null;
    acc_pembimbing_2_pada: string | null;
    pembimbing1: { nama: string } | null;
    pembimbing2: { nama: string } | null;
    progress: ProgressEntry[];
    bab_tugas_akhir: Bab[];
};

type Props = {
    pengajuan: Pengajuan[];
    sisaSlot: number;
    batasAktif: number;
    bimbingan: Bimbingan | null;
    tahapan: [string, string][];
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    pending: 'outline',
    disetujui: 'default',
    ditolak: 'destructive',
};

export default function PengajuanJudulTaMahasiswa({
    pengajuan,
    sisaSlot,
    batasAktif,
    bimbingan,
    tahapan,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        judul: '',
    });

    const catatanForm = useForm({
        catatan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mahasiswa/pengajuan-judul-ta', {
            preserveScroll: true,
            onSuccess: () => reset('judul'),
        });
    };

    const handleDelete = (item: Pengajuan) => {
        router.delete(`/mahasiswa/pengajuan-judul-ta/${item.uuid}`, {
            preserveScroll: true,
        });
    };

    const handleAddCatatan = (e: React.FormEvent) => {
        e.preventDefault();
        catatanForm.post('/mahasiswa/bimbingan-tugas-akhir/progress', {
            preserveScroll: true,
            onSuccess: () => catatanForm.reset('catatan'),
        });
    };

    if (bimbingan) {
        return (
            <>
                <Head title="Tugas Akhir Saya" />

                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Tugas Akhir Saya
                        </h1>
                        <p className="text-muted-foreground">
                            Progress penyusunan tugas akhir Anda
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-start gap-2">
                                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                <span>{bimbingan.judul}</span>
                            </CardTitle>
                            <CardDescription className="space-y-0.5 pl-6">
                                <span className="block">
                                    Pembimbing I:{' '}
                                    {bimbingan.pembimbing1?.nama || '-'}
                                </span>
                                {bimbingan.pembimbing2 && (
                                    <span className="block">
                                        Pembimbing II:{' '}
                                        {bimbingan.pembimbing2.nama}
                                    </span>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TahapTugasAkhirStepper
                                tahapan={tahapan}
                                tahapSaatIni={bimbingan.tahap_saat_ini}
                                selesaiPada={bimbingan.selesai_pada}
                                partialApproval={
                                    bimbingan.pembimbing2 !== null &&
                                    Boolean(
                                        bimbingan.acc_pembimbing_1_pada,
                                    ) !==
                                        Boolean(
                                            bimbingan.acc_pembimbing_2_pada,
                                        )
                                }
                            />
                        </CardContent>
                    </Card>

                    {bimbingan.bab_tugas_akhir.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Checklist Bab</CardTitle>
                                <CardDescription>
                                    Dikelola oleh dosen pembimbing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <BabTugasAkhirChecklist
                                    bab={bimbingan.bab_tugas_akhir}
                                />
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                Tambah Catatan
                            </CardTitle>
                            <CardDescription>
                                Laporkan progres Anda kepada dosen pembimbing
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleAddCatatan}
                                className="flex flex-col gap-3 sm:flex-row sm:items-start"
                            >
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        placeholder="Contoh: Sudah submit draft Bab 1 untuk direview"
                                        value={catatanForm.data.catatan}
                                        onChange={(e) =>
                                            catatanForm.setData(
                                                'catatan',
                                                e.target.value,
                                            )
                                        }
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
                                <Button
                                    type="submit"
                                    disabled={catatanForm.processing}
                                    className="bg-green-700 hover:bg-green-800"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Kirim
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProgressTugasAkhirTimeline
                                entries={bimbingan.progress}
                                tahapan={tahapan}
                            />
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Pengajuan Judul Tugas Akhir" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Pengajuan Judul Tugas Akhir
                    </h1>
                    <p className="text-muted-foreground">
                        Ajukan hingga {batasAktif} judul tugas akhir untuk
                        ditinjau oleh admin program studi
                    </p>
                </div>

                {sisaSlot > 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-4 w-4 text-muted-foreground" />
                                Ajukan Judul Baru
                            </CardTitle>
                            <CardDescription>
                                Sisa slot aktif: {sisaSlot} dari {batasAktif}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-3 sm:flex-row sm:items-start"
                            >
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="judul" className="sr-only">
                                        Judul
                                    </Label>
                                    <Input
                                        id="judul"
                                        placeholder="Judul tugas akhir yang diajukan"
                                        value={data.judul}
                                        onChange={(e) =>
                                            setData('judul', e.target.value)
                                        }
                                        aria-invalid={!!errors.judul}
                                    />
                                    {errors.judul && (
                                        <p className="text-sm text-destructive">
                                            {errors.judul}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-green-700 hover:bg-green-800"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Ajukan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="py-4 text-sm text-amber-800">
                            Anda sudah mengajukan {batasAktif} judul yang
                            masih aktif (pending/disetujui). Hapus pengajuan
                            yang masih pending atau tunggu keputusan admin
                            prodi untuk mengajukan judul baru.
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-3">
                    {pengajuan.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                                <p className="text-sm font-medium text-gray-900">
                                    Belum ada judul yang diajukan
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Judul yang Anda ajukan akan muncul di sini
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        pengajuan.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="flex items-start justify-between gap-3 py-4">
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-900">
                                            {item.judul}
                                        </p>
                                        <div>
                                            <Badge
                                                variant={
                                                    STATUS_VARIANTS[
                                                        item.status
                                                    ] || 'outline'
                                                }
                                            >
                                                {STATUS_LABELS[item.status] ||
                                                    item.status}
                                            </Badge>
                                        </div>
                                        {item.catatan && (
                                            <p className="max-w-md text-xs text-muted-foreground">
                                                Catatan: {item.catatan}
                                            </p>
                                        )}
                                    </div>
                                    {item.status === 'pending' && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Hapus pengajuan"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Hapus Pengajuan Judul
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Pengajuan judul "
                                                        {item.judul}" akan
                                                        dihapus. Anda dapat
                                                        mengajukan judul lain
                                                        setelahnya.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(item)
                                                        }
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Ya, Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

PengajuanJudulTaMahasiswa.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            {
                title: 'Pengajuan Judul TA',
                href: '/mahasiswa/pengajuan-judul-ta',
            },
        ]}
    >
        {page}
    </AppLayout>
);
