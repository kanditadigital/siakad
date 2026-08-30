import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowLeft,
    Edit,
    User,
    GraduationCap,
    MapPin,
    Hash,
    Calendar,
    Clock,
    Phone,
    Mail,
    Users,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

type ProgramStudi = {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
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

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
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
        return new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' });
    };

    return (
        <>
            <Head title={`Mahasiswa - ${mahasiswa.nama}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href="/admin/mahasiswa"
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="text-2xl font-bold">Profil Mahasiswa</h1>
                        <p className="text-muted-foreground">Detail data mahasiswa</p>
                    </div>
                    <Link href={`/admin/mahasiswa/${mahasiswa.uuid}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                {/* Card 1: Photo & Biodata Singkat */}
                <Card className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Photo Section */}
                        <div className="flex items-center justify-center bg-gradient-to-br from-siak-pine to-siak-pine-deep p-8 md:w-64 md:min-h-[280px]">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-xl">
                                    <span className="text-4xl font-bold text-white">
                                        {getInitials(mahasiswa.nama)}
                                    </span>
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIM</p>
                                    <p className="font-mono text-lg font-semibold">{mahasiswa.nim}</p>
                                </div>
                            </div>
                        </div>

                        {/* Biodata Section */}
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">{mahasiswa.nama}</h2>
                                    <p className="text-muted-foreground">{mahasiswa.program_studi?.nama_prodi}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Hash className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">NIM</p>
                                            <p className="font-mono font-medium">{mahasiswa.nim}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Jenis Kelamin</p>
                                            <p className="font-medium">{mahasiswa.jenis_kelamin}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Tempat, Tanggal Lahir</p>
                                            <p className="font-medium">{mahasiswa.tempat_lahir}, {formatDate(mahasiswa.tanggal_lahir)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Hash className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">No. KTP</p>
                                            <p className="font-mono font-medium">{mahasiswa.no_ktp || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 sm:col-span-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Alamat</p>
                                            <p className="font-medium">{mahasiswa.alamat}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Kode Domisili</p>
                                            <p className="font-medium">{mahasiswa.kode_domisili}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant={STATUS_VARIANTS[mahasiswa.status] || 'outline'}>
                                        {STATUS_LABELS[mahasiswa.status] || mahasiswa.status}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        • {mahasiswa.program_studi?.nama_prodi}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Card 2: Data Orang Tua */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Data Orang Tua</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Email Orang Tua</p>
                                    <p className="font-medium">{mahasiswa.email_orang_tua || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">No. HP Orang Tua</p>
                                    <p className="font-medium">{mahasiswa.no_hp_orang_tua || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Informasi Sistem */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Informasi Sistem</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Dibuat Pada</p>
                                    <p className="font-medium">{formatDate(mahasiswa.created_at)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Terakhir Diperbarui</p>
                                    <p className="font-medium">{formatDate(mahasiswa.updated_at)}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MahasiswaShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mahasiswa', href: '/admin/mahasiswa' },
        { title: 'Detail', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
