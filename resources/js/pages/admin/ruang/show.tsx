import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Building2, DoorOpen, Edit, Layers, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Ruang = {
    id: number;
    uuid: string;
    kode_ruang: string;
    nama_ruang: string;
    kapasitas: number;
    lantai: string;
    gedung: string;
};

export default function RuangShow({ ruang }: { ruang: Ruang }) {
    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus ruang ini?')) {
            router.delete(`/admin/ruang/${ruang.uuid}`);
        }
    };

    return (
        <>
            <Head title={`Ruang - ${ruang.nama_ruang}`} />

            <div className="space-y-6">
                <Link
                    href="/admin/ruang"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Ruang
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <DoorOpen className="h-12 w-12 text-siak-pine" />
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">
                                        Kode Ruang
                                    </p>
                                    <p className="font-mono text-lg font-semibold">
                                        {ruang.kode_ruang}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {ruang.nama_ruang}
                                    </h1>
                                    <p className="text-gray-600">
                                        {ruang.gedung} • Lantai {ruang.lantai}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Kapasitas {ruang.kapasitas} orang
                                </p>
                                <div className="flex gap-2">
                                    <Link href={`/admin/ruang/${ruang.uuid}/edit`}>
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

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                            <DoorOpen className="h-5 w-5 text-green-700" />
                            Informasi Ruang
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <DoorOpen className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Kode Ruang
                                </p>
                                <p className="font-mono font-medium text-gray-900">
                                    {ruang.kode_ruang}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <DoorOpen className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Nama Ruang
                                </p>
                                <p className="font-medium text-gray-900">
                                    {ruang.nama_ruang}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <Building2 className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Gedung
                                </p>
                                <p className="font-medium text-gray-900">
                                    {ruang.gedung}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <Layers className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Lantai
                                </p>
                                <p className="font-medium text-gray-900">
                                    Lantai {ruang.lantai}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <Users className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">
                                    Kapasitas
                                </p>
                                <p className="font-medium text-gray-900">
                                    {ruang.kapasitas} orang
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RuangShow.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Ruang', href: '/admin/ruang' },
        { title: 'Detail', href: '#' },
    ],
});
