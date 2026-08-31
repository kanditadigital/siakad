import { Head, router } from '@inertiajs/react';
import { CheckCircle, FileWarning, FileText } from 'lucide-react';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

type RpsItem = {
    id: number;
    uuid: string;
    status: string;
    file_path: string | null;
    catatan: string | null;
    uploaded_at: string | null;
    kelas: {
        nama_kelas: string;
        mata_kuliah: { nama_mk: string };
        dosen: { nama: string } | null;
    };
};

type Props = {
    rpsList: RpsItem[];
};

const STATUS_LABELS: Record<string, string> = {
    belum_upload: 'Belum Upload',
    sudah_upload: 'Sudah Upload',
    perlu_revisi: 'Perlu Revisi',
    disetujui: 'Disetujui',
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    belum_upload: 'outline',
    sudah_upload: 'secondary',
    perlu_revisi: 'destructive',
    disetujui: 'default',
};

export default function RpsIndex({ rpsList }: Props) {
    const [revisionTarget, setRevisionTarget] = useState<RpsItem | null>(null);
    const [catatan, setCatatan] = useState('');

    const handleApprove = (rps: RpsItem) => {
        router.patch(`/admin/rps/${rps.uuid}/approve`);
    };

    const handleRequestRevision = (e: React.FormEvent) => {
        e.preventDefault();

        if (!revisionTarget) {
return;
}

        router.patch(
            `/admin/rps/${revisionTarget.uuid}/request-revision`,
            { catatan },
            {
                onSuccess: () => {
                    setRevisionTarget(null);
                    setCatatan('');
                },
            },
        );
    };

    return (
        <>
            <Head title="RPS" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        RPS (Rencana Pembelajaran Semester)
                    </h1>
                    <p className="text-gray-600">
                        Tinjau dokumen RPS yang diunggah dosen per kelas
                    </p>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Daftar RPS
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-600">
                                            Kelas
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Mata Kuliah
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Dosen
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right text-gray-600">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rpsList.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                Belum ada data RPS
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        rpsList.map((rps) => (
                                            <TableRow key={rps.id}>
                                                <TableCell className="text-gray-900">
                                                    {rps.kelas?.nama_kelas}
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {
                                                        rps.kelas?.mata_kuliah
                                                            ?.nama_mk
                                                    }
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {rps.kelas?.dosen?.nama ||
                                                        '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            STATUS_VARIANTS[
                                                                rps.status
                                                            ] || 'outline'
                                                        }
                                                    >
                                                        {STATUS_LABELS[
                                                            rps.status
                                                        ] || rps.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {rps.file_path && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                            >
                                                                <a
                                                                    href={`/storage/${rps.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title="Lihat file"
                                                                >
                                                                    <FileText className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        )}
                                                        {rps.status ===
                                                            'sudah_upload' && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Setujui"
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            rps,
                                                                        )
                                                                    }
                                                                >
                                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    title="Minta Revisi"
                                                                    onClick={() =>
                                                                        setRevisionTarget(
                                                                            rps,
                                                                        )
                                                                    }
                                                                >
                                                                    <FileWarning className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={!!revisionTarget}
                onOpenChange={(open) => !open && setRevisionTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Minta Revisi RPS</DialogTitle>
                        <DialogDescription>
                            {revisionTarget?.kelas?.nama_kelas}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleRequestRevision}
                        className="space-y-4"
                    >
                        <Textarea
                            placeholder="Jelaskan apa yang perlu direvisi..."
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            required
                        />
                        <DialogFooter>
                            <Button type="submit">Kirim</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
