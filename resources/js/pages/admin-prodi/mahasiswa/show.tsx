import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    GraduationCap,
    Hash,
    Mail,
    MapPin,
    Phone,
    User,
    UserCheck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    kode_prodi: string;
    nama_prodi: string;
};

type UserPhoto = {
    id: number;
    photo: string | null;
    photo_url: string | null;
};

type DosenOption = {
    id: number;
    nama: string;
    nidn: string;
};

type Mahasiswa = {
    id: number;
    uuid: string;
    nim: string;
    nama: string;
    no_ktp: string | null;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    email_orang_tua: string | null;
    no_hp_orang_tua: string | null;
    alamat: string;
    kode_domisili: string;
    status: string;
    semester_saat_ini: number;
    batas_semester_normal: number;
    created_at: string;
    updated_at: string;
    program_studi: ProgramStudi;
    user?: UserPhoto;
    pa_dosen: DosenOption | null;
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    nonaktif: 'Nonaktif',
    lulus: 'Lulus',
};

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    aktif: 'default',
    cuti: 'secondary',
    nonaktif: 'destructive',
    lulus: 'outline',
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function MahasiswaShow({
    mahasiswa,
    dosens,
}: {
    mahasiswa: Mahasiswa;
    dosens: DosenOption[];
}) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' });

    const [paDosenId, setPaDosenId] = useState(
        mahasiswa.pa_dosen?.id.toString() || '',
    );
    const [savingPa, setSavingPa] = useState(false);

    const handleSavePa = () => {
        setSavingPa(true);
        router.patch(
            `/admin-prodi/mahasiswa/${mahasiswa.uuid}/dosen-pa`,
            { pa_dosen_id: paDosenId || null },
            { preserveScroll: true, onFinish: () => setSavingPa(false) },
        );
    };

    return (
        <>
            <Head title={`Mahasiswa - ${mahasiswa.nama}`} />

            <div className="space-y-6">
                <Link
                    href="/admin-prodi/mahasiswa"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Mahasiswa
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden py-0 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[240px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                                    {mahasiswa.user?.photo_url ? (
                                        <img
                                            src={mahasiswa.user.photo_url}
                                            alt={mahasiswa.nama}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-semibold text-siak-pine">
                                            {getInitials(mahasiswa.nama)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIM</p>
                                    <p className="font-mono text-lg font-semibold">
                                        {mahasiswa.nim}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {mahasiswa.nama}
                                    </h1>
                                    <p className="text-gray-600">
                                        {mahasiswa.program_studi?.nama_prodi}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                        variant={
                                            STATUS_VARIANTS[
                                                mahasiswa.status
                                            ] || 'outline'
                                        }
                                    >
                                        {STATUS_LABELS[mahasiswa.status] ||
                                            mahasiswa.status}
                                    </Badge>
                                    <Badge variant="outline">
                                        Semester{' '}
                                        {mahasiswa.semester_saat_ini}
                                    </Badge>
                                    {mahasiswa.semester_saat_ini >
                                        mahasiswa.batas_semester_normal && (
                                        <Badge
                                            variant="outline"
                                            className="border-amber-300 bg-amber-50 text-amber-700"
                                        >
                                            Melebihi Masa Studi Normal
                                        </Badge>
                                    )}
                                    <span className="text-sm text-gray-500">
                                        • {mahasiswa.jenis_kelamin}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Biodata */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <User className="h-5 w-5 text-green-700" />
                                Biodata Diri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Hash className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        NIM
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {mahasiswa.nim}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <User className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Jenis Kelamin
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {mahasiswa.jenis_kelamin}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <GraduationCap className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Tempat, Tanggal Lahir
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {mahasiswa.tempat_lahir},{' '}
                                        {formatDate(mahasiswa.tanggal_lahir)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Hash className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        No. KTP
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {mahasiswa.no_ktp || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <MapPin className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Alamat
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {mahasiswa.alamat}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <MapPin className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Kode Domisili
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {mahasiswa.kode_domisili}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Dosen Pembimbing Akademik */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <UserCheck className="h-5 w-5 text-green-700" />
                                    Dosen Pembimbing Akademik (PA)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Select
                                        value={paDosenId}
                                        onValueChange={setPaDosenId}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Belum ada Dosen PA" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dosens.map((d) => (
                                                <SelectItem
                                                    key={d.id}
                                                    value={d.id.toString()}
                                                >
                                                    {d.nama} ({d.nidn})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        size="sm"
                                        disabled={
                                            savingPa ||
                                            paDosenId ===
                                                (mahasiswa.pa_dosen?.id.toString() ||
                                                    '')
                                        }
                                        onClick={handleSavePa}
                                    >
                                        {savingPa ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Data Orang Tua */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Users className="h-5 w-5 text-green-700" />
                                    Data Orang Tua
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Mail className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Email Orang Tua
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {mahasiswa.email_orang_tua ||
                                                '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Phone className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            No. HP Orang Tua
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {mahasiswa.no_hp_orang_tua ||
                                                '-'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informasi Sistem */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Clock className="h-5 w-5 text-green-700" />
                                    Informasi Sistem
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Dibuat Pada
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {formatDate(mahasiswa.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Terakhir Diperbarui
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {formatDate(mahasiswa.updated_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

MahasiswaShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Mahasiswa', href: '/admin-prodi/mahasiswa' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
