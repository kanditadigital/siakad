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
    semester_saat_ini: number;
    batas_semester_normal: number;
    user?: User;
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

function Required() {
    return <span className="text-destructive"> *</span>;
}

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
        semester_saat_ini: mahasiswa.semester_saat_ini.toString(),
        photo: null as File | null,
    });

    const existingPhoto = mahasiswa.user?.photo_url;
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
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit Mahasiswa
                        </h1>
                        <p className="text-muted-foreground">
                            Edit data mahasiswa {mahasiswa.nama}
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
                                Upload foto mahasiswa (opsional)
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

                    {/* Data Diri */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Diri</CardTitle>
                            <CardDescription>
                                Informasi pribadi mahasiswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>
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
                                    <Label>NIM</Label>
                                    <div className="flex h-9 w-full items-center rounded-md border bg-muted px-3 font-mono text-sm font-medium text-muted-foreground">
                                        {mahasiswa.nim}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        NIM tidak dapat diubah
                                    </p>
                                </div>

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
                                        placeholder="Ahmad Fauzi"
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

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_lahir">
                                        Tanggal Lahir
                                        <Required />
                                    </Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) =>
                                            setData(
                                                'tanggal_lahir',
                                                e.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.tanggal_lahir}
                                    />
                                    {errors.tanggal_lahir && (
                                        <p className="text-sm text-destructive">
                                            {errors.tanggal_lahir}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tempat_lahir">
                                        Tempat Lahir
                                        <Required />
                                    </Label>
                                    <Input
                                        id="tempat_lahir"
                                        value={data.tempat_lahir}
                                        onChange={(e) =>
                                            setData(
                                                'tempat_lahir',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Banda Aceh"
                                        aria-invalid={!!errors.tempat_lahir}
                                    />
                                    {errors.tempat_lahir && (
                                        <p className="text-sm text-destructive">
                                            {errors.tempat_lahir}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_ktp">No. KTP</Label>
                                    <Input
                                        id="no_ktp"
                                        value={data.no_ktp}
                                        onChange={(e) =>
                                            setData('no_ktp', e.target.value)
                                        }
                                        placeholder="Opsional"
                                        aria-invalid={!!errors.no_ktp}
                                    />
                                    {errors.no_ktp && (
                                        <p className="text-sm text-destructive">
                                            {errors.no_ktp}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat">
                                        Alamat
                                        <Required />
                                    </Label>
                                    <Input
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData('alamat', e.target.value)
                                        }
                                        placeholder="Jl. Merdeka No. 10"
                                        aria-invalid={!!errors.alamat}
                                    />
                                    {errors.alamat && (
                                        <p className="text-sm text-destructive">
                                            {errors.alamat}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kode_domisili">
                                        Kode Domisili
                                        <Required />
                                    </Label>
                                    <Input
                                        id="kode_domisili"
                                        value={data.kode_domisili}
                                        onChange={(e) =>
                                            setData(
                                                'kode_domisili',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="23001"
                                        aria-invalid={!!errors.kode_domisili}
                                    />
                                    {errors.kode_domisili && (
                                        <p className="text-sm text-destructive">
                                            {errors.kode_domisili}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Orang Tua */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Orang Tua</CardTitle>
                            <CardDescription>
                                Informasi kontak orang tua
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email_orang_tua">
                                        Email Orang Tua
                                    </Label>
                                    <Input
                                        id="email_orang_tua"
                                        type="email"
                                        value={data.email_orang_tua}
                                        onChange={(e) =>
                                            setData(
                                                'email_orang_tua',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Opsional"
                                        aria-invalid={
                                            !!errors.email_orang_tua
                                        }
                                    />
                                    {errors.email_orang_tua && (
                                        <p className="text-sm text-destructive">
                                            {errors.email_orang_tua}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_hp_orang_tua">
                                        No. HP Orang Tua
                                    </Label>
                                    <Input
                                        id="no_hp_orang_tua"
                                        value={data.no_hp_orang_tua}
                                        onChange={(e) =>
                                            setData(
                                                'no_hp_orang_tua',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Opsional"
                                        aria-invalid={
                                            !!errors.no_hp_orang_tua
                                        }
                                    />
                                    {errors.no_hp_orang_tua && (
                                        <p className="text-sm text-destructive">
                                            {errors.no_hp_orang_tua}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>
                                Status keaktifan mahasiswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
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
                            <div className="space-y-2">
                                <Label htmlFor="semester_saat_ini">
                                    Semester Saat Ini
                                    <Required />
                                </Label>
                                <Input
                                    id="semester_saat_ini"
                                    type="number"
                                    min={1}
                                    value={data.semester_saat_ini}
                                    onChange={(e) =>
                                        setData(
                                            'semester_saat_ini',
                                            e.target.value,
                                        )
                                    }
                                    aria-invalid={!!errors.semester_saat_ini}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Naik otomatis satu semester saat admin
                                    menjalankan "Naikkan Semester" per program
                                    studi. Masa studi normal program studi ini
                                    adalah {mahasiswa.batas_semester_normal}{' '}
                                    semester.
                                </p>
                                {errors.semester_saat_ini && (
                                    <p className="text-sm text-destructive">
                                        {errors.semester_saat_ini}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/mahasiswa">
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

MahasiswaEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Mahasiswa', href: '/admin/mahasiswa' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
