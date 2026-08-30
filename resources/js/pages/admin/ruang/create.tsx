import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function RuangCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kode_ruang: '',
        nama_ruang: '',
        kapasitas: '',
        lantai: '',
        gedung: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/ruang');
    };

    return (
        <>
            <Head title="Tambah Ruang" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/ruang">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Tambah Ruang</h1>
                        <p className="text-muted-foreground">Tambahkan data ruang baru</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Ruang</CardTitle>
                        <CardDescription>Isi data ruang kelas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_ruang">Kode Ruang</Label>
                                    <Input
                                        id="kode_ruang"
                                        value={data.kode_ruang}
                                        onChange={(e) => setData('kode_ruang', e.target.value)}
                                        placeholder="R-001"
                                    />
                                    {errors.kode_ruang && <p className="text-sm text-red-500">{errors.kode_ruang}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_ruang">Nama Ruang</Label>
                                    <Input
                                        id="nama_ruang"
                                        value={data.nama_ruang}
                                        onChange={(e) => setData('nama_ruang', e.target.value)}
                                        placeholder="Ruang Kelas A"
                                    />
                                    {errors.nama_ruang && <p className="text-sm text-red-500">{errors.nama_ruang}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kapasitas">Kapasitas</Label>
                                    <Input
                                        id="kapasitas"
                                        type="number"
                                        min="1"
                                        value={data.kapasitas}
                                        onChange={(e) => setData('kapasitas', e.target.value)}
                                        placeholder="40"
                                    />
                                    {errors.kapasitas && <p className="text-sm text-red-500">{errors.kapasitas}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lantai">Lantai</Label>
                                    <Input
                                        id="lantai"
                                        value={data.lantai}
                                        onChange={(e) => setData('lantai', e.target.value)}
                                        placeholder="1"
                                    />
                                    {errors.lantai && <p className="text-sm text-red-500">{errors.lantai}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gedung">Gedung</Label>
                                    <Input
                                        id="gedung"
                                        value={data.gedung}
                                        onChange={(e) => setData('gedung', e.target.value)}
                                        placeholder="Gedung A"
                                    />
                                    {errors.gedung && <p className="text-sm text-red-500">{errors.gedung}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/admin/ruang">
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

RuangCreate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Ruang', href: '/admin/ruang' },
        { title: 'Tambah', href: '/admin/ruang/create' },
    ]}>{page}</AppLayout>
);
