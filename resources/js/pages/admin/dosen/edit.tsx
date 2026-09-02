import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, User, X } from 'lucide-react';
import { useRef, useState } from 'react';
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

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type User = {
    id: number;
    photo: string | null;
    photo_url: string | null;
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
    user?: User;
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

function Required() {
    return <span className="text-destructive"> *</span>;
}

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
        photo: null as File | null,
    });

    const existingPhoto = dosen.user?.photo_url;
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        existingPhoto ?? null,
    );
    const [removeExistingPhoto, setRemoveExistingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('photo', file);
            setRemoveExistingPhoto(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setData('photo', null);
        setPhotoPreview(null);
        setRemoveExistingPhoto(true);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit Dosen
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data dosen {dosen.nama}
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    {/* Photo Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Foto Profil</CardTitle>
                            <CardDescription>
                                Upload foto dosen (opsional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    {photoPreview ? (
                                        <div className="relative">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="h-32 w-32 rounded-full border-4 border-green-200 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={removePhoto}
                                                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white hover:bg-destructive/90"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-green-200 bg-green-50">
                                            <User className="h-16 w-16 text-green-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {existingPhoto && !removeExistingPhoto
                                            ? 'Ganti Foto'
                                            : 'Pilih Foto'}
                                    </Button>
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        JPG, JPEG, atau PNG. Maks 2MB.
                                    </p>
                                    {errors.photo && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Identitas Diri */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Identitas Diri</CardTitle>
                            <CardDescription>
                                Data pribadi dan identitas dosen
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nidn">
                                        NIDN
                                        <Required />
                                    </Label>
                                    <Input
                                        id="nidn"
                                        value={data.nidn}
                                        onChange={(e) =>
                                            setData('nidn', e.target.value)
                                        }
                                        placeholder="0012345678"
                                        aria-invalid={!!errors.nidn}
                                    />
                                    {errors.nidn && (
                                        <p className="text-sm text-destructive">
                                            {errors.nidn}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nuptk">
                                        NUPTK
                                        <Required />
                                    </Label>
                                    <Input
                                        id="nuptk"
                                        value={data.nuptk}
                                        onChange={(e) =>
                                            setData('nuptk', e.target.value)
                                        }
                                        placeholder="1234567890123456"
                                        aria-invalid={!!errors.nuptk}
                                    />
                                    {errors.nuptk && (
                                        <p className="text-sm text-destructive">
                                            {errors.nuptk}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
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
                                        placeholder="Dr. Ahmad Fauzi, M.Pd"
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
                                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JENIS_KELAMIN_OPTIONS.map((jk) => (
                                                <SelectItem
                                                    key={jk.value}
                                                    value={jk.value}
                                                >
                                                    {jk.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis_kelamin && (
                                        <p className="text-sm text-destructive">
                                            {errors.jenis_kelamin}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kontak & Kepegawaian */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontak & Kepegawaian</CardTitle>
                            <CardDescription>
                                Informasi kontak dan status kepegawaian
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email
                                        <Required />
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="ahmad@stit-daras.ac.id"
                                        aria-invalid={!!errors.email}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
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
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="program_studi_id">
                                        Program Studi
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.program_studi_id}
                                        onValueChange={(value) =>
                                            setData('program_studi_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="program_studi_id"
                                            aria-invalid={
                                                !!errors.program_studi_id
                                            }
                                        >
                                            <SelectValue placeholder="Pilih Program Studi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {programStudis.map((prodi) => (
                                                <SelectItem
                                                    key={prodi.id}
                                                    value={prodi.id.toString()}
                                                >
                                                    {prodi.nama_prodi}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.program_studi_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.program_studi_id}
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
                                        onValueChange={(value) =>
                                            setData('status', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="status"
                                            aria-invalid={!!errors.status}
                                        >
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUS_OPTIONS.map((status) => (
                                                <SelectItem
                                                    key={status.value}
                                                    value={status.value}
                                                >
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="pangkat_golongan">
                                        Pangkat / Golongan
                                        <Required />
                                    </Label>
                                    <Select
                                        value={data.pangkat_golongan}
                                        onValueChange={(value) =>
                                            setData('pangkat_golongan', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="pangkat_golongan"
                                            aria-invalid={
                                                !!errors.pangkat_golongan
                                            }
                                        >
                                            <SelectValue placeholder="Pilih Pangkat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PANGKAT_OPTIONS.map((pangkat) => (
                                                <SelectItem
                                                    key={pangkat}
                                                    value={pangkat}
                                                >
                                                    {pangkat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pangkat_golongan && (
                                        <p className="text-sm text-destructive">
                                            {errors.pangkat_golongan}
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
                                            <SelectValue placeholder="Pilih Pendidikan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PENDIDIKAN_OPTIONS.map(
                                                (pendidikan) => (
                                                    <SelectItem
                                                        key={pendidikan}
                                                        value={pendidikan}
                                                    >
                                                        {pendidikan}
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

                            <div className="space-y-2">
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
                                    placeholder="Jl. Merdeka No. 10"
                                    rows={3}
                                    aria-invalid={!!errors.alamat}
                                />
                                {errors.alamat && (
                                    <p className="text-sm text-destructive">
                                        {errors.alamat}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/dosen">
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

DosenEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Dosen', href: '/admin/dosen' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
