import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Hash,
    GraduationCap,
    MapPin,
    Calendar,
    Mail,
    Phone,
} from 'lucide-react';

type ProgramStudi = {
    id: number;
    kode_prodi: string;
    nama_prodi: string;
};

type Mahasiswa = {
    id: number;
    nim: string;
    nama: string;
    no_ktp: string | null;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    alamat: string;
    kode_domisili: string;
    status: string;
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

export default function ProfilMahasiswa({ mahasiswa }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', { dateStyle: 'full' });
    };

    return (
        <>
            <Head title="Profil Mahasiswa" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                        Profil Mahasiswa
                    </h1>
                    <p className="text-siak-sage">Data profil Anda</p>
                </div>

                {/* Card: Photo & Biodata */}
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
                                            <MapPin className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Kode Domisili</p>
                                            <p className="font-medium">{mahasiswa.kode_domisili}</p>
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
            </div>
        </>
    );
}

ProfilMahasiswa.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Profil', href: '/mahasiswa/profil' },
    ],
});
