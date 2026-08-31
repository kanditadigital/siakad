import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';

function Required() {
    return <span className="text-destructive"> *</span>;
}

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
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Tambah Ruang
                        </h1>
                        <p className="text-muted-foreground">
                            Tambahkan data ruang baru
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Ruang</CardTitle>
                            <CardDescription>
                                Isi data ruang kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_ruang">
                                        Kode Ruang
                                        <Required />
                                    </Label>
                                    <Input
                                        id="kode_ruang"
                                        value={data.kode_ruang}
                                        onChange={(e) =>
                                            setData(
                                                'kode_ruang',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="R-001"
                                        aria-invalid={!!errors.kode_ruang}
                                    />
                                    {errors.kode_ruang && (
                                        <p className="text-sm text-destructive">
                                            {errors.kode_ruang}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_ruang">
                                        Nama Ruang
                                        <Required />
                                    </Label>
                                    <Input
                                        id="nama_ruang"
                                        value={data.nama_ruang}
                                        onChange={(e) =>
                                            setData(
                                                'nama_ruang',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ruang Kelas A"
                                        aria-invalid={!!errors.nama_ruang}
                                    />
                                    {errors.nama_ruang && (
                                        <p className="text-sm text-destructive">
                                            {errors.nama_ruang}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gedung">
                                        Gedung
                                        <Required />
                                    </Label>
                                    <Input
                                        id="gedung"
                                        value={data.gedung}
                                        onChange={(e) =>
                                            setData('gedung', e.target.value)
                                        }
                                        placeholder="Gedung A"
                                        aria-invalid={!!errors.gedung}
                                    />
                                    {errors.gedung && (
                                        <p className="text-sm text-destructive">
                                            {errors.gedung}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lantai">
                                        Lantai
                                        <Required />
                                    </Label>
                                    <Input
                                        id="lantai"
                                        value={data.lantai}
                                        onChange={(e) =>
                                            setData('lantai', e.target.value)
                                        }
                                        placeholder="1"
                                        aria-invalid={!!errors.lantai}
                                    />
                                    {errors.lantai && (
                                        <p className="text-sm text-destructive">
                                            {errors.lantai}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kapasitas">
                                        Kapasitas
                                        <Required />
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="kapasitas"
                                            type="number"
                                            min="1"
                                            max="500"
                                            value={data.kapasitas}
                                            onChange={(e) =>
                                                setData(
                                                    'kapasitas',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="40"
                                            aria-invalid={!!errors.kapasitas}
                                            className="pr-14"
                                        />
                                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                                            orang
                                        </span>
                                    </div>
                                    {errors.kapasitas && (
                                        <p className="text-sm text-destructive">
                                            {errors.kapasitas}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3">
                        <Link href="/admin/ruang">
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Ruang'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RuangCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Ruang', href: '/admin/ruang' },
            { title: 'Tambah', href: '/admin/ruang/create' },
        ]}
    >
        {page}
    </AppLayout>
);
