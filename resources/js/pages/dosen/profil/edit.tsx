import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Lock, Phone, User } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

function Required() {
    return <span className="text-destructive"> *</span>;
}

type ProgramStudi = {
    nama_prodi: string;
};

type Dosen = {
    id: number;
    nidn: string;
    nuptk: string;
    nama: string;
    email: string;
    jenis_kelamin: string;
    pendidikan_terakhir: string;
    pangkat_golongan: string;
    no_telepon: string | null;
    alamat: string | null;
    status: string;
    program_studi: ProgramStudi;
};

const JENIS_KELAMIN_OPTIONS = [
    { value: 'Laki-laki', label: 'Laki-laki' },
    { value: 'Perempuan', label: 'Perempuan' },
];

const PENDIDIKAN_OPTIONS = ['S2', 'S3'];

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    pensiun: 'Pensiun',
};

export default function DosenProfilEdit({ dosen }: { dosen: Dosen }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: dosen.nama,
        jenis_kelamin: dosen.jenis_kelamin,
        pendidikan_terakhir: dosen.pendidikan_terakhir,
        no_telepon: dosen.no_telepon || '',
        alamat: dosen.alamat || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dosen/profil');
    };

    return (
        <>
            <Head title="Edit Profil Dosen" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dosen/profil">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit Profil
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data diri Anda
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                Data Kepegawaian
                            </CardTitle>
                            <CardDescription>
                                Dikelola oleh admin — hubungi admin untuk
                                perubahan NIDN, NUPTK, email, program studi,
                                status, atau pangkat/golongan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label>NIDN</Label>
                                    <Input
                                        value={dosen.nidn}
                                        disabled
                                        className="font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>NUPTK</Label>
                                    <Input
                                        value={dosen.nuptk}
                                        disabled
                                        className="font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={dosen.email} disabled />
                                </div>

                                <div className="space-y-2">
                                    <Label>Program Studi</Label>
                                    <Input
                                        value={
                                            dosen.program_studi?.nama_prodi ||
                                            '-'
                                        }
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Pangkat / Golongan</Label>
                                    <Input
                                        value={dosen.pangkat_golongan}
                                        disabled
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Status Kepegawaian</Label>
                                    <Input
                                        value={
                                            STATUS_LABELS[dosen.status] ||
                                            dosen.status
                                        }
                                        disabled
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                Data Pribadi
                            </CardTitle>
                            <CardDescription>
                                Data diri yang dapat Anda perbarui sendiri.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="nama">
                                        Nama Lengkap
                                        <Required />
                                    </Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) =>
                                            setData('nama', e.target.value)
                                        }
                                        aria-invalid={!!errors.nama}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin">
                                        Jenis Kelamin
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.jenis_kelamin}
                                        onValueChange={(value) =>
                                            setData('jenis_kelamin', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="jenis_kelamin"
                                            aria-invalid={
                                                !!errors.jenis_kelamin
                                            }
                                        >
                                            <SelectValue placeholder="Pilih jenis kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JENIS_KELAMIN_OPTIONS.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_kelamin && (
                                        <p className="text-sm text-destructive">
                                            {errors.jenis_kelamin}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pendidikan_terakhir">
                                        Pendidikan Terakhir
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.pendidikan_terakhir}
                                        onValueChange={(value) =>
                                            setData(
                                                'pendidikan_terakhir',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="pendidikan_terakhir"
                                            aria-invalid={
                                                !!errors.pendidikan_terakhir
                                            }
                                        >
                                            <SelectValue placeholder="Pilih pendidikan terakhir" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PENDIDIKAN_OPTIONS.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.pendidikan_terakhir && (
                                        <p className="text-sm text-destructive">
                                            {errors.pendidikan_terakhir}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                Informasi Kontak
                            </CardTitle>
                            <CardDescription>
                                Nomor telepon dan alamat yang dapat Anda
                                perbarui sendiri.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="no_telepon">
                                        No. Telepon
                                        <Required />
                                    </Label>
                                    <Input
                                        id="no_telepon"
                                        value={data.no_telepon}
                                        onChange={(e) =>
                                            setData(
                                                'no_telepon',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="081234567890"
                                        aria-invalid={!!errors.no_telepon}
                                    />
                                    {errors.no_telepon && (
                                        <p className="text-sm text-destructive">
                                            {errors.no_telepon}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="alamat">
                                        Alamat
                                        <Required />
                                    </Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData('alamat', e.target.value)
                                        }
                                        placeholder="Alamat lengkap"
                                        rows={3}
                                        aria-invalid={!!errors.alamat}
                                    />
                                    {errors.alamat && (
                                        <p className="text-sm text-destructive">
                                            {errors.alamat}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/dosen/profil">
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

DosenProfilEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Profil Dosen', href: '/dosen/profil' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
