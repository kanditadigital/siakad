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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

type UktScheme = {
    id: number;
    uuid: string;
    nama: string;
    jumlah: number;
    keterangan: string | null;
    aktif: boolean;
};

type Props = {
    uktScheme: UktScheme;
};

export default function UktSchemeEdit({ uktScheme }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nama: uktScheme.nama,
        jumlah: uktScheme.jumlah.toString(),
        keterangan: uktScheme.keterangan || '',
        aktif: uktScheme.aktif,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/ukt-scheme/${uktScheme.uuid}`);
    };

    return (
        <>
            <Head title="Edit Skema UKT" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/ukt-scheme">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Edit Skema UKT
                        </h1>
                        <p className="text-muted-foreground">
                            Perbarui data skema UKT {uktScheme.nama}
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Edit Skema UKT</CardTitle>
                        <CardDescription>
                            Perbarui data skema uang kuliah tunggal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Skema</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) =>
                                            setData('nama', e.target.value)
                                        }
                                    />
                                    {errors.nama && (
                                        <p className="text-sm text-red-500">
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jumlah">Jumlah (Rp)</Label>
                                    <Input
                                        id="jumlah"
                                        type="number"
                                        min="0"
                                        value={data.jumlah}
                                        onChange={(e) =>
                                            setData('jumlah', e.target.value)
                                        }
                                    />
                                    {errors.jumlah && (
                                        <p className="text-sm text-red-500">
                                            {errors.jumlah}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={data.aktif ? 'true' : 'false'}
                                        onValueChange={(v) =>
                                            setData('aktif', v === 'true')
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="false">
                                                Nonaktif
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.aktif && (
                                        <p className="text-sm text-red-500">
                                            {errors.aktif}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="keterangan">
                                        Keterangan
                                    </Label>
                                    <Input
                                        id="keterangan"
                                        value={data.keterangan}
                                        onChange={(e) =>
                                            setData(
                                                'keterangan',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Opsional"
                                    />
                                    {errors.keterangan && (
                                        <p className="text-sm text-red-500">
                                            {errors.keterangan}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Perbarui'}
                                </Button>
                                <Link href="/admin/ukt-scheme">
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

UktSchemeEdit.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Skema UKT', href: '/admin/ukt-scheme' },
            { title: 'Edit', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
