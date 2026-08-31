import { Head, Link, useForm, router } from '@inertiajs/react';
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

export default function DataAkademikCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nama_tahun_akademik: '',
        semester: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'nonaktif',
        periode_krs: '',
        periode_input_nilai: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/data-akademik', {
            onSuccess: () => {
                router.visit('/admin/data-akademik');
            },
        });
    };

    return (
        <>
            <Head title="Tambah Tahun Akademik" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/data-akademik">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Tambah Tahun Akademik
                        </h1>
                        <p className="text-muted-foreground">
                            Tambahkan tahun akademik baru
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Informasi Umum */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Umum</CardTitle>
                                <CardDescription>
                                    Data identitas tahun akademik
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_tahun_akademik">
                                        Tahun Akademik{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_tahun_akademik"
                                        placeholder="2025/2026"
                                        value={data.nama_tahun_akademik}
                                        onChange={(e) =>
                                            setData(
                                                'nama_tahun_akademik',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            errors.nama_tahun_akademik
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.nama_tahun_akademik && (
                                        <p className="text-sm text-red-500">
                                            {errors.nama_tahun_akademik}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="semester">
                                        Semester{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.semester}
                                        onValueChange={(value) =>
                                            setData('semester', value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.semester
                                                    ? 'border-red-500'
                                                    : ''
                                            }
                                        >
                                            <SelectValue placeholder="Pilih Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ganjil">
                                                Ganjil
                                            </SelectItem>
                                            <SelectItem value="Genap">
                                                Genap
                                            </SelectItem>
                                            <SelectItem value="Summer">
                                                Summer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.semester && (
                                        <p className="text-sm text-red-500">
                                            {errors.semester}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) =>
                                            setData('status', value)
                                        }
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
                                            <SelectItem value="aktif">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="nonaktif">
                                                Nonaktif
                                            </SelectItem>
                                            <SelectItem value="arsip">
                                                Arsip
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Jadwal */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Jadwal</CardTitle>
                                <CardDescription>
                                    Periode waktu tahun akademik
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">
                                        Tanggal Mulai{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) =>
                                            setData(
                                                'tanggal_mulai',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            errors.tanggal_mulai
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.tanggal_mulai && (
                                        <p className="text-sm text-red-500">
                                            {errors.tanggal_mulai}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">
                                        Tanggal Selesai{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) =>
                                            setData(
                                                'tanggal_selesai',
                                                e.target.value,
                                            )
                                        }
                                        className={
                                            errors.tanggal_selesai
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {errors.tanggal_selesai && (
                                        <p className="text-sm text-red-500">
                                            {errors.tanggal_selesai}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="periode_krs">
                                        Periode KRS
                                    </Label>
                                    <Input
                                        id="periode_krs"
                                        placeholder="2025/2026 Genap"
                                        value={data.periode_krs}
                                        onChange={(e) =>
                                            setData(
                                                'periode_krs',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="periode_input_nilai">
                                        Periode Input Nilai
                                    </Label>
                                    <Input
                                        id="periode_input_nilai"
                                        placeholder="2025/2026 Genap"
                                        value={data.periode_input_nilai}
                                        onChange={(e) =>
                                            setData(
                                                'periode_input_nilai',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Link href="/admin/data-akademik">
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

DataAkademikCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Data Akademik', href: '/admin/data-akademik' },
            { title: 'Tambah', href: '/admin/data-akademik/create' },
        ]}
    >
        {page}
    </AppLayout>
);
