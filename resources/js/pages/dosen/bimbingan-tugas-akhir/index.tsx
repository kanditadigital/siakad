import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Check,
    ClipboardList,
    GraduationCap,
    Plus,
    Search,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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
    tahap_saat_ini: string;
    selesai_pada: string | null;
    mahasiswa: Mahasiswa;
    pembimbing1: Dosen;
    pembimbing2: Dosen | null;
};

type Props = {
    bimbingans: Bimbingan[];
    tahapan: [string, string][];
    /** Optional Inertia prop: only present after the dialog's partial reload. */
    mahasiswaOptions?: MahasiswaOptions;
    dosenOptions?: DosenOption[];
    filters: { mahasiswa_search: string };
};

type Kategori = 'semua' | 'baru' | 'berjalan' | 'selesai';

function kategoriBimbingan(b: Bimbingan): Exclude<Kategori, 'semua'> {
    if (b.selesai_pada) {
        return 'selesai';
    }

    return b.tahap_saat_ini === 'pengajuan_judul' ? 'baru' : 'berjalan';
}

type MahasiswaOption = {
    id: number;
    nim: string;
    nama: string;
};

type MahasiswaOptions = {
    items: MahasiswaOption[];
    total: number;
    limit: number;
};

type DosenOption = {
    id: number;
    nama: string;
    nidn: string | null;
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

const KATEGORI_TABS: { value: Kategori; label: string }[] = [
    { value: 'semua', label: 'Semua' },
    { value: 'baru', label: 'Baru Mengajukan Judul' },
    { value: 'berjalan', label: 'Sedang Berjalan' },
    { value: 'selesai', label: 'Selesai' },
];

function ProgressTahap({
    bimbingan,
    tahapan,
}: {
    bimbingan: Bimbingan;
    tahapan: [string, string][];
}) {
    if (bimbingan.selesai_pada) {
        return (
            <div className="flex items-center gap-1.5 text-green-700">
                <GraduationCap className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Selesai</span>
            </div>
        );
    }

    const index = tahapan.findIndex(
        ([key]) => key === bimbingan.tahap_saat_ini,
    );
    const label = tahapan[index]?.[1] ?? bimbingan.tahap_saat_ini;
    const percent = Math.round((index / tahapan.length) * 100);

    return (
        <div className="min-w-[140px] space-y-1">
            <p className="text-xs text-gray-700">{label}</p>
            <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div
                    className="h-1.5 rounded-full bg-green-600"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

export default function BimbinganTugasAkhirIndex({
    bimbingans,
    tahapan,
    filters,
}: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [kategori, setKategori] = useState<Kategori>('semua');
    const [search, setSearch] = useState(filters.mahasiswa_search);
    const [selected, setSelected] = useState<MahasiswaOption | null>(null);
    const [loadingOptions, setLoadingOptions] = useState(false);

    // Held locally rather than read straight off props: optional props are
    // absent from any non-partial visit — including the redirect back after a
    // failed submit — which would otherwise blank the open dialog.
    const [options, setOptions] = useState<MahasiswaOptions | undefined>(
        undefined,
    );
    const [dosens, setDosens] = useState<DosenOption[]>([]);

    const createForm = useForm({
        mahasiswa_id: '',
        judul: '',
        pembimbing_2_id: '',
    });

    // The picker's data is an optional prop, so it is fetched on demand: once
    // when the dialog opens, then again (debounced) as the dosen types. Keeping
    // the search server-side is what stops a whole cohort reaching the browser.
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (!openCreate) {
            isFirstLoad.current = true;

            return;
        }

        const delay = isFirstLoad.current ? 0 : 300;

        isFirstLoad.current = false;

        const timer = window.setTimeout(() => {
            router.reload({
                only: ['mahasiswaOptions', 'dosenOptions'],
                data: { mahasiswa_search: search },
                replace: true,
                onStart: () => setLoadingOptions(true),
                onSuccess: (page) => {
                    const props = page.props as {
                        mahasiswaOptions?: MahasiswaOptions;
                        dosenOptions?: DosenOption[];
                    };

                    if (props.mahasiswaOptions) {
                        setOptions(props.mahasiswaOptions);
                    }

                    if (props.dosenOptions) {
                        setDosens(props.dosenOptions);
                    }
                },
                onFinish: () => setLoadingOptions(false),
            });
        }, delay);

        return () => window.clearTimeout(timer);
    }, [openCreate, search]);

    const resetCreateDialog = () => {
        createForm.reset();
        createForm.clearErrors();
        setSelected(null);
        setSearch('');
    };

    const handleSelectMahasiswa = (mahasiswa: MahasiswaOption) => {
        setSelected(mahasiswa);
        createForm.setData('mahasiswa_id', mahasiswa.id.toString());
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/dosen/bimbingan-tugas-akhir', {
            preserveScroll: true,
            onSuccess: () => {
                setOpenCreate(false);
                resetCreateDialog();
            },
        });
    };

    const counts: Record<Kategori, number> = {
        semua: bimbingans.length,
        baru: 0,
        berjalan: 0,
        selesai: 0,
    };
    bimbingans.forEach((b) => {
        counts[kategoriBimbingan(b)]++;
    });

    const filteredBimbingans =
        kategori === 'semua'
            ? bimbingans
            : bimbingans.filter((b) => kategoriBimbingan(b) === kategori);

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
                    <Dialog
                        open={openCreate}
                        onOpenChange={(open) => {
                            setOpenCreate(open);

                            if (!open) {
                                resetCreateDialog();
                            }
                        }}
                    >
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
                                    <MahasiswaPicker
                                        options={options}
                                        loading={loadingOptions}
                                        search={search}
                                        onSearchChange={setSearch}
                                        selected={selected}
                                        onSelect={handleSelectMahasiswa}
                                    />
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
                                <div className="space-y-2">
                                    <Label>
                                        Pembimbing II{' '}
                                        <span className="font-normal text-muted-foreground">
                                            (opsional)
                                        </span>
                                    </Label>
                                    <Select
                                        value={
                                            createForm.data.pembimbing_2_id ||
                                            'none'
                                        }
                                        onValueChange={(v) =>
                                            createForm.setData(
                                                'pembimbing_2_id',
                                                v === 'none' ? '' : v,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tanpa Pembimbing II" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Tanpa Pembimbing II
                                            </SelectItem>
                                            {dosens.map((d) => (
                                                <SelectItem
                                                    key={d.id}
                                                    value={d.id.toString()}
                                                >
                                                    {d.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.pembimbing_2_id && (
                                        <p className="text-sm text-destructive">
                                            {createForm.errors.pembimbing_2_id}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={
                                            createForm.processing || !selected
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

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-gray-900">
                            Daftar Bimbingan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2 border-b">
                            {KATEGORI_TABS.map((tab) => (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => setKategori(tab.value)}
                                    className={cn(
                                        'flex items-center gap-1.5 border-b-2 px-1 pb-2 text-sm font-medium transition-colors',
                                        kategori === tab.value
                                            ? 'border-green-700 text-green-800'
                                            : 'border-transparent text-muted-foreground hover:text-gray-700',
                                    )}
                                >
                                    {tab.label}
                                    <Badge
                                        variant={
                                            kategori === tab.value
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className={
                                            kategori === tab.value
                                                ? 'bg-green-700'
                                                : ''
                                        }
                                    >
                                        {counts[tab.value]}
                                    </Badge>
                                </button>
                            ))}
                        </div>

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
                                        <TableHead className="text-gray-600">
                                            Progress
                                        </TableHead>
                                        <TableHead className="text-right text-gray-600">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBimbingans.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="py-8 text-center text-gray-500"
                                            >
                                                {bimbingans.length === 0
                                                    ? 'Belum ada mahasiswa bimbingan'
                                                    : 'Tidak ada bimbingan pada kategori ini'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBimbingans.map((b) => (
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
                                                <TableCell>
                                                    <ProgressTahap
                                                        bimbingan={b}
                                                        tahapan={tahapan}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Detail progress"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/dosen/bimbingan-tugas-akhir/${b.uuid}`}
                                                        >
                                                            <ClipboardList className="h-4 w-4" />
                                                        </Link>
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
            </div>
        </>
    );
}

/**
 * Mahasiswa picker for the create dialog.
 *
 * The list is resolved server-side and capped, so a large cohort never reaches
 * the browser: the dosen types to narrow it instead of scrolling. Mahasiswa who
 * already have a bimbingan are filtered out upstream.
 */
function MahasiswaPicker({
    options,
    loading,
    search,
    onSearchChange,
    selected,
    onSelect,
}: {
    options?: MahasiswaOptions;
    loading: boolean;
    search: string;
    onSearchChange: (value: string) => void;
    selected: MahasiswaOption | null;
    onSelect: (mahasiswa: MahasiswaOption) => void;
}) {
    const items = options?.items ?? [];
    const total = options?.total ?? 0;
    const hasMore = total > items.length;

    return (
        <div className="space-y-2">
            <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cari NIM atau nama mahasiswa…"
                    className="pl-9"
                    autoComplete="off"
                />
            </div>

            {selected && (
                <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-2">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-green-900">
                            {selected.nama}
                        </p>
                        <p className="font-mono text-xs text-green-700">
                            {selected.nim}
                        </p>
                    </div>
                    <Check className="h-4 w-4 shrink-0 text-green-700" />
                </div>
            )}

            <div className="max-h-56 overflow-y-auto rounded-md border border-gray-200">
                {loading ? (
                    <div className="space-y-2 p-3">
                        {[0, 1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-9 w-full" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
                        <GraduationCap className="h-6 w-6 text-gray-400" />
                        <p className="text-sm text-gray-600">
                            {search
                                ? `Tidak ada mahasiswa cocok dengan "${search}"`
                                : 'Tidak ada mahasiswa aktif yang belum punya bimbingan'}
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {items.map((m) => {
                            const isSelected = selected?.id === m.id;

                            return (
                                <li key={m.id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelect(m)}
                                        className={cn(
                                            'flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-muted',
                                            isSelected && 'bg-green-50',
                                        )}
                                    >
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm text-gray-900">
                                                {m.nama}
                                            </span>
                                            <span className="block font-mono text-xs text-gray-500">
                                                {m.nim}
                                            </span>
                                        </span>
                                        {isSelected && (
                                            <Check className="h-4 w-4 shrink-0 text-green-700" />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {!loading && items.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    {hasMore
                        ? `Menampilkan ${items.length} dari ${total} mahasiswa — persempit dengan pencarian.`
                        : `${total} mahasiswa tersedia.`}
                </p>
            )}
        </div>
    );
}
