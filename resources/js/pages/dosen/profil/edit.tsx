import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type Dosen = {
    id: number;
    nidn: string;
    nama: string;
    email: string;
    no_telepon: string | null;
    alamat: string | null;
};

export default function DosenProfilEdit({ dosen }: { dosen: Dosen }) {
    const { data, setData, put, processing, errors } = useForm({
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
                        <h1 className="text-2xl font-bold">Edit Profil Dosen</h1>
                        <p className="text-muted-foreground">Perbarui data kontak anda</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Profil Saya</CardTitle>
                        <CardDescription>
                            Hanya no. telepon dan alamat yang dapat diperbarui. Hubungi admin untuk perubahan data lainnya.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>NIDN</Label>
                                    <Input value={dosen.nidn} disabled />
                                </div>

                                <div className="space-y-2">
                                    <Label>Nama Lengkap</Label>
                                    <Input value={dosen.nama} disabled />
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={dosen.email} disabled />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="no_telepon">No. Telepon</Label>
                                    <Input
                                        id="no_telepon"
                                        value={data.no_telepon}
                                        onChange={(e) => setData('no_telepon', e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    {errors.no_telepon && <p className="text-sm text-red-500">{errors.no_telepon}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData('alamat', e.target.value)}
                                        placeholder="Alamat lengkap"
                                        rows={3}
                                    />
                                    {errors.alamat && <p className="text-sm text-red-500">{errors.alamat}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/dosen/profil">
                                    <Button type="button" variant="outline">Batal</Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DosenProfilEdit.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Profil Dosen', href: '/dosen/profil' },
        { title: 'Edit', href: '#' },
    ]}>{page}</AppLayout>
);
