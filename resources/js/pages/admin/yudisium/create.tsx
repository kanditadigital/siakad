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

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
};

type Props = {
    mahasiswas: Mahasiswa[];
};

export default function YudisiumCreate({ mahasiswas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        mahasiswa_id: '',
        tanggal_yudisium: '',
        ipk: '',
        total_sks: '',
        judul_skripsi: '',
        status: 'lulus',
        predikat: '',
        keterangan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/yudisium');
    };

    return (
        <>
            <Head title="Tambah Yudisium" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/yudisium">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Tambah Yudisium
                        </h1>
                        <p className="text-muted-foreground">
                            Input data yudisium mahasiswa
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Tambah Yudisium</CardTitle>
                        <CardDescription>
                            Isi data yudisium mahasiswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Mahasiswa</Label>
                                    <Select
                                        value={data.mahasiswa_id}
                                        onValueChange={(v) =>
                                            setData('mahasiswa_id', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Mahasiswa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mahasiswas.map((m) => (
                                                <SelectItem
                                                    key={m.id}
                                                    value={m.id.toString()}
                                                >
                                                    {m.nim} - {m.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.mahasiswa_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.mahasiswa_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_yudisium">
                                        Tanggal Yudisium
                                    </Label>
                                    <Input
                                        id="tanggal_yudisium"
                                        type="date"
                                        value={data.tanggal_yudisium}
                                        onChange={(e) =>
                                            setData(
                                                'tanggal_yudisium',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.tanggal_yudisium && (
                                        <p className="text-sm text-red-500">
                                            {errors.tanggal_yudisium}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ipk">
                                        IPK (0.00 - 4.00)
                                    </Label>
                                    <Input
                                        id="ipk"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="4"
                                        value={data.ipk}
                                        onChange={(e) =>
                                            setData('ipk', e.target.value)
                                        }
                                        placeholder="3.75"
                                    />
                                    {errors.ipk && (
                                        <p className="text-sm text-red-500">
                                            {errors.ipk}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="total_sks">Total SKS</Label>
                                    <Input
                                        id="total_sks"
                                        type="number"
                                        min="1"
                                        value={data.total_sks}
                                        onChange={(e) =>
                                            setData('total_sks', e.target.value)
                                        }
                                        placeholder="144"
                                    />
                                    {errors.total_sks && (
                                        <p className="text-sm text-red-500">
                                            {errors.total_sks}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(v) =>
                                            setData('status', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lulus">
                                                Lulus
                                            </SelectItem>
                                            <SelectItem value="tidak lulus">
                                                Tidak Lulus
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="judul_skripsi">
                                        Judul Skripsi
                                    </Label>
                                    <Input
                                        id="judul_skripsi"
                                        value={data.judul_skripsi}
                                        onChange={(e) =>
                                            setData(
                                                'judul_skripsi',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Opsional"
                                    />
                                    {errors.judul_skripsi && (
                                        <p className="text-sm text-red-500">
                                            {errors.judul_skripsi}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Predikat</Label>
                                    <Select
                                        value={data.predikat}
                                        onValueChange={(v) =>
                                            setData('predikat', v)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Predikat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cum Laude">
                                                Cum Laude
                                            </SelectItem>
                                            <SelectItem value="Sangat Memuaskan">
                                                Sangat Memuaskan
                                            </SelectItem>
                                            <SelectItem value="Memuaskan">
                                                Memuaskan
                                            </SelectItem>
                                            <SelectItem value="Cukup">
                                                Cukup
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.predikat && (
                                        <p className="text-sm text-red-500">
                                            {errors.predikat}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
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
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                                <Link href="/admin/yudisium">
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

YudisiumCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Yudisium', href: '/admin/yudisium' },
            { title: 'Tambah', href: '/admin/yudisium/create' },
        ]}
    >
        {page}
    </AppLayout>
);
