import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    User,
    GraduationCap,
    MapPin,
    Hash,
    Calendar,
    Clock,
    Phone,
    Mail,
    Trash2,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProgramStudi = {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
};

type User = {
    id: number;
    photo: string | null;
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
    created_at: string;
    updated_at: string;
    program_studi: ProgramStudi;
    user?: User;
};

type Props = {
    mahasiswa: Mahasiswa;
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
    nonaktif: 'destructive',
    lulus: 'outline',
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    nonaktif: 'Nonaktif',
    lulus: 'Lulus',
};

export default function MahasiswaShow({ mahasiswa }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            dateStyle: 'full',
        });
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus mahasiswa ini?')) {
            router.delete(`/admin/mahasiswa/${mahasiswa.uuid}`);
        }
    };

    return (
        <>
            <Head title={`Mahasiswa - ${mahasiswa.nama}`} />

            <div className="space-y-6">
                {/* Header Card */}
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-green-700 p-8 md:min-h-[280px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/20">
                                    {mahasiswa.user?.photo ? (
                                        <img
                                            src={`/storage/${mahasiswa.user.photo}`}
                                            alt={mahasiswa.nama}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl font-bold text-white">
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
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={
                                            STATUS_VARIANTS[mahasiswa.status] ||
                                            'outline'
                                        }
                                    >
                                        {STATUS_LABELS[mahasiswa.status] ||
                                            mahasiswa.status}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        • {mahasiswa.jenis_kelamin}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/mahasiswa/${mahasiswa.uuid}/edit`}
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
                                    <p className="text-xs text-gray-500">NIM</p>
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
                                            {mahasiswa.email_orang_tua || '-'}
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
                                            {mahasiswa.no_hp_orang_tua || '-'}
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

MahasiswaShow.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mahasiswa', href: '/admin/mahasiswa' },
        { title: 'Detail', href: '#' },
    ],
});
