import { Head, useForm } from '@inertiajs/react';
import {
    Save,
    Building2,
    ClipboardList,
    FileText,
    Bell,
    Upload,
    X,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Settings = {
    identitas: {
        nama_kampus: string;
        alamat: string;
        website: string;
        logo: string | null;
    };
    krs: {
        sks_maks: number;
        sks_min: number;
        dibuka: boolean;
    };
    nilai: {
        bobot_tugas: number;
        bobot_uts: number;
        bobot_uas: number;
        bobot_partisipasi: number;
        bobot_kehadiran: number;
        periode_input_dibuka: boolean;
    };
    notifikasi: {
        email_aktif: boolean;
        tagihan_aktif: boolean;
    };
};

type Props = {
    settings: Settings;
};

export default function PengaturanIndex({ settings }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        identitas: { ...settings.identitas, logo: null as File | null },
        krs: settings.krs,
        nilai: settings.nilai,
        notifikasi: settings.notifikasi,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.identitas.logo ? `/storage/${settings.identitas.logo}` : null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const totalBobot =
        Number(data.nilai.bobot_tugas) +
        Number(data.nilai.bobot_uts) +
        Number(data.nilai.bobot_uas) +
        Number(data.nilai.bobot_partisipasi) +
        Number(data.nilai.bobot_kehadiran);

    const bobotValid = totalBobot === 100;

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('identitas', { ...data.identitas, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setData('identitas', { ...data.identitas, logo: null });
        setLogoPreview(null);

        if (fileInputRef.current) {
fileInputRef.current.value = '';
}
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/pengaturan', { forceFormData: true });
    };

    return (
        <>
            <Head title="Pengaturan Sistem" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Pengaturan Sistem
                    </h1>
                    <p className="text-gray-600">
                        Konfigurasi identitas kampus, KRS, penilaian, dan
                        notifikasi
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Identitas Kampus */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Building2 className="h-5 w-5 text-green-700" />
                                    Identitas Kampus
                                </CardTitle>
                                <CardDescription>
                                    Nama, alamat, situs, dan logo yang
                                    ditampilkan di seluruh sistem
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo"
                                            className="h-16 w-16 rounded-md border object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                                            Logo
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <Upload className="mr-2 h-3.5 w-3.5" />
                                            Unggah Logo
                                        </Button>
                                        {logoPreview && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={removeLogo}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                    />
                                </div>
                                {errors['identitas.logo'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['identitas.logo']}
                                    </p>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_kampus">
                                            Nama Kampus{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="nama_kampus"
                                            value={data.identitas.nama_kampus}
                                            onChange={(e) =>
                                                setData('identitas', {
                                                    ...data.identitas,
                                                    nama_kampus: e.target.value,
                                                })
                                            }
                                        />
                                        {errors['identitas.nama_kampus'] && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    errors[
                                                        'identitas.nama_kampus'
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">
                                            Website{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="website"
                                            value={data.identitas.website}
                                            onChange={(e) =>
                                                setData('identitas', {
                                                    ...data.identitas,
                                                    website: e.target.value,
                                                })
                                            }
                                        />
                                        {errors['identitas.website'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['identitas.website']}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alamat">
                                        Alamat{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="alamat"
                                        value={data.identitas.alamat}
                                        onChange={(e) =>
                                            setData('identitas', {
                                                ...data.identitas,
                                                alamat: e.target.value,
                                            })
                                        }
                                    />
                                    {errors['identitas.alamat'] && (
                                        <p className="text-sm text-destructive">
                                            {errors['identitas.alamat']}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pengaturan KRS */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <ClipboardList className="h-5 w-5 text-green-700" />
                                    Pengaturan KRS
                                </CardTitle>
                                <CardDescription>
                                    Batas SKS dan status periode pengajuan KRS
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="sks_min">
                                            Batas SKS Minimal
                                        </Label>
                                        <Input
                                            id="sks_min"
                                            type="number"
                                            min={0}
                                            value={data.krs.sks_min}
                                            onChange={(e) =>
                                                setData('krs', {
                                                    ...data.krs,
                                                    sks_min: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                        {errors['krs.sks_min'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['krs.sks_min']}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sks_maks">
                                            Batas SKS Maksimal
                                        </Label>
                                        <Input
                                            id="sks_maks"
                                            type="number"
                                            min={1}
                                            value={data.krs.sks_maks}
                                            onChange={(e) =>
                                                setData('krs', {
                                                    ...data.krs,
                                                    sks_maks: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                        />
                                        {errors['krs.sks_maks'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['krs.sks_maks']}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="krs_dibuka"
                                        checked={data.krs.dibuka}
                                        onCheckedChange={(checked) =>
                                            setData('krs', {
                                                ...data.krs,
                                                dibuka: checked === true,
                                            })
                                        }
                                    />
                                    <Label
                                        htmlFor="krs_dibuka"
                                        className="font-normal"
                                    >
                                        Periode pengajuan KRS dibuka
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pengaturan Nilai */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <FileText className="h-5 w-5 text-green-700" />
                                    Pengaturan Nilai
                                </CardTitle>
                                <CardDescription>
                                    Bobot komponen penilaian default — total
                                    harus 100%
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {(
                                        [
                                            ['bobot_tugas', 'Tugas'],
                                            ['bobot_uts', 'UTS'],
                                            ['bobot_uas', 'UAS'],
                                            [
                                                'bobot_partisipasi',
                                                'Partisipasi',
                                            ],
                                            ['bobot_kehadiran', 'Kehadiran'],
                                        ] as const
                                    ).map(([key, label]) => (
                                        <div key={key} className="space-y-2">
                                            <Label htmlFor={key}>
                                                {label} (%)
                                            </Label>
                                            <Input
                                                id={key}
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={data.nilai[key]}
                                                onChange={(e) =>
                                                    setData('nilai', {
                                                        ...data.nilai,
                                                        [key]: Number(
                                                            e.target.value,
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <p
                                    className={`text-sm font-medium ${bobotValid ? 'text-green-700' : 'text-destructive'}`}
                                >
                                    Total bobot: {totalBobot}%{' '}
                                    {bobotValid ? '' : '(harus 100%)'}
                                </p>
                                {errors['nilai.bobot_tugas'] && (
                                    <p className="text-sm text-destructive">
                                        {errors['nilai.bobot_tugas']}
                                    </p>
                                )}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="periode_input_dibuka"
                                        checked={
                                            data.nilai.periode_input_dibuka
                                        }
                                        onCheckedChange={(checked) =>
                                            setData('nilai', {
                                                ...data.nilai,
                                                periode_input_dibuka:
                                                    checked === true,
                                            })
                                        }
                                    />
                                    <Label
                                        htmlFor="periode_input_dibuka"
                                        className="font-normal"
                                    >
                                        Periode input nilai dibuka
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pengaturan Notifikasi */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Bell className="h-5 w-5 text-green-700" />
                                    Pengaturan Notifikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="email_aktif"
                                        checked={data.notifikasi.email_aktif}
                                        onCheckedChange={(checked) =>
                                            setData('notifikasi', {
                                                ...data.notifikasi,
                                                email_aktif: checked === true,
                                            })
                                        }
                                    />
                                    <Label
                                        htmlFor="email_aktif"
                                        className="font-normal"
                                    >
                                        Kirim notifikasi email
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="tagihan_aktif"
                                        checked={data.notifikasi.tagihan_aktif}
                                        onCheckedChange={(checked) =>
                                            setData('notifikasi', {
                                                ...data.notifikasi,
                                                tagihan_aktif: checked === true,
                                            })
                                        }
                                    />
                                    <Label
                                        htmlFor="tagihan_aktif"
                                        className="font-normal"
                                    >
                                        Kirim notifikasi tagihan/pembayaran
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-6">
                        <Button
                            type="submit"
                            disabled={processing || !bobotValid}
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

PengaturanIndex.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pengaturan Sistem', href: '/admin/pengaturan' },
    ],
});
