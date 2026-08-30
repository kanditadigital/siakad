import { Head, Link, useForm } from '@inertiajs/react';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
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

type Kelas = {
    id: number;
    kode_kelas: string;
    mata_kuliah: MataKuliah;
};

type Krs = {
    id: number;
    mahasiswa: Mahasiswa;
    kelas: Kelas;
};

type Nilai = {
    id: number;
    uuid: string;
    krs_id: number;
    nilai: number | null;
    grade: string | null;
    status: string;
    keterangan: string | null;
    krs: Krs;
};

type Props = {
    nilai: Nilai;
    krss: Krs[];
};

export default function NilaiEdit({ nilai, krss }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        krs_id: nilai.krs_id.toString(),
        nilai: nilai.nilai?.toString() || '',
        grade: nilai.grade || '',
        status: nilai.status,
        keterangan: nilai.keterangan || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/nilai/${nilai.uuid}`);
    };

    const handleNilaiChange = (value: string) => {
        const num = parseFloat(value);
        let grade = '';
        if (!isNaN(num)) {
            if (num >= 85) grade = 'A';
            else if (num >= 75) grade = 'B';
            else if (num >= 65) grade = 'C';
            else if (num >= 50) grade = 'D';
            else grade = 'E';
        }
        setData('nilai', value);
        setData('grade', grade);
    };

    return (
        <>
            <Head title="Edit Nilai" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/nilai">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Nilai</h1>
                        <p className="text-muted-foreground">Perbarui nilai mahasiswa</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Nilai</CardTitle>
                        <CardDescription>Perbarui data nilai mahasiswa</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>KRS (Pilih Mahasiswa & Kelas)</Label>
                                    <Select value={data.krs_id} onValueChange={(v) => setData('krs_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih KRS" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {krss.map((krs) => (
                                                <SelectItem key={krs.id} value={krs.id.toString()}>
                                                    {krs.mahasiswa?.nim} - {krs.mahasiswa?.nama} | {krs.kelas?.mata_kuliah?.nama_mk} ({krs.kelas?.kode_kelas})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.krs_id && <p className="text-sm text-red-500">{errors.krs_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nilai">Nilai (0-100)</Label>
                                    <Input
                                        id="nilai"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.nilai}
                                        onChange={(e) => handleNilaiChange(e.target.value)}
                                    />
                                    {errors.nilai && <p className="text-sm text-red-500">{errors.nilai}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Grade</Label>
                                    <Select value={data.grade} onValueChange={(v) => setData('grade', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">A</SelectItem>
                                            <SelectItem value="B">B</SelectItem>
                                            <SelectItem value="C">C</SelectItem>
                                            <SelectItem value="D">D</SelectItem>
                                            <SelectItem value="E">E</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.grade && <p className="text-sm text-red-500">{errors.grade}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="belum">Belum</SelectItem>
                                            <SelectItem value="tercatat">Tercatat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="keterangan">Keterangan</Label>
                                    <Input
                                        id="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        placeholder="Opsional"
                                    />
                                    {errors.keterangan && <p className="text-sm text-red-500">{errors.keterangan}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Perbarui'}
                                </Button>
                                <Link href="/admin/nilai">
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

NilaiEdit.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Data Nilai', href: '/admin/nilai' },
        { title: 'Edit', href: '#' },
    ]}>{page}</AppLayout>
);
