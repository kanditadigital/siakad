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

function Required() {
    return <span className="text-destructive"> *</span>;
}

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
            <Head title={`Edit Ruang - ${ruang.nama_ruang}`} />

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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Ruang</CardTitle>
                            <CardDescription>
                                Perbarui data ruang kelas
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
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
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
