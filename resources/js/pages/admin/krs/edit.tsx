import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
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

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
    program_studi: ProgramStudi | null;
};

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
    program_studi: ProgramStudi | null;
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

type Krs = {
    id: number;
    uuid: string;
    mahasiswa_id: number;
    kelas_id: number;
    academic_year_semester_id: number;
    status: string;
};

type Props = {
    krs: Krs;
    mahasiswas: Mahasiswa[];
    kelases: Kelas[];
    academicYearSemesters: AcademicYearSemester[];
    programStudis: ProgramStudi[];
};

function Required() {
    return <span className="text-destructive"> *</span>;
}

export default function KrsEdit({
    krs,
    mahasiswas,
    kelases,
    academicYearSemesters,
    programStudis,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        mahasiswa_id: krs.mahasiswa_id.toString(),
        kelas_id: krs.kelas_id.toString(),
        academic_year_semester_id: krs.academic_year_semester_id.toString(),
        status: krs.status,
    });

    const [mahasiswaSearch, setMahasiswaSearch] = useState('');
    const [mahasiswaProdi, setMahasiswaProdi] = useState('all');
    const [kelasSearch, setKelasSearch] = useState('');
    const [kelasProdi, setKelasProdi] = useState('all');

    const filteredMahasiswas = useMemo(() => {
        const q = mahasiswaSearch.trim().toLowerCase();

        return mahasiswas.filter((m) => {
            const matchesProdi =
                mahasiswaProdi === 'all' ||
                m.program_studi?.id.toString() === mahasiswaProdi;
            const matchesSearch =
                q === '' ||
                m.nim.toLowerCase().includes(q) ||
                m.nama.toLowerCase().includes(q);

            return matchesProdi && matchesSearch;
        });
    }, [mahasiswas, mahasiswaSearch, mahasiswaProdi]);

    const filteredKelases = useMemo(() => {
        const q = kelasSearch.trim().toLowerCase();

        return kelases.filter((k) => {
            const matchesProdi =
                kelasProdi === 'all' ||
                k.mata_kuliah?.program_studi?.id.toString() === kelasProdi;
            const matchesSearch =
                q === '' ||
                k.kode_kelas.toLowerCase().includes(q) ||
                k.nama_kelas.toLowerCase().includes(q) ||
                k.mata_kuliah?.nama_mk.toLowerCase().includes(q) ||
                k.dosen?.nama.toLowerCase().includes(q);

            return matchesProdi && matchesSearch;
        });
    }, [kelases, kelasSearch, kelasProdi]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/krs/${krs.uuid}`);
    };

    return (
        <>
            <Head title="Edit KRS" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/krs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit KRS
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data Kartu Rencana Studi
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data KRS</CardTitle>
                            <CardDescription>
                                Mahasiswa, kelas, dan periode akademik
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="mahasiswa_id">
                                    Mahasiswa
                                    <Required />
                                </Label>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_200px]">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            value={mahasiswaSearch}
                                            onChange={(e) =>
                                                setMahasiswaSearch(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Cari NIM atau nama mahasiswa..."
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select
                                        value={mahasiswaProdi}
                                        onValueChange={setMahasiswaProdi}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Program Studi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Program Studi
                                            </SelectItem>
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
                                </div>
                                <Select
                                    value={data.mahasiswa_id}
                                    onValueChange={(v) =>
                                        setData('mahasiswa_id', v)
                                    }
                                >
                                    <SelectTrigger
                                        id="mahasiswa_id"
                                        aria-invalid={!!errors.mahasiswa_id}
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Pilih Mahasiswa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredMahasiswas.length === 0 ? (
                                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                                Tidak ada mahasiswa yang cocok
                                            </div>
                                        ) : (
                                            filteredMahasiswas.map((m) => (
                                                <SelectItem
                                                    key={m.id}
                                                    value={m.id.toString()}
                                                >
                                                    {m.nim} - {m.nama}
                                                    {m.program_studi &&
                                                        ` (${m.program_studi.nama_prodi})`}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.mahasiswa_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.mahasiswa_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kelas_id">
                                    Kelas
                                    <Required />
                                </Label>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_200px]">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            value={kelasSearch}
                                            onChange={(e) =>
                                                setKelasSearch(e.target.value)
                                            }
                                            placeholder="Cari kode kelas, mata kuliah, atau dosen..."
                                            className="pl-9"
                                        />
                                    </div>
                                    <Select
                                        value={kelasProdi}
                                        onValueChange={setKelasProdi}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua Program Studi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua Program Studi
                                            </SelectItem>
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
                                </div>
                                <Select
                                    value={data.kelas_id}
                                    onValueChange={(v) =>
                                        setData('kelas_id', v)
                                    }
                                >
                                    <SelectTrigger
                                        id="kelas_id"
                                        aria-invalid={!!errors.kelas_id}
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredKelases.length === 0 ? (
                                            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                                                Tidak ada kelas yang cocok
                                            </div>
                                        ) : (
                                            filteredKelases.map((k) => (
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
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.kelas_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.kelas_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                                        - Semester{' '}
                                                        {ays.semester}
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
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/krs">
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

KrsEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'KRS', href: '/admin/krs' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
