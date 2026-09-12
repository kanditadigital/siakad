import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
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

function Required() {
    return <span className="text-destructive"> *</span>;
}

export default function ProgramStudiCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kode_prodi: '',
        nama_prodi: '',
        fakultas: '',
        lama_studi: '4',
        jenis_prodi: '',
        nim_prefix: '',
        nim_digit_count: '3',
        nim_year_digits: '2',
    });

    const previewNim = useMemo(() => {
        const prefix = data.nim_prefix || '149';
        const year = new Date().getFullYear();
        const yearDigits = parseInt(data.nim_year_digits) || 2;
        const yearSuffix = String(year).slice(-yearDigits);
        const counterDigits = parseInt(data.nim_digit_count) || 3;
        const counter = '1'.padStart(counterDigits, '0');

        return `${prefix}${yearSuffix}01${counter}`;
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
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="nama_prodi">
                                    Nama Program Studi
                                    <Required />
                                </Label>
                                <Input
                                    id="nama_prodi"
                                    value={data.nama_prodi}
                                    onChange={(e) =>
                                        setData('nama_prodi', e.target.value)
                                    }
                                    placeholder="Teknik Informatika"
                                    aria-invalid={!!errors.nama_prodi}
                                />
                                {errors.nama_prodi && (
                                    <p className="text-sm text-destructive">
                                        {errors.nama_prodi}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fakultas">
                                    Fakultas
                                    <Required />
                                </Label>
                                <Input
                                    id="fakultas"
                                    value={data.fakultas}
                                    onChange={(e) =>
                                        setData('fakultas', e.target.value)
                                    }
                                    placeholder="Fakultas Teknik"
                                    aria-invalid={!!errors.fakultas}
                                />
                                {errors.fakultas && (
                                    <p className="text-sm text-destructive">
                                        {errors.fakultas}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_prodi">
                                        Kode Prodi
                                        <Required />
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
                                        aria-invalid={!!errors.kode_prodi}
                                    />
                                    {errors.kode_prodi && (
                                        <p className="text-sm text-destructive">
                                            {errors.kode_prodi}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_prodi">
                                        Jenjang
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.jenis_prodi}
                                        onValueChange={(value) =>
                                            setData('jenis_prodi', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="jenis_prodi"
                                            aria-invalid={!!errors.jenis_prodi}
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
                                        <p className="text-sm text-destructive">
                                            {errors.jenis_prodi}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lama_studi">
                                        Lama Studi
                                        <Required />
                                    </Label>
                                    <div className="relative">
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
                                            aria-invalid={!!errors.lama_studi}
                                            className="pr-14"
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                                            Tahun
                                        </span>
                                    </div>
                                    {errors.lama_studi && (
                                        <p className="text-sm text-destructive">
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
                                Format nomor induk mahasiswa yang akan
                                digenerate otomatis saat mendaftarkan mahasiswa
                                baru
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="nim_prefix">
                                        Kode Wajib Prodi
                                        <Required />
                                    </Label>
                                    <Input
                                        id="nim_prefix"
                                        value={data.nim_prefix}
                                        onChange={(e) =>
                                            setData(
                                                'nim_prefix',
                                                e.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 3),
                                            )
                                        }
                                        placeholder="149"
                                        inputMode="numeric"
                                        maxLength={3}
                                        aria-invalid={!!errors.nim_prefix}
                                        className="font-mono"
                                    />
                                    {errors.nim_prefix && (
                                        <p className="text-sm text-destructive">
                                            {errors.nim_prefix}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nim_year_digits">
                                        Digit Tahun Masuk
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.nim_year_digits}
                                        onValueChange={(value) =>
                                            setData('nim_year_digits', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="nim_year_digits"
                                            aria-invalid={
                                                !!errors.nim_year_digits
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
                                    {errors.nim_year_digits && (
                                        <p className="text-sm text-destructive">
                                            {errors.nim_year_digits}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nim_digit_count">
                                        Digit Nomor Urut
                                        <Required />
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
                                        aria-invalid={!!errors.nim_digit_count}
                                    />
                                    {errors.nim_digit_count && (
                                        <p className="text-sm text-destructive">
                                            {errors.nim_digit_count}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-600">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-green-700">
                                        Contoh NIM yang akan digenerate
                                    </p>
                                    <p className="font-mono text-lg font-semibold text-green-800">
                                        {previewNim}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/program-studi">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Menyimpan...'
                                : 'Simpan Program Studi'}
                        </Button>
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
