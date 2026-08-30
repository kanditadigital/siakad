import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, TrendingUp } from 'lucide-react';

interface ProgramStudi {
    id: number;
    nama_prodi: string;
    kode_prodi: string;
}

interface Props {
    stats: {
        mahasiswa: number;
        dosen: number;
        penjadwalan: number;
    };
    programStudi: ProgramStudi;
}

export default function AdminProdiDashboard({ stats, programStudi }: Props) {
    return (
        <>
            <Head title="Dashboard Admin Prodi" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                        Dashboard Admin Prodi
                    </h1>
                    <p className="text-siak-sage">
                        Ringkasan data program studi {programStudi.nama_prodi}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total Mahasiswa
                            </CardTitle>
                            <GraduationCap className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {stats.mahasiswa}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-siak-sage">
                                <TrendingUp className="h-3 w-3" />
                                <span>Mahasiswa aktif</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total Dosen
                            </CardTitle>
                            <Users className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {stats.dosen}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-siak-sage">
                                <TrendingUp className="h-3 w-3" />
                                <span>Dosen aktif</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-siak-moss/60">
                        <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-siak-sage">
                                Total Penjadwalan
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-siak-sage/60" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                {stats.penjadwalan}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-siak-sage">
                                <TrendingUp className="h-3 w-3" />
                                <span>Jadwal aktif</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-siak-moss/60">
                    <CardHeader>
                        <CardTitle className="text-siak-pine">Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-siak-sage">
                            Belum ada aktivitas terbaru untuk ditampilkan.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminProdiDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
