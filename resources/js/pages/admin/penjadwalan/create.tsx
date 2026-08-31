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
                            Tambahkan jadwal kelas baru
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Kelas</CardTitle>
                        <CardDescription>
                            Isi data kelas perkuliahan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_kelas">
                                        Kode Kelas
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
                                    />
                                    {errors.kode_kelas && (
                                        <p className="text-sm text-red-500">
                                            {errors.kode_kelas}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_kelas">
                                        Nama Kelas
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
                                    />
                                    {errors.nama_kelas && (
                                        <p className="text-sm text-red-500">
                                            {errors.nama_kelas}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Mata Kuliah</Label>
                                    <Select
                                        value={data.mata_kuliah_id}
                                        onValueChange={(v) =>
                                            setData('mata_kuliah_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Mata Kuliah" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mataKuliahs.map((mk) => (
                                                <SelectItem
                                                    key={mk.id}
                                                    value={mk.id.toString()}
                                                >
                                                    {mk.kode_mk} - {mk.nama_mk}{' '}
                                                    ({mk.sks} SKS)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.mata_kuliah_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.mata_kuliah_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Dosen</Label>
                                    <Select
                                        value={data.dosen_id}
                                        onValueChange={(v) =>
                                            setData('dosen_id', v)
                                        }
                                    >
                                        <SelectTrigger>
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
                                        <p className="text-sm text-red-500">
                                            {errors.dosen_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Ruang</Label>
                                    <Select
                                        value={data.ruang_id}
                                        onValueChange={(v) =>
                                            setData('ruang_id', v)
                                        }
                                    >
                                        <SelectTrigger>
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
                                        <p className="text-sm text-red-500">
                                            {errors.ruang_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kapasitas">Kapasitas</Label>
                                    <Input
                                        id="kapasitas"
                                        type="number"
                                        value={data.kapasitas}
                                        onChange={(e) =>
                                            setData('kapasitas', e.target.value)
                                        }
                                        placeholder="30"
                                    />
                                    {errors.kapasitas && (
                                        <p className="text-sm text-red-500">
                                            {errors.kapasitas}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Semester</Label>
                                    <Select
                                        value={data.semester}
                                        onValueChange={(v) =>
                                            setData('semester', v)
                                        }
                                    >
                                        <SelectTrigger>
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
                                        <p className="text-sm text-red-500">
                                            {errors.semester}
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
                                                        - {ays.semester}
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
                                <Link href="/admin/penjadwalan">
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
