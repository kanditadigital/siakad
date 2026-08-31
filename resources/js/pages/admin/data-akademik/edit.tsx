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

type AcademicYear = {
    id: number;
    uuid: string;
    nama_tahun_akademik: string;
    semester: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status: string;
    periode_krs: string | null;
    periode_input_nilai: string | null;
};

type Props = {
    academicYear: AcademicYear;
};

function Required() {
    return <span className="text-destructive"> *</span>;
}

export default function DataAkademikEdit({ academicYear }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama_tahun_akademik: academicYear.nama_tahun_akademik,
        semester: academicYear.semester,
        tanggal_mulai: academicYear.tanggal_mulai,
        tanggal_selesai: academicYear.tanggal_selesai,
        status: academicYear.status,
        periode_krs: academicYear.periode_krs || '',
        periode_input_nilai: academicYear.periode_input_nilai || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/data-akademik/${academicYear.uuid}`);
    };

    return (
        <>
            <Head
                title={`Edit ${academicYear.nama_tahun_akademik} ${academicYear.semester}`}
            />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/data-akademik">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit Tahun Akademik
                        </h1>
                        <p className="text-muted-foreground">
                            Edit data tahun akademik{' '}
                            {academicYear.nama_tahun_akademik}{' '}
                            {academicYear.semester}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Umum</CardTitle>
                            <CardDescription>
                                Data identitas tahun akademik
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_tahun_akademik">
                                        Tahun Akademik
                                        <Required />
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
                                        aria-invalid={
                                            !!errors.nama_tahun_akademik
                                        }
                                    />
                                    {errors.nama_tahun_akademik && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_tahun_akademik}
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
                                        onValueChange={(value) =>
                                            setData('semester', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="semester"
                                            aria-invalid={!!errors.semester}
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
                                        <p className="text-sm text-destructive">
                                            {errors.semester}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    Status
                                    <Required />
                                </Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData('status', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="status"
                                        aria-invalid={!!errors.status}
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
                                    <p className="text-sm text-destructive">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal</CardTitle>
                            <CardDescription>
                                Periode waktu tahun akademik
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">
                                        Tanggal Mulai
                                        <Required />
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
                                        aria-invalid={!!errors.tanggal_mulai}
                                    />
                                    {errors.tanggal_mulai && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_mulai}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">
                                        Tanggal Selesai
                                        <Required />
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
                                        aria-invalid={
                                            !!errors.tanggal_selesai
                                        }
                                    />
                                    {errors.tanggal_selesai && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_selesai}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                        aria-invalid={!!errors.periode_krs}
                                    />
                                    {errors.periode_krs && (
                                        <p className="text-sm text-destructive">
                                            {errors.periode_krs}
                                        </p>
                                    )}
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
                                        aria-invalid={
                                            !!errors.periode_input_nilai
                                        }
                                    />
                                    {errors.periode_input_nilai && (
                                        <p className="text-sm text-destructive">
                                            {errors.periode_input_nilai}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/data-akademik">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DataAkademikEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Data Akademik', href: '/admin/data-akademik' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
