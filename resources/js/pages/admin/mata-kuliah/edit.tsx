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

type MataKuliah = {
    id: number;
    uuid: string;
    kode_mk: string;
    nama_mk: string;
    program_studi_id: number;
    jenis: string;
    sks: number;
    semester: number;
    status: string;
};

type Props = {
    mataKuliah: MataKuliah;
    programStudis: ProgramStudi[];
};

const JENIS_OPTIONS = [
    { value: 'Wajib', label: 'Wajib' },
    { value: 'Pilihan', label: 'Pilihan' },
];

const STATUS_OPTIONS = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' },
];

export default function MataKuliahEdit({ mataKuliah, programStudis }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        kode_mk: mataKuliah.kode_mk,
        nama_mk: mataKuliah.nama_mk,
        program_studi_id: mataKuliah.program_studi_id.toString(),
        jenis: mataKuliah.jenis,
        sks: mataKuliah.sks.toString(),
        semester: mataKuliah.semester.toString(),
        status: mataKuliah.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/mata-kuliah/${mataKuliah.uuid}`);
    };

    return (
        <>
            <Head title={`Edit Mata Kuliah - ${mataKuliah.nama_mk}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/mata-kuliah">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit Mata Kuliah
                        </h1>
                        <p className="text-muted-foreground">
                            Edit data mata kuliah {mataKuliah.nama_mk}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Mata Kuliah</CardTitle>
                        <CardDescription>
                            Perbarui data mata kuliah
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_mk">
                                        Kode Mata Kuliah
                                    </Label>
                                    <Input
                                        id="kode_mk"
                                        value={data.kode_mk}
                                        onChange={(e) =>
                                            setData('kode_mk', e.target.value)
                                        }
                                        placeholder="MK001"
                                        className={
                                            errors.kode_mk
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.kode_mk && (
                                        <p className="text-sm text-red-500">
                                            {errors.kode_mk}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="program_studi_id">
                                        Program Studi
                                    </Label>
                                    <Select
                                        value={data.program_studi_id}
                                        onValueChange={(v) =>
                                            setData('program_studi_id', v)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.program_studi_id
                                                    ? 'border-red-500'
                                                    : ''
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
                                        <p className="text-sm text-red-500">
                                            {errors.program_studi_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nama_mk">
                                    Nama Mata Kuliah
                                </Label>
                                <Input
                                    id="nama_mk"
                                    value={data.nama_mk}
                                    onChange={(e) =>
                                        setData('nama_mk', e.target.value)
                                    }
                                    placeholder="Pemrograman Web"
                                    className={
                                        errors.nama_mk ? 'border-red-500' : ''
                                    }
                                />
                                {errors.nama_mk && (
                                    <p className="text-sm text-red-500">
                                        {errors.nama_mk}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="jenis">Jenis</Label>
                                    <Select
                                        value={data.jenis}
                                        onValueChange={(v) =>
                                            setData('jenis', v)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.jenis
                                                    ? 'border-red-500'
                                                    : ''
                                            }
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
                                        <p className="text-sm text-red-500">
                                            {errors.jenis}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sks">SKS</Label>
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
                                        className={
                                            errors.sks ? 'border-red-500' : ''
                                        }
                                    />
                                    {errors.sks && (
                                        <p className="text-sm text-red-500">
                                            {errors.sks}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="semester">Semester</Label>
                                    <Select
                                        value={data.semester}
                                        onValueChange={(v) =>
                                            setData('semester', v)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.semester
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        >
                                            <SelectValue placeholder="Pilih" />
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
                                        <p className="text-sm text-red-500">
                                            {errors.semester}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(v) => setData('status', v)}
                                >
                                    <SelectTrigger
                                        className={
                                            errors.status
                                                ? 'border-red-500'
                                                : ''
                                        }
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
                                    <p className="text-sm text-red-500">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/admin/mata-kuliah">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MataKuliahEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Mata Kuliah', href: '/admin/mata-kuliah' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
