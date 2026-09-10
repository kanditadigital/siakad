import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Clock,
    Edit,
    GraduationCap,
    Hash,
    Mail,
    MapPin,
    Phone,
    Trash2,
    User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type Dosen = {
    id: number;
    uuid: string;
    nidn: string;
    nuptk: string;
    nama: string;
    email: string;
    no_telepon: string;
    jenis_kelamin: string;
    pangkat_golongan: string;
    pendidikan_terakhir: string;
    alamat: string;
    status: string;
    created_at: string;
    updated_at: string;
    program_studi: ProgramStudi;
    user?: UserPhoto;
};

type Props = {
    dosen: Dosen;
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const STATUS_VARIANTS: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    aktif: 'default',
    cuti: 'secondary',
    pensiun: 'outline',
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    pensiun: 'Pensiun',
};

export default function DosenShow({ dosen }: Props) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' });

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus dosen ini?')) {
            router.delete(`/admin-prodi/dosen/${dosen.uuid}`);
        }
    };

    return (
        <>
            <Head title={`Dosen - ${dosen.nama}`} />

            <div className="space-y-6">
                <Link
                    href="/admin-prodi/dosen"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Dosen
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden py-0 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[280px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                                    {dosen.user?.photo_url ? (
                                        <img
                                            src={dosen.user.photo_url}
                                            alt={dosen.nama}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-semibold text-siak-pine">
                                            {getInitials(dosen.nama)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIDN</p>
                                    <p className="font-mono text-lg font-semibold">
                                        {dosen.nidn}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {dosen.nama}
                                    </h1>
                                    <p className="text-gray-600">
                                        {dosen.program_studi?.nama_prodi}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            STATUS_VARIANTS[dosen.status] ||
                                            'outline'
                                        }
                                    >
                                        {STATUS_LABELS[dosen.status] ||
                                            dosen.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        • {dosen.jenis_kelamin}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin-prodi/dosen/${dosen.uuid}/edit`}
                                    >
                                        <Button className="bg-green-700 hover:bg-green-800">
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Hapus
                                    </Button>
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
                                        NIDN
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {dosen.nidn}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Hash className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        NUPTK
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {dosen.nuptk || '-'}
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
                                        {dosen.jenis_kelamin}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Award className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Pangkat / Golongan
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {dosen.pangkat_golongan || '-'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <GraduationCap className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Pendidikan Terakhir
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {dosen.pendidikan_terakhir || '-'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Kontak */}
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Phone className="h-5 w-5 text-green-700" />
                                    Kontak
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Mail className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Email
                                        </p>
                                        <p className="truncate font-medium text-gray-900">
                                            {dosen.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Phone className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            No. Telepon
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {dosen.no_telepon || '-'}
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
                                            {dosen.alamat || '-'}
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
                                        {formatDate(dosen.created_at)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Terakhir Diperbarui
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {formatDate(dosen.updated_at)}
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

DosenShow.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Admin Prodi', href: '/admin-prodi' },
            { title: 'Dosen', href: '/admin-prodi/dosen' },
            { title: 'Detail', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
