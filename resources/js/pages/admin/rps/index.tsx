import { Head, router } from '@inertiajs/react';
import { CheckCircle, FileText, FileWarning, X } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

type RpsItem = {
    id: number;
    uuid: string;
    status: string;
    file_path: string | null;
    file_url: string | null;
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
    filters: {
        status?: string;
    };
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

export default function RpsIndex({ rpsList, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [revisionTarget, setRevisionTarget] = useState<RpsItem | null>(null);
    const [catatan, setCatatan] = useState('');

    const hasActiveFilters = Boolean(filters.status);

    const applyStatusFilter = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/admin/rps',
            { status: value === 'all' ? '' : value },
            { preserveState: true },
        );
    };

    const resetFilters = () => {
        setStatusFilter('all');
        router.get('/admin/rps');
    };

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
                    <p className="text-muted-foreground">
                        Tinjau dokumen RPS yang diunggah dosen per kelas
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        value={statusFilter}
                        onValueChange={applyStatusFilter}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="belum_upload">
                                Belum Upload
                            </SelectItem>
                            <SelectItem value="sudah_upload">
                                Sudah Upload
                            </SelectItem>
                            <SelectItem value="perlu_revisi">
                                Perlu Revisi
                            </SelectItem>
                            <SelectItem value="disetujui">
                                Disetujui
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                        >
                            <X className="mr-1 h-3.5 w-3.5" />
                            Reset
                        </Button>
                    )}
                </div>

                {/* Table */}
                <Card className="overflow-hidden py-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Mata Kuliah</TableHead>
                                    <TableHead>Dosen</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rpsList.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-12 text-center"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <FileText className="h-8 w-8 text-muted-foreground/50" />
                                                <p className="text-sm font-medium text-gray-900">
                                                    {hasActiveFilters
                                                        ? 'Tidak ada RPS yang cocok'
                                                        : 'Belum ada data RPS'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {hasActiveFilters
                                                        ? 'Coba ubah filter status'
                                                        : 'RPS akan muncul di sini setelah dosen mengunggah'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rpsList.map((rps) => (
                                        <TableRow key={rps.id}>
                                            <TableCell className="font-medium">
                                                {rps.kelas?.nama_kelas}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    rps.kelas?.mata_kuliah
                                                        ?.nama_mk
                                                }
                                            </TableCell>
                                            <TableCell>
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
                                                <div className="flex items-center justify-end gap-2">
                                                    {rps.file_url && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <a
                                                                href={rps.file_url}
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

RpsIndex.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'RPS', href: '/admin/rps' },
        ]}
    >
        {page}
    </AppLayout>
);
