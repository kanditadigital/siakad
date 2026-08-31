import { Head } from '@inertiajs/react';
import { User, Hash, GraduationCap, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

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

export default function ProfilMahasiswa({ mahasiswa }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            dateStyle: 'full',
        });
    };

    return (
        <>
            <Head title="Profil Mahasiswa" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                        Profil Mahasiswa
                    </h1>
                    <p className="text-gray-600">Data profil Anda</p>
                </div>

                {/* Header Card */}
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        {/* Photo Section */}
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[280px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-sm">
                                    <span className="text-4xl font-semibold text-siak-pine">
                                        {getInitials(mahasiswa.nama)}
                                    </span>
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">NIM</p>
                                    <p className="font-mono text-lg font-semibold">
                                        {mahasiswa.nim}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Biodata Section */}
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {mahasiswa.nama}
                                    </h2>
                                    <p className="text-gray-600">
                                        {mahasiswa.program_studi?.nama_prodi}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                {formatDate(
                                                    mahasiswa.tanggal_lahir,
                                                )}
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

                                    <div className="flex items-center gap-3 sm:col-span-2">
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

ProfilMahasiswa.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Profil', href: '/mahasiswa/profil' },
    ],
});
