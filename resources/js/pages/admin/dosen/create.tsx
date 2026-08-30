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
import AppLayout from '@/layouts/app-layout';

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type Props = {
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

export default function DosenCreate({ programStudis }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nidn: '',
        nuptk: '',
        nama: '',
        email: '',
        program_studi_id: '',
        no_telepon: '',
        jenis_kelamin: '',
        pangkat_golongan: '',
        pendidikan_terakhir: '',
        alamat: '',
        status: 'aktif',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/dosen');
    };

    return (
        <>
            <Head title="Tambah Dosen" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Tambah Dosen</h1>
                    <p className="text-muted-foreground">
                        Isi form berikut untuk menambahkan dosen baru
                    </p>
                </div>

                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nidn">NIDN</Label>
                                <Input
                                    id="nidn"
                                    value={data.nidn}
                                    onChange={(e) => setData('nidn', e.target.value)}
                                    placeholder="Contoh: 0012345678"
                                />
                                {errors.nidn && (
                                    <p className="text-sm text-red-500">{errors.nidn}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nuptk">NUPTK</Label>
                                <Input
                                    id="nuptk"
                                    value={data.nuptk}
                                    onChange={(e) => setData('nuptk', e.target.value)}
                                    placeholder="Contoh: 1234567890123456"
                                />
                                {errors.nuptk && (
                                    <p className="text-sm text-red-500">{errors.nuptk}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                {errors.program_studi_id && (
                                    <p className="text-sm text-red-500">{errors.program_studi_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Lengkap</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Contoh: Dr. Ahmad Fauzi, M.Pd"
                                />
                                {errors.nama && (
                                    <p className="text-sm text-red-500">{errors.nama}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Contoh: ahmad@stit-daras.ac.id"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                {errors.jenis_kelamin && (
                                    <p className="text-sm text-red-500">{errors.jenis_kelamin}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="no_telepon">No. Telepon</Label>
                                <Input
                                    id="no_telepon"
                                    value={data.no_telepon}
                                    onChange={(e) => setData('no_telepon', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                />
                                {errors.no_telepon && (
                                    <p className="text-sm text-red-500">{errors.no_telepon}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                {errors.pangkat_golongan && (
                                    <p className="text-sm text-red-500">{errors.pangkat_golongan}</p>
                                )}
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
                                {errors.pendidikan_terakhir && (
                                    <p className="text-sm text-red-500">{errors.pendidikan_terakhir}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input
                                id="alamat"
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                placeholder="Contoh: Jl. Merdeka No. 10"
                            />
                            {errors.alamat && (
                                <p className="text-sm text-red-500">{errors.alamat}</p>
                            )}
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
                            {errors.status && (
                                <p className="text-sm text-red-500">{errors.status}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                            <Link href="/admin/dosen">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

DosenCreate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Dosen', href: '/admin/dosen' },
        { title: 'Tambah', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
