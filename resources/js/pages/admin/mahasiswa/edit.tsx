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

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type Mahasiswa = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    program_studi_id: number;
    no_ktp: string | null;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    email_orang_tua: string | null;
    no_hp_orang_tua: string | null;
    alamat: string;
    kode_domisili: string;
    status: string;
};

type Props = {
    mahasiswa: Mahasiswa;
    programStudis: ProgramStudi[];
};

const STATUS_OPTIONS = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'cuti', label: 'Cuti' },
    { value: 'nonaktif', label: 'Nonaktif' },
    { value: 'lulus', label: 'Lulus' },
];

const JENIS_KELAMIN_OPTIONS = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
];

export default function MahasiswaEdit({ mahasiswa, programStudis }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama: mahasiswa.nama,
        program_studi_id: mahasiswa.program_studi_id.toString(),
        no_ktp: mahasiswa.no_ktp || '',
        tempat_lahir: mahasiswa.tempat_lahir,
        tanggal_lahir: mahasiswa.tanggal_lahir,
        jenis_kelamin: mahasiswa.jenis_kelamin,
        email_orang_tua: mahasiswa.email_orang_tua || '',
        no_hp_orang_tua: mahasiswa.no_hp_orang_tua || '',
        alamat: mahasiswa.alamat,
        kode_domisili: mahasiswa.kode_domisili,
        status: mahasiswa.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/mahasiswa/${mahasiswa.uuid}`);
    };

    return (
        <>
            <Head title={`Edit Mahasiswa - ${mahasiswa.nama}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/mahasiswa">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Mahasiswa</h1>
                        <p className="text-muted-foreground">
                            Edit data mahasiswa {mahasiswa.nama}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Data Diri */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Diri</CardTitle>
                            <CardDescription>Informasi pribadi mahasiswa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Program Studi</Label>
                                    <Select
                                        value={data.program_studi_id}
                                        onValueChange={(value) => setData('program_studi_id', value)}
                                    >
                                        <SelectTrigger className={errors.program_studi_id ? 'border-red-500' : ''}>
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
                                <div className="space-y-2">
                                    <Label>NIM</Label>
                                    <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono font-medium">
                                        {mahasiswa.nim}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        NIM tidak dapat diubah
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Ahmad Fauzi"
                                        className={errors.nama ? 'border-red-500' : ''}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-500">{errors.nama}</p>
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
                                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                        className={errors.tanggal_lahir ? 'border-red-500' : ''}
                                    />
                                    {errors.tanggal_lahir && (
                                        <p className="text-sm text-red-500">{errors.tanggal_lahir}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tempat_lahir">Tempat Lahir</Label>
                                    <Input
                                        id="tempat_lahir"
                                        value={data.tempat_lahir}
                                        onChange={(e) => setData('tempat_lahir', e.target.value)}
                                        placeholder="Banda Aceh"
                                        className={errors.tempat_lahir ? 'border-red-500' : ''}
                                    />
                                    {errors.tempat_lahir && (
                                        <p className="text-sm text-red-500">{errors.tempat_lahir}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_ktp">No. KTP</Label>
                                    <Input
                                        id="no_ktp"
                                        value={data.no_ktp}
                                        onChange={(e) => setData('no_ktp', e.target.value)}
                                        placeholder="Opsional"
                                        className={errors.no_ktp ? 'border-red-500' : ''}
                                    />
                                    {errors.no_ktp && (
                                        <p className="text-sm text-red-500">{errors.no_ktp}</p>
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
                                    <Label htmlFor="kode_domisili">Kode Domisili</Label>
                                    <Input
                                        id="kode_domisili"
                                        value={data.kode_domisili}
                                        onChange={(e) => setData('kode_domisili', e.target.value)}
                                        placeholder="23001"
                                        className={errors.kode_domisili ? 'border-red-500' : ''}
                                    />
                                    {errors.kode_domisili && (
                                        <p className="text-sm text-red-500">{errors.kode_domisili}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Orang Tua */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Orang Tua</CardTitle>
                            <CardDescription>Informasi kontak orang tua</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email_orang_tua">Email Orang Tua</Label>
                                    <Input
                                        id="email_orang_tua"
                                        type="email"
                                        value={data.email_orang_tua}
                                        onChange={(e) => setData('email_orang_tua', e.target.value)}
                                        placeholder="Opsional"
                                        className={errors.email_orang_tua ? 'border-red-500' : ''}
                                    />
                                    {errors.email_orang_tua && (
                                        <p className="text-sm text-red-500">{errors.email_orang_tua}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_hp_orang_tua">No. HP Orang Tua</Label>
                                    <Input
                                        id="no_hp_orang_tua"
                                        value={data.no_hp_orang_tua}
                                        onChange={(e) => setData('no_hp_orang_tua', e.target.value)}
                                        placeholder="Opsional"
                                        className={errors.no_hp_orang_tua ? 'border-red-500' : ''}
                                    />
                                    {errors.no_hp_orang_tua && (
                                        <p className="text-sm text-red-500">{errors.no_hp_orang_tua}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>Status keaktifan mahasiswa</CardDescription>
                        </CardHeader>
                        <CardContent>
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
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Link href="/admin/mahasiswa">
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

MahasiswaEdit.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mahasiswa', href: '/admin/mahasiswa' },
        { title: 'Edit', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
