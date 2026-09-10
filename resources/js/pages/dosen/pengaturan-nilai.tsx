import { Head, useForm } from '@inertiajs/react';
import { FileText, Save } from 'lucide-react';
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

type Bobot = {
    bobot_tugas: number;
    bobot_uts: number;
    bobot_uas: number;
    bobot_partisipasi: number;
    bobot_kehadiran: number;
};

const KOMPONEN = [
    ['bobot_tugas', 'Tugas'],
    ['bobot_uts', 'UTS'],
    ['bobot_uas', 'UAS'],
    ['bobot_partisipasi', 'Partisipasi'],
    ['bobot_kehadiran', 'Kehadiran'],
] as const;

export default function DosenPengaturanNilai({ bobot }: { bobot: Bobot }) {
    const { data, setData, put, processing, errors } = useForm(bobot);

    const total =
        Number(data.bobot_tugas) +
        Number(data.bobot_uts) +
        Number(data.bobot_uas) +
        Number(data.bobot_partisipasi) +
        Number(data.bobot_kehadiran);

    const totalValid = total === 100;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dosen/pengaturan-nilai');
    };

    return (
        <>
            <Head title="Pengaturan Nilai" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Pengaturan Nilai
                    </h1>
                    <p className="text-muted-foreground">
                        Bobot komponen penilaian yang berlaku untuk semua
                        kelas yang Anda ampu
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                Bobot Komponen Penilaian
                            </CardTitle>
                            <CardDescription>
                                Total bobot harus 100%
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                {KOMPONEN.map(([key, label]) => (
                                    <div key={key} className="space-y-2">
                                        <Label htmlFor={key}>
                                            {label} (%)
                                        </Label>
                                        <Input
                                            id={key}
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={data[key]}
                                            onChange={(e) =>
                                                setData(
                                                    key,
                                                    Number(e.target.value),
                                                )
                                            }
                                            aria-invalid={!!errors[key]}
                                        />
                                    </div>
                                ))}
                            </div>
                            <p
                                className={`text-sm font-medium ${totalValid ? 'text-green-700' : 'text-destructive'}`}
                            >
                                Total bobot: {total}%{' '}
                                {totalValid ? '' : '(harus 100%)'}
                            </p>
                            {errors.bobot_tugas && (
                                <p className="text-sm text-destructive">
                                    {errors.bobot_tugas}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing || !totalValid}
                            className="bg-green-700 hover:bg-green-800"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

DosenPengaturanNilai.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Pengaturan Nilai', href: '/dosen/pengaturan-nilai' },
        ]}
    >
        {page}
    </AppLayout>
);
