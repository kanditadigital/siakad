import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { User, Upload, X } from 'lucide-react';

type ProgramStudi = {
    id: number;
    nama_prodi: string;
};

type UserType = {
    id: number;
    name: string;
    email: string;
    role: string;
    photo: string | null;
    program_studi_id: number | null;
};

type Props = {
    user: UserType;
    programStudis: ProgramStudi[];
    adminProdiCounts: Record<number, number>;
};

export default function UserEdit({ user, programStudis, adminProdiCounts }: Props) {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);
    const [programStudiId, setProgramStudiId] = useState(user.program_studi_id ? String(user.program_studi_id) : '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        user.photo ? `/storage/${user.photo}` : null
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('role', role);
        formData.append('_method', 'PUT');
        if (password) {
            formData.append('password', password);
            formData.append('password_confirmation', passwordConfirmation);
        }
        if (programStudiId) {
            formData.append('program_studi_id', programStudiId);
        }
        if (photo) {
            formData.append('photo', photo);
        }

        router.post(`/admin/user/${user.id}`, formData, {
            onFinish: () => setProcessing(false),
            onError: (err) => setErrors(err),
        });
    };

    return (
        <>
            <Head title="Edit User" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-green-800">Edit User</h1>
                    <p className="text-gray-600">Ubah data akun pengguna</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Photo Upload */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-gray-900 flex items-center gap-2">
                                    <User className="h-5 w-5 text-green-700" />
                                    Foto Profil
                                </CardTitle>
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
                                            {photoPreview ? 'Ganti Foto' : 'Pilih Foto'}
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

                        {/* Form Fields */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Data User</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nama lengkap"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.name ? 'border-red-500' : ''}`}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@sitiddarurrahmah.ac.id"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-gray-700">Role</Label>
                                    <Select value={role} onValueChange={setRole}>
                                        <SelectTrigger className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.role ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Administrator</SelectItem>
                                            <SelectItem value="admin_prodi">Admin Program Studi</SelectItem>
                                            <SelectItem value="dosen">Dosen</SelectItem>
                                            <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                                            <SelectItem value="pimpinan">Pimpinan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                                </div>

                                {role === 'admin_prodi' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="program_studi_id" className="text-gray-700">Program Studi</Label>
                                        <Select value={programStudiId} onValueChange={setProgramStudiId}>
                                            <SelectTrigger className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.program_studi_id ? 'border-red-500' : ''}`}>
                                                <SelectValue placeholder="Pilih program studi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {programStudis.map((prodi) => (
                                                    <SelectItem
                                                        key={prodi.id}
                                                        value={String(prodi.id)}
                                                        disabled={!!adminProdiCounts[prodi.id]}
                                                    >
                                                        {prodi.nama_prodi}
                                                        {adminProdiCounts[prodi.id] ? ' (Sudah ada admin)' : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.program_studi_id && <p className="text-sm text-red-500">{errors.program_studi_id}</p>}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700">Password (Kosongkan jika tidak diubah)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        className={`border-gray-300 focus:border-green-500 focus:ring-green-500 ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-gray-700">Konfirmasi Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        placeholder="Ulangi password"
                                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Link href="/admin/user">
                            <Button variant="outline" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-green-700 hover:bg-green-800">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

UserEdit.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'User', href: '/admin/user' },
        { title: 'Edit', href: '#' },
    ],
});
