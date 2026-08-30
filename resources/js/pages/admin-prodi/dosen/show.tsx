import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    User,
    GraduationCap,
    Award,
    Hash,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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
    pensiun: 'outline',
};

const STATUS_LABELS: Record<string, string> = {
    aktif: 'Aktif',
    cuti: 'Cuti',
    pensiun: 'Pensiun',
};

export default function DosenShow({ dosen }: { dosen: Dosen }) {
    return (
        <>
            <Head title={`Dosen - ${dosen.nama}`} />

            <div className="space-y-6">
                <div>
                    <Link
                        href="/admin-prodi/dosen"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Kembali ke Daftar
                    </Link>
                    <h1 className="text-2xl font-bold">Profil Dosen</h1>
                    <p className="text-muted-foreground">Detail data dosen</p>
                </div>

                <Card className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-gradient-to-br from-siak-pine to-siak-pine-deep p-8 md:w-64 md:min-h-[280px]">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-xl">
                                    <span className="text-4xl font-bold text-white">
                                        {getInitials(dosen.nama)}
                                    </span>
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIDN</p>
                                    <p className="font-mono text-lg font-semibold">{dosen.nidn}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">{dosen.nama}</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Hash className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">NUPTK</p>
                                            <p className="font-mono font-medium">{dosen.nuptk || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <User className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Jenis Kelamin</p>
                                            <p className="font-medium">{dosen.jenis_kelamin}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Award className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Pangkat / Golongan</p>
                                            <p className="font-medium">{dosen.pangkat_golongan || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Pendidikan Terakhir</p>
                                            <p className="font-medium">{dosen.pendidikan_terakhir || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Mail className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <p className="font-medium truncate">{dosen.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Phone className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">No. Telepon</p>
                                            <p className="font-medium">{dosen.no_telepon || '-'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 sm:col-span-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Alamat</p>
                                            <p className="font-medium">{dosen.alamat || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant={STATUS_VARIANTS[dosen.status] || 'outline'}>
                                        {STATUS_LABELS[dosen.status] || dosen.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}

DosenShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin Prodi', href: '/admin-prodi' },
        { title: 'Dosen', href: '/admin-prodi/dosen' },
        { title: 'Detail', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
