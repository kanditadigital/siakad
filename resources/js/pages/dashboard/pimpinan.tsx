import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, UserCheck, BookMarked, ClipboardList, Receipt, DollarSign } from 'lucide-react';

type Props = {
    stats?: {
        mahasiswa_aktif: number;
        total_dosen: number;
        total_kelas: number;
        krs_pending: number;
        tagihan_belum_lunas: number;
        total_tunggakan: number;
        persentase_lunas: number;
    };
};

export default function PimpinanDashboard({ stats }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    if (!stats) {
        return (
            <>
                <Head title="Dashboard Pimpinan" />
                <p className="text-gray-600">Memuat data...</p>
            </>
        );
    }

    return (
        <>
            <Head title="Dashboard Pimpinan" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">Dashboard Pimpinan</h1>
                    <p className="text-gray-600">Ringkasan kondisi akademik dan keuangan kampus saat ini</p>
                </div>

                <div>
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                        Ringkasan Akademik
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Mahasiswa Aktif</CardTitle>
                                <div className="rounded-lg bg-green-600 p-2">
                                    <GraduationCap className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.mahasiswa_aktif}</div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Dosen</CardTitle>
                                <div className="rounded-lg bg-green-700 p-2">
                                    <UserCheck className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.total_dosen}</div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Kelas</CardTitle>
                                <div className="rounded-lg bg-green-800 p-2">
                                    <BookMarked className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.total_kelas}</div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">KRS Pending</CardTitle>
                                <div className="rounded-lg bg-amber-500 p-2">
                                    <ClipboardList className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.krs_pending}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                        Ringkasan Keuangan
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="border border-l-4 border-gray-200 border-l-red-500 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Tagihan Belum Lunas</CardTitle>
                                <div className="rounded-lg bg-red-500 p-2">
                                    <Receipt className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.tagihan_belum_lunas}</div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Total Tunggakan</CardTitle>
                                <div className="rounded-lg bg-green-700 p-2">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.total_tunggakan)}</div>
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">% Tagihan Lunas</CardTitle>
                                <div className="rounded-lg bg-green-600 p-2">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tabular-nums text-gray-900">{stats.persentase_lunas}%</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

PimpinanDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
