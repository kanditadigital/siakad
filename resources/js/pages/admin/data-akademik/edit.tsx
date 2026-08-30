import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
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
        put(`/admin/data-akademik/${academicYear.uuid}`, {
            onSuccess: () => {
                router.visit('/admin/data-akademik');
            },
        });
    };

    return (
        <>
            <Head title={`Edit ${academicYear.nama_tahun_akademik} ${academicYear.semester}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/data-akademik">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">
                            Edit {academicYear.nama_tahun_akademik} {academicYear.semester}
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data tahun akademik
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Tahun Akademik</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tahun Akademik */}
                                <div className="space-y-2">
                                    <Label htmlFor="nama_tahun_akademik">
                                        Tahun Akademik <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_tahun_akademik"
                                        placeholder="2025/2026"
                                        value={data.nama_tahun_akademik}
                                        onChange={(e) => setData('nama_tahun_akademik', e.target.value)}
                                        className={errors.nama_tahun_akademik ? 'border-red-500' : ''}
                                    />
                                    {errors.nama_tahun_akademik && (
                                        <p className="text-sm text-red-500">{errors.nama_tahun_akademik}</p>
                                    )}
                                </div>

                                {/* Semester */}
                                <div className="space-y-2">
                                    <Label htmlFor="semester">
                                        Semester <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.semester}
                                        onValueChange={(value) => setData('semester', value)}
                                    >
                                        <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Ganjil">Ganjil</SelectItem>
                                            <SelectItem value="Genap">Genap</SelectItem>
                                            <SelectItem value="Summer">Summer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.semester && (
                                        <p className="text-sm text-red-500">{errors.semester}</p>
                                    )}
                                </div>

                                {/* Tanggal Mulai */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_mulai">
                                        Tanggal Mulai <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        className={errors.tanggal_mulai ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggal_mulai && (
                                        <p className="text-sm text-red-500">{errors.tanggal_mulai}</p>
                                    )}
                                </div>

                                {/* Tanggal Selesai */}
                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_selesai">
                                        Tanggal Selesai <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                        className={errors.tanggal_selesai ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggal_selesai && (
                                        <p className="text-sm text-red-500">{errors.tanggal_selesai}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">Aktif</SelectItem>
                                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                            <SelectItem value="arsip">Arsip</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status}</p>
                                    )}
                                </div>

                                {/* Periode KRS */}
                                <div className="space-y-2">
                                    <Label htmlFor="periode_krs">Periode KRS</Label>
                                    <Input
                                        id="periode_krs"
                                        placeholder="2025/2026 Genap"
                                        value={data.periode_krs}
                                        onChange={(e) => setData('periode_krs', e.target.value)}
                                    />
                                </div>

                                {/* Periode Input Nilai */}
                                <div className="space-y-2">
                                    <Label htmlFor="periode_input_nilai">Periode Input Nilai</Label>
                                    <Input
                                        id="periode_input_nilai"
                                        placeholder="2025/2026 Genap"
                                        value={data.periode_input_nilai}
                                        onChange={(e) => setData('periode_input_nilai', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <Link href="/admin/data-akademik">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DataAkademikEdit.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Akademik', href: '/admin/data-akademik' },
        { title: 'Edit', href: '/admin/data-akademik/edit' },
    ]}>
        {page}
    </AppLayout>
);
