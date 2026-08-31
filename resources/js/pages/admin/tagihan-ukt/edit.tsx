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

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
};

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type UktScheme = {
    id: number;
    nama: string;
    jumlah: number;
};

type TagihanUkt = {
    id: number;
    uuid: string;
    mahasiswa_id: number;
    academic_year_semester_id: number;
    ukt_scheme_id: number | null;
    jumlah_tagihan: number;
    jumlah_bayar: number;
    jatuh_tempo: string;
    status: string;
    keterangan: string | null;
};

type Props = {
    tagihanUkt: TagihanUkt;
    mahasiswas: Mahasiswa[];
    academicYearSemesters: AcademicYearSemester[];
    uktSchemes: UktScheme[];
};

export default function TagihanUktEdit({
    tagihanUkt,
    mahasiswas,
    academicYearSemesters,
    uktSchemes,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        mahasiswa_id: tagihanUkt.mahasiswa_id.toString(),
        academic_year_semester_id:
            tagihanUkt.academic_year_semester_id.toString(),
        ukt_scheme_id: tagihanUkt.ukt_scheme_id?.toString() || '',
        jumlah_tagihan: tagihanUkt.jumlah_tagihan.toString(),
        jumlah_bayar: tagihanUkt.jumlah_bayar.toString(),
        jatuh_tempo: tagihanUkt.jatuh_tempo.split('T')[0],
        status: tagihanUkt.status,
        keterangan: tagihanUkt.keterangan || '',
    });

    const handleUktSchemeChange = (value: string) => {
        if (value) {
            const scheme = uktSchemes.find((s) => s.id.toString() === value);

            if (scheme) {
                setData((prev) => ({
                    ...prev,
                    ukt_scheme_id: value,
                    jumlah_tagihan: scheme.jumlah.toString(),
                }));
            }
        } else {
            setData((prev) => ({ ...prev, ukt_scheme_id: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/tagihan-ukt/${tagihanUkt.uuid}`);
    };

    return (
        <>
            <Head title="Edit Tagihan UKT" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tagihan-ukt">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit Tagihan UKT
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data tagihan UKT
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Tagihan UKT</CardTitle>
                        <CardDescription>
                            Perbarui data tagihan uang kuliah tunggal
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
                                    <Label>Skema UKT</Label>
                                    <Select
                                        value={data.ukt_scheme_id}
                                        onValueChange={handleUktSchemeChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Skema UKT (opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {uktSchemes.map((s) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={s.id.toString()}
                                                >
                                                    {s.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.ukt_scheme_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.ukt_scheme_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jumlah_tagihan">
                                        Jumlah Tagihan (Rp)
                                    </Label>
                                    <Input
                                        id="jumlah_tagihan"
                                        type="number"
                                        min="0"
                                        value={data.jumlah_tagihan}
                                        onChange={(e) =>
                                            setData(
                                                'jumlah_tagihan',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.jumlah_tagihan && (
                                        <p className="text-sm text-red-500">
                                            {errors.jumlah_tagihan}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jumlah_bayar">
                                        Jumlah Bayar (Rp)
                                    </Label>
                                    <Input
                                        id="jumlah_bayar"
                                        type="number"
                                        min="0"
                                        value={data.jumlah_bayar}
                                        onChange={(e) =>
                                            setData(
                                                'jumlah_bayar',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.jumlah_bayar && (
                                        <p className="text-sm text-red-500">
                                            {errors.jumlah_bayar}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jatuh_tempo">
                                        Jatuh Tempo
                                    </Label>
                                    <Input
                                        id="jatuh_tempo"
                                        type="date"
                                        value={data.jatuh_tempo}
                                        onChange={(e) =>
                                            setData(
                                                'jatuh_tempo',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.jatuh_tempo && (
                                        <p className="text-sm text-red-500">
                                            {errors.jatuh_tempo}
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
                                            <SelectItem value="belum">
                                                Belum
                                            </SelectItem>
                                            <SelectItem value="lunas">
                                                Lunas
                                            </SelectItem>
                                            <SelectItem value="terlambat">
                                                Terlambat
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="keterangan">
                                        Keterangan
                                    </Label>
                                    <Input
                                        id="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) =>
                                            setData(
                                                'keterangan',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Opsional"
                                    />
                                    {errors.keterangan && (
                                        <p className="text-sm text-red-500">
                                            {errors.keterangan}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Perbarui'}
                                </Button>
                                <Link href="/admin/tagihan-ukt">
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

TagihanUktEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Tagihan UKT', href: '/admin/tagihan-ukt' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
