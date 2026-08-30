import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type Dosen = {
    id: number;
    uuid: string;
    nidn: string;
    nuptk: string;
    nama: string;
    email: string;
    program_studi_id: number;
    no_telepon: string;
    jenis_kelamin: string;
    pangkat_golongan: string;
    pendidikan_terakhir: string;
    alamat: string;
    status: string;
};

type Props = {
    dosen: Dosen;
    programStudis: ProgramStudi[];
};

const JENIS_KELAMIN_OPTIONS = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
];

const PANGKAT_OPTIONS = [
    'Penata Muda III/a',
    'Penata Muda Tk.I III/b',
    'Penata III/c',
    'Pembina IV/a',
    'Pembina Tk.I IV/b',
    'Pembina Utama IV/c',
];

const PENDIDIKAN_OPTIONS = ['S2', 'S3'];

const STATUS_OPTIONS = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'cuti', label: 'Cuti' },
    { value: 'pensiun', label: 'Pensiun' },
];

export default function DosenEdit({ dosen, programStudis }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nidn: dosen.nidn,
        nuptk: dosen.nuptk,
        nama: dosen.nama,
        email: dosen.email,
        program_studi_id: dosen.program_studi_id.toString(),
        no_telepon: dosen.no_telepon,
        jenis_kelamin: dosen.jenis_kelamin,
        pangkat_golongan: dosen.pangkat_golongan,
        pendidikan_terakhir: dosen.pendidikan_terakhir,
        alamat: dosen.alamat,
        status: dosen.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/dosen/${dosen.uuid}`);
    };

    return (
        <>
            <Head title={`Edit Dosen - ${dosen.nama}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dosen">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Dosen</h1>
                        <p className="text-muted-foreground">Perbarui data dosen {dosen.nama}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Identitas Diri */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Identitas Diri</CardTitle>
                            <CardDescription>Data pribadi dan identitas dosen</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nidn">NIDN</Label>
                                    <Input
                                        id="nidn"
                                        value={data.nidn}
                                        onChange={(e) => setData('nidn', e.target.value)}
                                        placeholder="0012345678"
                                    />
                                    {errors.nidn && <p className="text-sm text-red-500">{errors.nidn}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nuptk">NUPTK</Label>
                                    <Input
                                        id="nuptk"
                                        value={data.nuptk}
                                        onChange={(e) => setData('nuptk', e.target.value)}
                                        placeholder="1234567890123456"
                                    />
                                    {errors.nuptk && <p className="text-sm text-red-500">{errors.nuptk}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Dr. Ahmad Fauzi, M.Pd"
                                    />
                                    {errors.nama && <p className="text-sm text-red-500">{errors.nama}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <Select
                                        value={data.jenis_kelamin}
                                        onValueChange={(value) => setData('jenis_kelamin', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JENIS_KELAMIN_OPTIONS.map((jk) => (
                                                <SelectItem key={jk.value} value={jk.value}>
                                                    {jk.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_kelamin && <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak & Kepegawaian */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak & Kepegawaian</CardTitle>
                            <CardDescription>Informasi kontak dan status kepegawaian</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="ahmad@stit-daras.ac.id"
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_telepon">No. Telepon</Label>
                                    <Input
                                        id="no_telepon"
                                        value={data.no_telepon}
                                        onChange={(e) => setData('no_telepon', e.target.value)}
                                        placeholder="081234567890"
                                    />
                                    {errors.no_telepon && <p className="text-sm text-red-500">{errors.no_telepon}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="program_studi_id">Program Studi</Label>
                                    <Select
                                        value={data.program_studi_id}
                                        onValueChange={(value) => setData('program_studi_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Program Studi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programStudis.map((prodi) => (
                                                <SelectItem key={prodi.id} value={prodi.id.toString()}>
                                                    {prodi.nama_prodi}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.program_studi_id && <p className="text-sm text-red-500">{errors.program_studi_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pangkat_golongan">Pangkat / Golongan</Label>
                                    <Select
                                        value={data.pangkat_golongan}
                                        onValueChange={(value) => setData('pangkat_golongan', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Pangkat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PANGKAT_OPTIONS.map((pangkat) => (
                                                <SelectItem key={pangkat} value={pangkat}>
                                                    {pangkat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pangkat_golongan && <p className="text-sm text-red-500">{errors.pangkat_golongan}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pendidikan_terakhir">Pendidikan Terakhir</Label>
                                    <Select
                                        value={data.pendidikan_terakhir}
                                        onValueChange={(value) => setData('pendidikan_terakhir', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Pendidikan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PENDIDIKAN_OPTIONS.map((pendidikan) => (
                                                <SelectItem key={pendidikan} value={pendidikan}>
                                                    {pendidikan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pendidikan_terakhir && <p className="text-sm text-red-500">{errors.pendidikan_terakhir}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Textarea
                                    id="alamat"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    placeholder="Jl. Merdeka No. 10"
                                    rows={3}
                                />
                                {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                        <Link href="/admin/dosen">
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

DosenEdit.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Dosen', href: '/admin/dosen' },
        { title: 'Edit', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
