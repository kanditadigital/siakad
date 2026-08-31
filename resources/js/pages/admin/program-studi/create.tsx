import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useMemo } from 'react';
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

const JENIS_PRODI = ['D3', 'S1', 'S2', 'S3'];

export default function ProgramStudiCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kode_prodi: '',
        nama_prodi: '',
        fakultas: '',
        lama_studi: '',
        jenis_prodi: '',
        nim_prefix: '',
        nim_digit_count: '3',
        nim_year_digits: '2',
    });

    const previewNim = useMemo(() => {
        const prefix = data.nim_prefix || '[PREFIX]';
        const year = new Date().getFullYear();
        const yearDigits = parseInt(data.nim_year_digits) || 2;
        const yearSuffix = String(year).slice(-yearDigits);
        const counterDigits = parseInt(data.nim_digit_count) || 3;
        const counter = '1'.padStart(counterDigits, '0');

        return `${prefix}${yearSuffix}${counter}`;
    }, [data.nim_prefix, data.nim_year_digits, data.nim_digit_count]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/program-studi');
    };

    return (
        <>
            <Head title="Tambah Program Studi" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/program-studi">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Tambah Program Studi
                        </h1>
                        <p className="text-muted-foreground">
                            Isi form berikut untuk menambahkan program studi
                            baru
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Dasar</CardTitle>
                            <CardDescription>
                                Data utama program studi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_prodi">
                                        Kode Program Studi
                                    </Label>
                                    <Input
                                        id="kode_prodi"
                                        value={data.kode_prodi}
                                        onChange={(e) =>
                                            setData(
                                                'kode_prodi',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="TI01"
                                        className={
                                            errors.kode_prodi
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.kode_prodi && (
                                        <p className="text-sm text-red-500">
                                            {errors.kode_prodi}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_prodi">
                                        Nama Program Studi
                                    </Label>
                                    <Input
                                        id="nama_prodi"
                                        value={data.nama_prodi}
                                        onChange={(e) =>
                                            setData(
                                                'nama_prodi',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Teknik Informatika"
                                        className={
                                            errors.nama_prodi
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.nama_prodi && (
                                        <p className="text-sm text-red-500">
                                            {errors.nama_prodi}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fakultas">Fakultas</Label>
                                    <Input
                                        id="fakultas"
                                        value={data.fakultas}
                                        onChange={(e) =>
                                            setData('fakultas', e.target.value)
                                        }
                                        placeholder="Fakultas Teknik"
                                        className={
                                            errors.fakultas
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.fakultas && (
                                        <p className="text-sm text-red-500">
                                            {errors.fakultas}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_prodi">Jenjang</Label>
                                    <Select
                                        value={data.jenis_prodi}
                                        onValueChange={(value) =>
                                            setData('jenis_prodi', value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.jenis_prodi
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        >
                                            <SelectValue placeholder="Pilih Jenjang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JENIS_PRODI.map((jenjang) => (
                                                <SelectItem
                                                    key={jenjang}
                                                    value={jenjang}
                                                >
                                                    {jenjang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_prodi && (
                                        <p className="text-sm text-red-500">
                                            {errors.jenis_prodi}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lama_studi">
                                        Lama Studi (Tahun)
                                    </Label>
                                    <Input
                                        id="lama_studi"
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={data.lama_studi}
                                        onChange={(e) =>
                                            setData(
                                                'lama_studi',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="4"
                                        className={
                                            errors.lama_studi
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.lama_studi && (
                                        <p className="text-sm text-red-500">
                                            {errors.lama_studi}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Konfigurasi NIM</CardTitle>
                            <CardDescription>
                                Pengaturan format nomor induk mahasiswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="nim_prefix">
                                        Prefix NIM
                                    </Label>
                                    <Input
                                        id="nim_prefix"
                                        value={data.nim_prefix}
                                        onChange={(e) =>
                                            setData(
                                                'nim_prefix',
                                                e.target.value.toUpperCase(),
                                            )
                                        }
                                        placeholder="TIF"
                                        className={
                                            errors.nim_prefix
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Kode program studi
                                    </p>
                                    {errors.nim_prefix && (
                                        <p className="text-sm text-red-500">
                                            {errors.nim_prefix}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nim_year_digits">
                                        Digit Tahun
                                    </Label>
                                    <Select
                                        value={data.nim_year_digits}
                                        onValueChange={(value) =>
                                            setData('nim_year_digits', value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.nim_year_digits
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        >
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2">
                                                2 digit (26)
                                            </SelectItem>
                                            <SelectItem value="3">
                                                3 digit (026)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Tahun masuk
                                    </p>
                                    {errors.nim_year_digits && (
                                        <p className="text-sm text-red-500">
                                            {errors.nim_year_digits}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nim_digit_count">
                                        Digit Counter
                                    </Label>
                                    <Input
                                        id="nim_digit_count"
                                        type="number"
                                        min="2"
                                        max="6"
                                        value={data.nim_digit_count}
                                        onChange={(e) =>
                                            setData(
                                                'nim_digit_count',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="4"
                                        className={
                                            errors.nim_digit_count
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Angka urut
                                    </p>
                                    {errors.nim_digit_count && (
                                        <p className="text-sm text-red-500">
                                            {errors.nim_digit_count}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3 rounded-md bg-muted p-3">
                                <p className="mb-1 text-xs text-muted-foreground">
                                    Contoh NIM yang akan digenerate:
                                </p>
                                <p className="font-mono text-sm font-medium">
                                    {previewNim}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Link href="/admin/program-studi">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

ProgramStudiCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Program Studi', href: '/admin/program-studi' },
            { title: 'Tambah', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
