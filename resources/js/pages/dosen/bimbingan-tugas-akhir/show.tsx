import { Head, router, useForm } from '@inertiajs/react';
import { Check, GraduationCap, Pencil, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { BabTugasAkhirChecklist  } from '@/components/bab-tugas-akhir-checklist';
import type {Bab} from '@/components/bab-tugas-akhir-checklist';
import { ProgressTugasAkhirTimeline } from '@/components/progress-tugas-akhir-timeline';
import { TahapTugasAkhirStepper } from '@/components/tahap-tugas-akhir-stepper';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

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
    uuid: string;
    judul: string;
    tahap_saat_ini: string;
    selesai_pada: string | null;
    acc_pembimbing_1_pada: string | null;
    acc_pembimbing_2_pada: string | null;
    mahasiswa: {
        nim: string;
        nama: string;
        program_studi?: { nama_prodi: string };
    };
    pembimbing1: { nama: string } | null;
    pembimbing2: { nama: string } | null;
    progress: ProgressEntry[];
    bab_tugas_akhir: Bab[];
};

type Props = {
    bimbingan: Bimbingan;
    tahapan: [string, string][];
    viewerPembimbingSlot: 1 | 2;
};

export default function BimbinganTugasAkhirShow({
    bimbingan,
    tahapan,
    viewerPembimbingSlot,
}: Props) {
    const [openRevisi, setOpenRevisi] = useState(false);
    const [openJudul, setOpenJudul] = useState(false);
    const [processingAcc, setProcessingAcc] = useState(false);

    const revisiForm = useForm({ catatan: '' });
    const judulForm = useForm({ judul: bimbingan.judul });

    const tahapSaatIniLabel =
        tahapan.find(([key]) => key === bimbingan.tahap_saat_ini)?.[1] ??
        bimbingan.tahap_saat_ini;

    const butuhKeduanya = bimbingan.pembimbing2 !== null;
    const accSaya =
        viewerPembimbingSlot === 1
            ? bimbingan.acc_pembimbing_1_pada
            : bimbingan.acc_pembimbing_2_pada;
    const accLainnya =
        viewerPembimbingSlot === 1
            ? bimbingan.acc_pembimbing_2_pada
            : bimbingan.acc_pembimbing_1_pada;
    const partialApproval = butuhKeduanya && Boolean(accSaya) !== Boolean(accLainnya);

    const handleToggleAcc = () => {
        setProcessingAcc(true);
        router.post(
            `/dosen/bimbingan-tugas-akhir/${bimbingan.uuid}/tahap/setujui`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingAcc(false),
            },
        );
    };

    const handleRevisi = (e: React.FormEvent) => {
        e.preventDefault();
        revisiForm.post(
            `/dosen/bimbingan-tugas-akhir/${bimbingan.uuid}/revisi`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpenRevisi(false);
                    revisiForm.reset();
                },
            },
        );
    };

    const handleGantiJudul = (e: React.FormEvent) => {
        e.preventDefault();
        judulForm.patch(
            `/dosen/bimbingan-tugas-akhir/${bimbingan.uuid}/ganti-judul`,
            {
                preserveScroll: true,
                onSuccess: () => setOpenJudul(false),
            },
        );
    };

    return (
        <>
            <Head title="Detail Bimbingan Tugas Akhir" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        {bimbingan.mahasiswa.nama}
                    </h1>
                    <p className="text-muted-foreground">
                        {bimbingan.mahasiswa.nim}
                        {bimbingan.mahasiswa.program_studi &&
                            ` · ${bimbingan.mahasiswa.program_studi.nama_prodi}`}
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
                    <CardContent className="space-y-6">
                        <TahapTugasAkhirStepper
                            tahapan={tahapan}
                            tahapSaatIni={bimbingan.tahap_saat_ini}
                            selesaiPada={bimbingan.selesai_pada}
                            partialApproval={partialApproval}
                        />

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                className={
                                    accSaya
                                        ? 'border border-green-700 bg-white text-green-700 hover:bg-green-50'
                                        : 'bg-green-700 hover:bg-green-800'
                                }
                                disabled={
                                    bimbingan.selesai_pada !== null ||
                                    processingAcc
                                }
                                onClick={handleToggleAcc}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                {accSaya
                                    ? `Anda Sudah Setuju — Batalkan`
                                    : `Setujui "${tahapSaatIniLabel}" Selesai`}
                            </Button>

                            <Dialog
                                open={openRevisi}
                                onOpenChange={setOpenRevisi}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Tambah Revisi
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Tambah Catatan Revisi
                                        </DialogTitle>
                                        <DialogDescription>
                                            Dicatat pada tahap "
                                            {tahapSaatIniLabel}"
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleRevisi}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label>Catatan Revisi</Label>
                                            <Textarea
                                                value={
                                                    revisiForm.data.catatan
                                                }
                                                onChange={(e) =>
                                                    revisiForm.setData(
                                                        'catatan',
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={
                                                    !!revisiForm.errors
                                                        .catatan
                                                }
                                            />
                                            {revisiForm.errors.catatan && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        revisiForm.errors
                                                            .catatan
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    revisiForm.processing
                                                }
                                                className="bg-green-700 hover:bg-green-800"
                                            >
                                                Simpan
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            <Dialog
                                open={openJudul}
                                onOpenChange={setOpenJudul}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Ubah Judul
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Ubah Judul</DialogTitle>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleGantiJudul}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label>Judul Baru</Label>
                                            <Input
                                                value={judulForm.data.judul}
                                                onChange={(e) =>
                                                    judulForm.setData(
                                                        'judul',
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={
                                                    !!judulForm.errors.judul
                                                }
                                            />
                                            {judulForm.errors.judul && (
                                                <p className="text-sm text-destructive">
                                                    {judulForm.errors.judul}
                                                </p>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    judulForm.processing
                                                }
                                                className="bg-green-700 hover:bg-green-800"
                                            >
                                                Simpan
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {butuhKeduanya && !bimbingan.selesai_pada && (
                            <p className="text-xs text-muted-foreground">
                                {accSaya && !accLainnya &&
                                    'Menunggu persetujuan pembimbing satunya.'}
                                {!accSaya && accLainnya &&
                                    'Pembimbing satunya sudah menyetujui, menunggu persetujuan Anda.'}
                                {!accSaya && !accLainnya &&
                                    'Tahap ini butuh persetujuan dari Pembimbing I dan II.'}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {(bimbingan.tahap_saat_ini === 'penyusunan_bab' ||
                    bimbingan.bab_tugas_akhir.length > 0) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Checklist Bab</CardTitle>
                            <CardDescription>
                                Item bawaan Bab 1-5 dibuat otomatis; tambah
                                atau hapus sesuai kebutuhan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BabTugasAkhirChecklist
                                bab={bimbingan.bab_tugas_akhir}
                                bimbinganUuid={bimbingan.uuid}
                            />
                        </CardContent>
                    </Card>
                )}

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

BimbinganTugasAkhirShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            {
                title: 'Bimbingan Tugas Akhir',
                href: '/dosen/bimbingan-tugas-akhir',
            },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
