import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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
    adminProdiCounts: Record<number, number>;
};

export default function UserCreate({ programStudis, adminProdiCounts }: Props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [programStudiId, setProgramStudiId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/admin/user', {
            name,
            email,
            role,
            program_studi_id: programStudiId || null,
            password,
            password_confirmation: passwordConfirmation,
        }, {
            onFinish: () => setProcessing(false),
            onError: (err) => setErrors(err),
        });
    };

    return (
        <>
            <Head title="Tambah User" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/user">
                        <Button variant="ghost" size="icon">
                            ←
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Tambah User</h1>
                        <p className="text-muted-foreground">Buat akun pengguna baru</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="border rounded-lg p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama lengkap"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@sitiddarurrahmah.ac.id"
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
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
                                    <Label htmlFor="program_studi_id">Program Studi</Label>
                                    <Select value={programStudiId} onValueChange={setProgramStudiId}>
                                        <SelectTrigger className={errors.program_studi_id ? 'border-red-500' : ''}>
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
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className={errors.password ? 'border-red-500' : ''}
                                />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    placeholder="Ulangi password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <Link href="/admin/user">
                            <Button variant="outline" type="button">Batal</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

UserCreate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'User', href: '/admin/user' },
        { title: 'Tambah', href: '/admin/user/create' },
    ]}>
        {page}
    </AppLayout>
);
