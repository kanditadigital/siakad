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

type Ruang = {
    id: number;
    kode_ruang: string;
    nama_ruang: string;
};

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type Props = {
    mataKuliahs: MataKuliah[];
    dosens: Dosen[];
    ruangs: Ruang[];
    academicYearSemesters: AcademicYearSemester[];
};

function Required() {
    return <span className="text-destructive"> *</span>;
}

export default function PenjadwalanCreate({
    mataKuliahs,
    dosens,
    ruangs,
    academicYearSemesters,
}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        kode_kelas: '',
        nama_kelas: '',
        mata_kuliah_id: '',
        dosen_id: '',
        ruang_id: '',
        hari: '',
        jam_mulai: '',
        jam_selesai: '',
        kapasitas: '',
        semester: '',
        academic_year_semester_id: '',
        status: 'Aktif',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/penjadwalan');
    };

    return (
        <>
            <Head title="Tambah Kelas" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/penjadwalan">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Tambah Kelas
                        </h1>
                        <p className="text-muted-foreground">
                            Isi form berikut untuk menambahkan jadwal kelas
                            baru
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kelas</CardTitle>
                            <CardDescription>
                                Identitas dan kapasitas kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_kelas">
                                        Kode Kelas
                                        <Required />
                                    </Label>
                                    <Input
                                        id="kode_kelas"
                                        value={data.kode_kelas}
                                        onChange={(e) =>
                                            setData(
                                                'kode_kelas',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="KEL001"
                                        aria-invalid={!!errors.kode_kelas}
                                    />
                                    {errors.kode_kelas && (
                                        <p className="text-sm text-destructive">
                                            {errors.kode_kelas}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_kelas">
                                        Nama Kelas
                                        <Required />
                                    </Label>
                                    <Input
                                        id="nama_kelas"
                                        value={data.nama_kelas}
                                        onChange={(e) =>
                                            setData(
                                                'nama_kelas',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Kelas A"
                                        aria-invalid={!!errors.nama_kelas}
                                    />
                                    {errors.nama_kelas && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_kelas}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kapasitas">
                                        Kapasitas
                                        <Required />
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="kapasitas"
                                            type="number"
                                            min="1"
                                            max="200"
                                            value={data.kapasitas}
                                            onChange={(e) =>
                                                setData(
                                                    'kapasitas',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="30"
                                            aria-invalid={!!errors.kapasitas}
                                            className="pr-24"
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                                            Mahasiswa
                                        </span>
                                    </div>
                                    {errors.kapasitas && (
                                        <p className="text-sm text-destructive">
                                            {errors.kapasitas}
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
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Aktif">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="Tidak Aktif">
                                                Tidak Aktif
                                            </SelectItem>
                                            <SelectItem value="Selesai">
                                                Selesai
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal & Pengampu</CardTitle>
                            <CardDescription>
                                Mata kuliah, dosen, ruang, dan periode kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="mata_kuliah_id">
                                    Mata Kuliah
                                    <Required />
                                </Label>
                                <Select
                                    value={data.mata_kuliah_id}
                                    onValueChange={(v) =>
                                        setData('mata_kuliah_id', v)
                                    }
                                >
                                    <SelectTrigger
                                        id="mata_kuliah_id"
                                        aria-invalid={
                                            !!errors.mata_kuliah_id
                                        }
                                    >
                                        <SelectValue placeholder="Pilih Mata Kuliah" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mataKuliahs.map((mk) => (
                                            <SelectItem
                                                key={mk.id}
                                                value={mk.id.toString()}
                                            >
                                                {mk.kode_mk} - {mk.nama_mk} (
                                                {mk.sks} SKS)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.mata_kuliah_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.mata_kuliah_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dosen_id">Dosen</Label>
                                    <Select
                                        value={data.dosen_id}
                                        onValueChange={(v) =>
                                            setData('dosen_id', v)
                                        }
                                    >
                                        <SelectTrigger
                                            id="dosen_id"
                                            aria-invalid={!!errors.dosen_id}
                                        >
                                            <SelectValue placeholder="Pilih Dosen" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    {errors.dosen_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.dosen_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ruang_id">Ruang</Label>
                                    <Select
                                        value={data.ruang_id}
                                        onValueChange={(v) =>
                                            setData('ruang_id', v)
                                        }
                                    >
                                        <SelectTrigger
                                            id="ruang_id"
                                            aria-invalid={!!errors.ruang_id}
                                        >
                                            <SelectValue placeholder="Pilih Ruang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ruangs.map((r) => (
                                                <SelectItem
                                                    key={r.id}
                                                    value={r.id.toString()}
                                                >
                                                    {r.kode_ruang} -{' '}
                                                    {r.nama_ruang}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.ruang_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.ruang_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="hari">Hari</Label>
                                    <Select
                                        value={data.hari}
                                        onValueChange={(v) =>
                                            setData('hari', v)
                                        }
                                    >
                                        <SelectTrigger
                                            id="hari"
                                            aria-invalid={!!errors.hari}
                                        >
                                            <SelectValue placeholder="Pilih Hari" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                'Senin',
                                                'Selasa',
                                                'Rabu',
                                                'Kamis',
                                                'Jumat',
                                                'Sabtu',
                                                'Minggu',
                                            ].map((h) => (
                                                <SelectItem key={h} value={h}>
                                                    {h}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.hari && (
                                        <p className="text-sm text-destructive">
                                            {errors.hari}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_mulai">
                                        Jam Mulai
                                    </Label>
                                    <Input
                                        id="jam_mulai"
                                        type="time"
                                        value={data.jam_mulai}
                                        onChange={(e) =>
                                            setData(
                                                'jam_mulai',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.jam_mulai}
                                    />
                                    {errors.jam_mulai && (
                                        <p className="text-sm text-destructive">
                                            {errors.jam_mulai}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jam_selesai">
                                        Jam Selesai
                                    </Label>
                                    <Input
                                        id="jam_selesai"
                                        type="time"
                                        value={data.jam_selesai}
                                        onChange={(e) =>
                                            setData(
                                                'jam_selesai',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.jam_selesai}
                                    />
                                    {errors.jam_selesai && (
                                        <p className="text-sm text-destructive">
                                            {errors.jam_selesai}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                    <Label htmlFor="academic_year_semester_id">
                                        Tahun Akademik
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.academic_year_semester_id}
                                        onValueChange={(v) =>
                                            setData(
                                                'academic_year_semester_id',
                                                v,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="academic_year_semester_id"
                                            aria-invalid={
                                                !!errors.academic_year_semester_id
                                            }
                                        >
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
                                                        - {ays.semester}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.academic_year_semester_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.academic_year_semester_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/penjadwalan">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Kelas'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

PenjadwalanCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Penjadwalan', href: '/admin/penjadwalan' },
            { title: 'Tambah', href: '/admin/penjadwalan/create' },
        ]}
    >
        {page}
    </AppLayout>
);
