import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    CheckCircle2,
    Clock,
    Hash,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

type Krs = {
    id: number;
    uuid: string;
    status: string;
    mahasiswa: {
        nim: string;
        nama: string;
        program_studi: { nama_prodi: string };
    };
    kelas: {
        kode_kelas: string;
        nama_kelas: string;
        mata_kuliah: { kode_mk: string; nama_mk: string; sks: number };
        dosen: { nama: string } | null;
    } | null;
    academic_year_semester: { nama_tahun_akademik: string; semester: string };
};

type Pengecekan = {
    total_sks_disetujui: number;
    total_sks_jika_disetujui: number;
    batas_sks_flat: number;
    ips_terakhir: number;
    batas_sks_ips: number;
    ada_bentrok_jadwal: boolean;
    prasyarat_terpenuhi: boolean;
};

type Props = {
    krs: Krs;
    pengecekan: Pengecekan;
};

export default function KrsPaShow({ krs, pengecekan }: Props) {
    const [action, setAction] = useState<'reject' | 'revisi' | null>(null);
    const [processing, setProcessing] = useState(false);
    const catatanForm = useForm({ catatan: '' });

    const handleApprove = () => {
        setProcessing(true);
        router.patch(
            `/dosen/krs-pa/${krs.uuid}/approve`,
            {},
            { onFinish: () => setProcessing(false) },
        );
    };

    const handleCatatanSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!action) {
            return;
        }

        catatanForm.patch(`/dosen/krs-pa/${krs.uuid}/${action}`, {
            onSuccess: () => {
                setAction(null);
                catatanForm.reset();
            },
        });
    };

    const melebihiBatasFlat =
        pengecekan.total_sks_jika_disetujui > pengecekan.batas_sks_flat;
    const melebihiBatasIps =
        pengecekan.total_sks_jika_disetujui > pengecekan.batas_sks_ips;

    return (
        <>
            <Head title={`Review KRS - ${krs.mahasiswa.nama}`} />

            <div className="space-y-6">
                <Link
                    href="/dosen/krs-pa"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Review KRS
                </Link>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <User className="h-5 w-5 text-green-700" />
                                Mahasiswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium text-gray-900">
                                {krs.mahasiswa.nama}
                            </p>
                            <p className="font-mono text-sm text-gray-600">
                                {krs.mahasiswa.nim}
                            </p>
                            <p className="text-sm text-gray-600">
                                {krs.mahasiswa.program_studi?.nama_prodi}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <Hash className="h-5 w-5 text-green-700" />
                                Mata Kuliah Diajukan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="font-medium text-gray-900">
                                {krs.kelas?.mata_kuliah.nama_mk || '-'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {krs.kelas?.mata_kuliah.kode_mk} •{' '}
                                {krs.kelas?.mata_kuliah.sks} SKS • Kelas{' '}
                                {krs.kelas?.nama_kelas}
                            </p>
                            <p className="text-sm text-gray-600">
                                {krs.academic_year_semester.nama_tahun_akademik}{' '}
                                - Semester {krs.academic_year_semester.semester}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Pengecekan Sebelum Disetujui
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm text-gray-700">
                                Total SKS jika disetujui
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium tabular-nums">
                                    {pengecekan.total_sks_jika_disetujui} /{' '}
                                    {pengecekan.batas_sks_flat} SKS
                                </span>
                                {melebihiBatasFlat && (
                                    <Badge variant="destructive">
                                        Melebihi batas
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm text-gray-700">
                                Batas SKS berdasarkan IPS terakhir (
                                {pengecekan.ips_terakhir.toFixed(2)})
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium tabular-nums">
                                    {pengecekan.batas_sks_ips} SKS
                                </span>
                                {melebihiBatasIps && (
                                    <Badge
                                        variant="outline"
                                        className="border-amber-300 bg-amber-50 text-amber-700"
                                    >
                                        <AlertTriangle className="mr-1 h-3 w-3" />
                                        Pertimbangkan revisi
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm text-gray-700">
                                Bentrok jadwal dengan kelas lain
                            </span>
                            {pengecekan.ada_bentrok_jadwal ? (
                                <Badge variant="destructive">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Ada bentrok
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="border-green-200 text-green-700"
                                >
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Tidak ada bentrok
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center justify-between rounded-md border p-3">
                            <span className="text-sm text-gray-700">
                                Prasyarat mata kuliah
                            </span>
                            {pengecekan.prasyarat_terpenuhi ? (
                                <Badge
                                    variant="outline"
                                    className="border-green-200 text-green-700"
                                >
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Terpenuhi
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Belum terpenuhi
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {krs.status === 'pending' ? (
                    <div className="flex items-center gap-3">
                        <Button
                            className="bg-green-700 hover:bg-green-800"
                            disabled={processing}
                            onClick={handleApprove}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Setujui
                        </Button>
                        <Button
                            variant="outline"
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                            onClick={() => setAction('revisi')}
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            Minta Revisi
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setAction('reject')}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Tolak
                        </Button>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        KRS ini sudah diproses dengan status "{krs.status}".
                    </p>
                )}

                <Dialog
                    open={action !== null}
                    onOpenChange={(open) => !open && setAction(null)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {action === 'reject'
                                    ? 'Tolak KRS'
                                    : 'Minta Revisi KRS'}
                            </DialogTitle>
                            <DialogDescription>
                                Catatan ini akan dilihat mahasiswa dan
                                tersimpan di riwayat bimbingan akademik.
                            </DialogDescription>
                        </DialogHeader>
                        <form
                            onSubmit={handleCatatanSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="catatan">Catatan</Label>
                                <Textarea
                                    id="catatan"
                                    value={catatanForm.data.catatan}
                                    onChange={(e) =>
                                        catatanForm.setData(
                                            'catatan',
                                            e.target.value,
                                        )
                                    }
                                    placeholder='Contoh: "Kurangi SKS semester ini" atau "Sebaiknya ulang Mata Kuliah Statistik"'
                                    rows={4}
                                    aria-invalid={!!catatanForm.errors.catatan}
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
                                    variant={
                                        action === 'reject'
                                            ? 'destructive'
                                            : 'default'
                                    }
                                    disabled={catatanForm.processing}
                                >
                                    {catatanForm.processing
                                        ? 'Menyimpan...'
                                        : action === 'reject'
                                          ? 'Tolak KRS'
                                          : 'Kirim Permintaan Revisi'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

KrsPaShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Review KRS (PA)', href: '/dosen/krs-pa' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
