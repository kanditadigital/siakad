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

type Ruang = {
    id: number;
    uuid: string;
    kode_ruang: string;
    nama_ruang: string;
    kapasitas: number;
    lantai: string;
    gedung: string;
};

type Props = {
    ruang: Ruang;
};

export default function RuangEdit({ ruang }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        kode_ruang: ruang.kode_ruang,
        nama_ruang: ruang.nama_ruang,
        kapasitas: ruang.kapasitas.toString(),
        lantai: ruang.lantai,
        gedung: ruang.gedung,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/ruang/${ruang.uuid}`);
    };

    return (
        <>
            <Head title="Edit Ruang" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/ruang">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit Ruang
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data ruang {ruang.nama_ruang}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Ruang</CardTitle>
                        <CardDescription>
                            Perbarui data ruang kelas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="kode_ruang">
                                        Kode Ruang
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
                                    />
                                    {errors.kode_ruang && (
                                        <p className="text-sm text-red-500">
                                            {errors.kode_ruang}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nama_ruang">
                                        Nama Ruang
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
                                    />
                                    {errors.nama_ruang && (
                                        <p className="text-sm text-red-500">
                                            {errors.nama_ruang}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kapasitas">Kapasitas</Label>
                                    <Input
                                        id="kapasitas"
                                        type="number"
                                        min="1"
                                        value={data.kapasitas}
                                        onChange={(e) =>
                                            setData('kapasitas', e.target.value)
                                        }
                                    />
                                    {errors.kapasitas && (
                                        <p className="text-sm text-red-500">
                                            {errors.kapasitas}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lantai">Lantai</Label>
                                    <Input
                                        id="lantai"
                                        value={data.lantai}
                                        onChange={(e) =>
                                            setData('lantai', e.target.value)
                                        }
                                    />
                                    {errors.lantai && (
                                        <p className="text-sm text-red-500">
                                            {errors.lantai}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gedung">Gedung</Label>
                                    <Input
                                        id="gedung"
                                        value={data.gedung}
                                        onChange={(e) =>
                                            setData('gedung', e.target.value)
                                        }
                                    />
                                    {errors.gedung && (
                                        <p className="text-sm text-red-500">
                                            {errors.gedung}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Perbarui'}
                                </Button>
                                <Link href="/admin/ruang">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RuangEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Ruang', href: '/admin/ruang' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
