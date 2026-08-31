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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
};

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
};

type Dosen = {
    id: number;
    nama: string;
};

type Kelas = {
    id: number;
    kode_kelas: string;
    nama_kelas: string;
    mata_kuliah: MataKuliah;
    dosen: Dosen | null;
};

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type Props = {
    mahasiswas: Mahasiswa[];
    kelases: Kelas[];
    academicYearSemesters: AcademicYearSemester[];
};

export default function KrsCreate({
    mahasiswas,
    kelases,
    academicYearSemesters,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        mahasiswa_id: '',
        kelas_id: '',
        academic_year_semester_id: '',
        status: 'pending',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/krs');
    };

    return (
        <>
            <Head title="Tambah KRS" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/krs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Tambah KRS
                        </h1>
                        <p className="text-muted-foreground">
                            Tambahkan Kartu Rencana Studi baru
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah KRS</CardTitle>
                        <CardDescription>
                            Isi data KRS mahasiswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Mahasiswa</Label>
                                    <Select
                                        value={data.mahasiswa_id}
                                        onValueChange={(v) =>
                                            setData('mahasiswa_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Mahasiswa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mahasiswas.map((m) => (
                                                <SelectItem
                                                    key={m.id}
                                                    value={m.id.toString()}
                                                >
                                                    {m.nim} - {m.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.mahasiswa_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.mahasiswa_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <Select
                                        value={data.kelas_id}
                                        onValueChange={(v) =>
                                            setData('kelas_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelases.map((k) => (
                                                <SelectItem
                                                    key={k.id}
                                                    value={k.id.toString()}
                                                >
                                                    {k.kode_kelas} -{' '}
                                                    {k.mata_kuliah?.nama_mk} (
                                                    {k.mata_kuliah?.sks} SKS)
                                                    {k.dosen &&
                                                        ` | ${k.dosen.nama}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kelas_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.kelas_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Tahun Akademik</Label>
                                    <Select
                                        value={data.academic_year_semester_id}
                                        onValueChange={(v) =>
                                            setData(
                                                'academic_year_semester_id',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tahun Akademik" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYearSemesters.map(
                                                (ays) => (
                                                    <SelectItem
                                                        key={ays.id}
                                                        value={ays.id.toString()}
                                                    >
                                                        {
                                                            ays.nama_tahun_akademik
                                                        }{' '}
                                                        - Semester{' '}
                                                        {ays.semester}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.academic_year_semester_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.academic_year_semester_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(v) =>
                                            setData('status', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="disetujui">
                                                Disetujui
                                            </SelectItem>
                                            <SelectItem value="ditolak">
                                                Ditolak
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/admin/krs">
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

KrsCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'KRS', href: '/admin/krs' },
            { title: 'Tambah', href: '/admin/krs/create' },
        ]}
    >
        {page}
    </AppLayout>
);
