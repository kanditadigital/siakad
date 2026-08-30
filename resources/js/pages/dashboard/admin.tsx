import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ClipboardList, Receipt, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        {
            title: 'Total Mahasiswa Aktif',
            value: '1.247',
            change: '+12%',
            changeType: 'positive' as const,
            icon: GraduationCap,
        },
        {
            title: 'KRS Belum Divalidasi',
            value: '89',
            change: 'Perlu ditindak',
            changeType: 'neutral' as const,
            icon: ClipboardList,
        },
        {
            title: 'Tagihan UKT Belum Lunas',
            value: '156',
            change: '-8%',
            changeType: 'negative' as const,
            icon: Receipt,
        },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                        Dashboard Admin
                    </h1>
                    <p className="text-siak-sage">
                        Ringkasan data akademik institusi
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="relative overflow-hidden border-siak-moss/60">
                            <div className="absolute top-0 left-0 h-full w-1 bg-siak-pine" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-siak-sage">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-siak-sage/60" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight text-siak-pine dark:text-siak-fern">
                                    {stat.value}
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-xs text-siak-sage">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{stat.change}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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

AdminDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
