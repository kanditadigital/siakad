import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';
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
import { ArrowLeft, User, Upload, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type User = {
    id: number;
    photo: string | null;
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
        photo: null as File | null,
    });

    const existingPhoto = mahasiswa.user?.photo;
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        existingPhoto ? `/storage/${existingPhoto}` : null
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
                <div>
                    <h1 className="text-2xl font-bold text-green-800">Edit Mahasiswa</h1>
                    <p className="text-gray-600">Edit data mahasiswa {mahasiswa.nama}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    {/* Photo Upload */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900 flex items-center gap-2">
                                <User className="h-5 w-5 text-green-700" />
                                Foto Profil
                            </CardTitle>
                            <CardDescription>Upload foto mahasiswa (opsional)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    {photoPreview ? (
                                        <div className="relative">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="h-32 w-32 rounded-full object-cover border-4 border-green-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removePhoto}
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-32 w-32 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200">
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
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        {existingPhoto && !removeExistingPhoto ? 'Ganti Foto' : 'Pilih Foto'}
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        JPG, JPEG, atau PNG. Maks 2MB.
                                    </p>
                                    {errors.photo && (
                                        <p className="text-sm text-red-500 mt-1">{errors.photo}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Diri */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Data Diri</CardTitle>
                            <CardDescription>Informasi pribadi mahasiswa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Program Studi</Label>
                                    <Select
                                        value={data.program_studi_id}
                                        onValueChange={(value) => setData('program_studi_id', value)}
                                    >
                                        <SelectTrigger className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.program_studi_id ? 'border-red-500' : ''}`}>
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
                                    <Label className="text-gray-700">NIM</Label>
                                    <div className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono font-medium text-gray-900">
                                        {mahasiswa.nim}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        NIM tidak dapat diubah
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama" className="text-gray-700">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Ahmad Fauzi"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.nama ? 'border-red-500' : ''}`}
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-500">{errors.nama}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jenis_kelamin" className="text-gray-700">Jenis Kelamin</Label>
                                    <Select
                                        value={data.jenis_kelamin}
                                        onValueChange={(value) => setData('jenis_kelamin', value)}
                                    >
                                        <SelectTrigger className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.jenis_kelamin ? 'border-red-500' : ''}`}>
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
                                    <Label htmlFor="tanggal_lahir" className="text-gray-700">Tanggal Lahir</Label>
                                    <Input
                                        id="tanggal_lahir"
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.tanggal_lahir ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tanggal_lahir && (
                                        <p className="text-sm text-red-500">{errors.tanggal_lahir}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tempat_lahir" className="text-gray-700">Tempat Lahir</Label>
                                    <Input
                                        id="tempat_lahir"
                                        value={data.tempat_lahir}
                                        onChange={(e) => setData('tempat_lahir', e.target.value)}
                                        placeholder="Banda Aceh"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.tempat_lahir ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tempat_lahir && (
                                        <p className="text-sm text-red-500">{errors.tempat_lahir}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_ktp" className="text-gray-700">No. KTP</Label>
                                    <Input
                                        id="no_ktp"
                                        value={data.no_ktp}
                                        onChange={(e) => setData('no_ktp', e.target.value)}
                                        placeholder="Opsional"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.no_ktp ? 'border-red-500' : ''}`}
                                    />
                                    {errors.no_ktp && (
                                        <p className="text-sm text-red-500">{errors.no_ktp}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat" className="text-gray-700">Alamat</Label>
                                    <Input
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        placeholder="Jl. Merdeka No. 10"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.alamat ? 'border-red-500' : ''}`}
                                    />
                                    {errors.alamat && (
                                        <p className="text-sm text-red-500">{errors.alamat}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kode_domisili" className="text-gray-700">Kode Domisili</Label>
                                    <Input
                                        id="kode_domisili"
                                        value={data.kode_domisili}
                                        onChange={(e) => setData('kode_domisili', e.target.value)}
                                        placeholder="23001"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.kode_domisili ? 'border-red-500' : ''}`}
                                    />
                                    {errors.kode_domisili && (
                                        <p className="text-sm text-red-500">{errors.kode_domisili}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Orang Tua */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Data Orang Tua</CardTitle>
                            <CardDescription>Informasi kontak orang tua</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email_orang_tua" className="text-gray-700">Email Orang Tua</Label>
                                    <Input
                                        id="email_orang_tua"
                                        type="email"
                                        value={data.email_orang_tua}
                                        onChange={(e) => setData('email_orang_tua', e.target.value)}
                                        placeholder="Opsional"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.email_orang_tua ? 'border-red-500' : ''}`}
                                    />
                                    {errors.email_orang_tua && (
                                        <p className="text-sm text-red-500">{errors.email_orang_tua}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_hp_orang_tua" className="text-gray-700">No. HP Orang Tua</Label>
                                    <Input
                                        id="no_hp_orang_tua"
                                        value={data.no_hp_orang_tua}
                                        onChange={(e) => setData('no_hp_orang_tua', e.target.value)}
                                        placeholder="Opsional"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.no_hp_orang_tua ? 'border-red-500' : ''}`}
                                    />
                                    {errors.no_hp_orang_tua && (
                                        <p className="text-sm text-red-500">{errors.no_hp_orang_tua}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Status</CardTitle>
                            <CardDescription>Status keaktifan mahasiswa</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-gray-700">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.status ? 'border-red-500' : ''}`}>
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
                        <Button type="submit" disabled={processing} className="bg-green-700 hover:bg-green-800">
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

MahasiswaEdit.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mahasiswa', href: '/admin/mahasiswa' },
        { title: 'Edit', href: '#' },
    ],
});
