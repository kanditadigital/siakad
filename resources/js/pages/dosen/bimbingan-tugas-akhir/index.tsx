import { Head, useForm } from '@inertiajs/react';
import { Plus, PenLine } from 'lucide-react';
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
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
    program_studi?: { nama_prodi: string };
};

type Dosen = {
    id: number;
    nama: string;
};

type Bimbingan = {
    id: number;
    uuid: string;
    judul: string;
    status: string;
    catatan: string | null;
    mahasiswa: Mahasiswa;
    pembimbing1: Dosen;
    pembimbing2: Dosen | null;
};

type Props = {
    bimbingans: Bimbingan[];
    mahasiswas: Mahasiswa[];
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    aktif: 'default',
    revisi: 'secondary',
    lainnya: 'outline',
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    revisi: 'Revisi',
    lainnya: 'Lainnya',
};

export default function BimbinganTugasAkhirIndex({
    bimbingans,
    mahasiswas,
}: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [editing, setEditing] = useState<Bimbingan | null>(null);

    const createForm = useForm({
        mahasiswa_id: '',
        judul: '',
    });

    const statusForm = useForm({
        status: 'aktif',
        catatan: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/dosen/bimbingan-tugas-akhir', {
            onSuccess: () => {
                setOpenCreate(false);
                createForm.reset();
            },
        });
    };

    const openEdit = (bimbingan: Bimbingan) => {
        setEditing(bimbingan);
        statusForm.setData({
            status: bimbingan.status,
            catatan: bimbingan.catatan || '',
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!editing) {
            return;
        }

        statusForm.put(`/dosen/bimbingan-tugas-akhir/${editing.uuid}`, {
            onSuccess: () => setEditing(null),
        });
    };

    return (
        <>
            <Head title="Bimbingan Tugas Akhir" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Bimbingan Tugas Akhir
                        </h1>
                        <p className="text-gray-600">
                            Mahasiswa yang Anda bimbing sebagai Pembimbing I
                            atau II
                        </p>
                    </div>
                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-700 hover:bg-green-800">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Bimbingan
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Tambah Bimbingan Tugas Akhir
                                </DialogTitle>
                                <DialogDescription>
                                    Anda akan tercatat sebagai Pembimbing I
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Mahasiswa</Label>
                                    <Select
                                        value={createForm.data.mahasiswa_id}
                                        onValueChange={(v) =>
                                            createForm.setData(
                                                'mahasiswa_id',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih mahasiswa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mahasiswas.map((m) => (
                                                <SelectItem
                                                    key={m.id}
                                                    value={m.id.toString()}
                                                >
                                                    {m.nim} — {m.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.mahasiswa_id && (
                                        <p className="text-sm text-destructive">
                                            {createForm.errors.mahasiswa_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Judul Tugas Akhir</Label>
                                    <Textarea
                                        value={createForm.data.judul}
                                        onChange={(e) =>
                                            createForm.setData(
                                                'judul',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {createForm.errors.judul && (
                                        <p className="text-sm text-destructive">
                                            {createForm.errors.judul}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="bg-green-700 hover:bg-green-800"
                                    >
                                        Simpan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Daftar Bimbingan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-gray-600">
                                            NIM
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Nama Mahasiswa
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Judul Tugas Akhir
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Pembimbing I
                                        </TableHead>
                                        <TableHead className="text-gray-600">
                                            Pembimbing II
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
                                    {bimbingans.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                Belum ada mahasiswa bimbingan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bimbingans.map((b) => (
                                            <TableRow key={b.id}>
                                                <TableCell className="font-mono text-gray-900">
                                                    {b.mahasiswa?.nim}
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {b.mahasiswa?.nama}
                                                </TableCell>
                                                <TableCell className="max-w-xs text-gray-900">
                                                    {b.judul}
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {b.pembimbing1?.nama}
                                                </TableCell>
                                                <TableCell className="text-gray-900">
                                                    {b.pembimbing2?.nama || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            STATUS_VARIANTS[
                                                                b.status
                                                            ] || 'outline'
                                                        }
                                                    >
                                                        {STATUS_LABELS[
                                                            b.status
                                                        ] || b.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Dialog
                                                        open={
                                                            editing?.id === b.id
                                                        }
                                                        onOpenChange={(open) =>
                                                            !open &&
                                                            setEditing(null)
                                                        }
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    openEdit(b)
                                                                }
                                                            >
                                                                <PenLine className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Update
                                                                    Status
                                                                    Bimbingan
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    {
                                                                        b
                                                                            .mahasiswa
                                                                            ?.nama
                                                                    }
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <form
                                                                onSubmit={
                                                                    handleUpdate
                                                                }
                                                                className="space-y-4"
                                                            >
                                                                <div className="space-y-2">
                                                                    <Label>
                                                                        Status
                                                                    </Label>
                                                                    <Select
                                                                        value={
                                                                            statusForm
                                                                                .data
                                                                                .status
                                                                        }
                                                                        onValueChange={(
                                                                            v,
                                                                        ) =>
                                                                            statusForm.setData(
                                                                                'status',
                                                                                v,
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="aktif">
                                                                                Aktif
                                                                            </SelectItem>
                                                                            <SelectItem value="revisi">
                                                                                Revisi
                                                                            </SelectItem>
                                                                            <SelectItem value="lainnya">
                                                                                Lainnya
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>
                                                                        Catatan
                                                                    </Label>
                                                                    <Textarea
                                                                        value={
                                                                            statusForm
                                                                                .data
                                                                                .catatan
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            statusForm.setData(
                                                                                'catatan',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button
                                                                        type="submit"
                                                                        disabled={
                                                                            statusForm.processing
                                                                        }
                                                                        className="bg-green-700 hover:bg-green-800"
                                                                    >
                                                                        Simpan
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
            </div>
        </>
    );
}
