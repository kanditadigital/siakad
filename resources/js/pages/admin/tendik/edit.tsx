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

type Tendik = {
    id: number;
    uuid: string;
    nip: string;
    nama: string;
    email: string;
    no_telepon: string;
    jenis_kelamin: string;
    jabatan: string;
    unit_kerja: string;
    pendidikan_terakhir: string;
    alamat: string;
    status: string;
};

type Props = {
    tendik: Tendik;
};

const JENIS_KELAMIN_OPTIONS = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
];

const JABATAN_OPTIONS = [
    'Staf Administrasi',
    'Staf Keuangan',
    'Staf Akademik',
    'Operator Komputer',
    'Pustakawan',
    'Teknisi',
    'Cleaning Service',
    'Satpam',
];

const UNIT_KERJA_OPTIONS = [
    'BAAK',
    'Keuangan',
    'Perpustakaan',
    'TU',
    'Humas',
    'IT',
    'Umum',
    'Sarana Prasarana',
];

const PENDIDIKAN_OPTIONS = ['SMA', 'SMK', 'D3', 'S1', 'S2'];

const STATUS_OPTIONS = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'cuti', label: 'Cuti' },
    { value: 'pensiun', label: 'Pensiun' },
];

export default function TendikEdit({ tendik }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nip: tendik.nip,
        nama: tendik.nama,
        email: tendik.email,
        no_telepon: tendik.no_telepon,
        jenis_kelamin: tendik.jenis_kelamin,
        jabatan: tendik.jabatan,
        unit_kerja: tendik.unit_kerja,
        pendidikan_terakhir: tendik.pendidikan_terakhir,
        alamat: tendik.alamat,
        status: tendik.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/tendik/${tendik.uuid}`);
    };

    return (
        <>
            <Head title={`Edit Tendik - ${tendik.nama}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tendik">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Tendik</h1>
                        <p className="text-muted-foreground">
                            Edit data tendik {tendik.nama}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pribadi</CardTitle>
                            <CardDescription>Informasi identitas dan kontak</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP</Label>
                                    <Input
                                        id="nip"
                                        value={data.nip}
                                        onChange={(e) => setData('nip', e.target.value)}
                                        placeholder="198501012010011001"
                                        className={errors.nip ? 'border-red-500' : ''}
                                    />
                                    {errors.nip && (
                                        <p className="text-sm text-red-500">{errors.nip}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Siti Aminah"
                                        className={errors.nama ? 'border-red-500' : ''}
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
                                        placeholder="siti@stit-daras.ac.id"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_telepon">No. Telepon</Label>
                                    <Input
                                        id="no_telepon"
                                        value={data.no_telepon}
                                        onChange={(e) => setData('no_telepon', e.target.value)}
                                        placeholder="081234567890"
                                        className={errors.no_telepon ? 'border-red-500' : ''}
                                    />
                                    {errors.no_telepon && (
                                        <p className="text-sm text-red-500">{errors.no_telepon}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                    <Select
                                        value={data.jenis_kelamin}
                                        onValueChange={(value) => setData('jenis_kelamin', value)}
                                    >
                                        <SelectTrigger className={errors.jenis_kelamin ? 'border-red-500' : ''}>
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
                                    <Label htmlFor="jabatan">Jabatan</Label>
                                    <Select
                                        value={data.jabatan}
                                        onValueChange={(value) => setData('jabatan', value)}
                                    >
                                        <SelectTrigger className={errors.jabatan ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Jabatan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JABATAN_OPTIONS.map((jabatan) => (
                                                <SelectItem key={jabatan} value={jabatan}>
                                                    {jabatan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jabatan && (
                                        <p className="text-sm text-red-500">{errors.jabatan}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Kepegawaian</CardTitle>
                            <CardDescription>Informasi unit kerja dan pendidikan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="unit_kerja">Unit Kerja</Label>
                                    <Select
                                        value={data.unit_kerja}
                                        onValueChange={(value) => setData('unit_kerja', value)}
                                    >
                                        <SelectTrigger className={errors.unit_kerja ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Pilih Unit Kerja" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {UNIT_KERJA_OPTIONS.map((unit) => (
                                                <SelectItem key={unit} value={unit}>
                                                    {unit}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.unit_kerja && (
                                        <p className="text-sm text-red-500">{errors.unit_kerja}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pendidikan_terakhir">Pendidikan Terakhir</Label>
                                    <Select
                                        value={data.pendidikan_terakhir}
                                        onValueChange={(value) => setData('pendidikan_terakhir', value)}
                                    >
                                        <SelectTrigger className={errors.pendidikan_terakhir ? 'border-red-500' : ''}>
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

                                <div className="space-y-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Input
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        placeholder="Jl. Merdeka No. 10"
                                        className={errors.alamat ? 'border-red-500' : ''}
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
                                        <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
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
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Link href="/admin/tendik">
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

TendikEdit.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Tendik', href: '/admin/tendik' },
        { title: 'Edit', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
