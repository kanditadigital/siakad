import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type MataKuliahOption = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    program_studi_id: number;
};

type Props = {
    programStudis: ProgramStudi[];
    mataKuliahs: MataKuliahOption[];
};

const JENIS_OPTIONS = [
    { value: 'Wajib', label: 'Wajib' },
    { value: 'Pilihan', label: 'Pilihan' },
];

const STATUS_OPTIONS = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' },
];

function Required() {
    return <span className="text-destructive"> *</span>;
}

export default function MataKuliahCreate({ programStudis, mataKuliahs }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kode_mk: '',
        nama_mk: '',
        program_studi_id: '',
        jenis: '',
        sks: '',
        semester: '',
        prasyarat_mata_kuliah_id: '',
        status: 'aktif',
    });

    const prasyaratOptions = mataKuliahs.filter(
        (mk) =>
            data.program_studi_id &&
            mk.program_studi_id === Number(data.program_studi_id),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/mata-kuliah');
    };

    return (
        <>
            <Head title="Tambah Mata Kuliah" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/mata-kuliah">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Tambah Mata Kuliah
                        </h1>
                        <p className="text-muted-foreground">
                            Tambahkan mata kuliah baru
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Informasi Mata Kuliah */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Mata Kuliah</CardTitle>
                                <CardDescription>
                                    Data identitas mata kuliah
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_mk">
                                        Kode Mata Kuliah
                                        <Required />
                                    </Label>
                                    <Input
                                        id="kode_mk"
                                        value={data.kode_mk}
                                        onChange={(e) =>
                                            setData('kode_mk', e.target.value)
                                        }
                                        placeholder="MK001"
                                        aria-invalid={!!errors.kode_mk}
                                    />
                                    {errors.kode_mk && (
                                        <p className="text-sm text-destructive">
                                            {errors.kode_mk}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nama_mk">
                                        Nama Mata Kuliah
                                        <Required />
                                    </Label>
                                    <Input
                                        id="nama_mk"
                                        value={data.nama_mk}
                                        onChange={(e) =>
                                            setData('nama_mk', e.target.value)
                                        }
                                        placeholder="Pemrograman Web"
                                        aria-invalid={!!errors.nama_mk}
                                    />
                                    {errors.nama_mk && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_mk}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="program_studi_id">
                                        Program Studi
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.program_studi_id}
                                        onValueChange={(v) =>
                                            setData('program_studi_id', v)
                                        }
                                    >
                                        <SelectTrigger
                                            id="program_studi_id"
                                            aria-invalid={
                                                !!errors.program_studi_id
                                            }
                                        >
                                            <SelectValue placeholder="Pilih Program Studi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programStudis.map((p) => (
                                                <SelectItem
                                                    key={p.id}
                                                    value={p.id.toString()}
                                                >
                                                    {p.nama_prodi}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.program_studi_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.program_studi_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenis">
                                        Jenis
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.jenis}
                                        onValueChange={(v) =>
                                            setData('jenis', v)
                                        }
                                    >
                                        <SelectTrigger
                                            id="jenis"
                                            aria-invalid={!!errors.jenis}
                                        >
                                            <SelectValue placeholder="Pilih Jenis" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JENIS_OPTIONS.map((j) => (
                                                <SelectItem
                                                    key={j.value}
                                                    value={j.value}
                                                >
                                                    {j.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis && (
                                        <p className="text-sm text-destructive">
                                            {errors.jenis}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Detail */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail</CardTitle>
                                <CardDescription>
                                    Informasi SKS, semester, dan status
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sks">
                                        SKS
                                        <Required />
                                    </Label>
                                    <Input
                                        id="sks"
                                        type="number"
                                        min="1"
                                        max="6"
                                        value={data.sks}
                                        onChange={(e) =>
                                            setData('sks', e.target.value)
                                        }
                                        placeholder="3"
                                        aria-invalid={!!errors.sks}
                                    />
                                    {errors.sks && (
                                        <p className="text-sm text-destructive">
                                            {errors.sks}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="semester">
                                        Semester
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.semester}
                                        onValueChange={(v) =>
                                            setData('semester', v)
                                        }
                                    >
                                        <SelectTrigger
                                            id="semester"
                                            aria-invalid={!!errors.semester}
                                        >
                                            <SelectValue placeholder="Pilih Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Array.from(
                                                { length: 8 },
                                                (_, i) => i + 1,
                                            ).map((s) => (
                                                <SelectItem
                                                    key={s}
                                                    value={s.toString()}
                                                >
                                                    Semester {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.semester && (
                                        <p className="text-sm text-destructive">
                                            {errors.semester}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prasyarat_mata_kuliah_id">
                                        Prasyarat{' '}
                                        <span className="font-normal text-muted-foreground">
                                            (opsional)
                                        </span>
                                    </Label>
                                    <Select
                                        value={
                                            data.prasyarat_mata_kuliah_id ||
                                            'none'
                                        }
                                        onValueChange={(v) =>
                                            setData(
                                                'prasyarat_mata_kuliah_id',
                                                v === 'none' ? '' : v,
                                            )
                                        }
                                        disabled={!data.program_studi_id}
                                    >
                                        <SelectTrigger
                                            id="prasyarat_mata_kuliah_id"
                                            aria-invalid={
                                                !!errors.prasyarat_mata_kuliah_id
                                            }
                                        >
                                            <SelectValue placeholder="Tanpa prasyarat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                Tanpa prasyarat
                                            </SelectItem>
                                            {prasyaratOptions.map((mk) => (
                                                <SelectItem
                                                    key={mk.id}
                                                    value={mk.id.toString()}
                                                >
                                                    {mk.kode_mk} -{' '}
                                                    {mk.nama_mk}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.prasyarat_mata_kuliah_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.prasyarat_mata_kuliah_id}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(v) =>
                                            setData('status', v)
                                        }
                                    >
                                        <SelectTrigger
                                            id="status"
                                            aria-invalid={!!errors.status}
                                        >
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((s) => (
                                                <SelectItem
                                                    key={s.value}
                                                    value={s.value}
                                                >
                                                    {s.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/mata-kuliah">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Mata Kuliah'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

MataKuliahCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Mata Kuliah', href: '/admin/mata-kuliah' },
            { title: 'Tambah', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
