import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    School,
    BookOpen,
    Hash,
    Clock,
    Calendar,
    Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProgramStudi = {
    id: number;
    uuid: string;
    kode_prodi: string;
    nama_prodi: string;
    fakultas: string;
    lama_studi: number;
    jenis_prodi: string;
    nim_prefix: string;
    nim_counter: number;
    nim_digit_count: number;
    nim_year_digits: number;
    created_at: string;
    updated_at: string;
};

type Props = {
    programStudi: ProgramStudi;
};

export default function ProgramStudiShow({ programStudi }: Props) {
    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus program studi ini?')) {
            router.delete(`/admin/program-studi/${programStudi.uuid}`);
        }
    };

    return (
        <>
            <Head title={`Program Studi - ${programStudi.nama_prodi}`} />

            <div className="space-y-6">
                <Link
                    href="/admin/program-studi"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Kembali ke Daftar Program Studi
                </Link>

                {/* Header Card */}
                <Card className="overflow-hidden py-0 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row">
                        <div className="flex items-center justify-center bg-siak-pine p-8 md:min-h-[200px] md:w-64">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                                    <School className="h-12 w-12 text-siak-pine" />
                                </div>
                                <div className="text-center text-white">
                                    <p className="text-sm opacity-80">
                                        Kode Prodi
                                    </p>
                                    <p className="font-mono text-lg font-semibold">
                                        {programStudi.kode_prodi}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 md:p-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                                        {programStudi.nama_prodi}
                                    </h1>
                                    <p className="text-gray-600">
                                        {programStudi.fakultas}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="border-green-200 text-green-700"
                                    >
                                        {programStudi.jenis_prodi}
                                    </Badge>
                                    <span className="text-sm text-gray-500">
                                        • {programStudi.lama_studi} Tahun
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/program-studi/${programStudi.uuid}/edit`}
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
                    {/* Info Utama */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <School className="h-5 w-5 text-green-700" />
                                Informasi Program Studi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Hash className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Kode Program Studi
                                    </p>
                                    <p className="font-mono font-medium text-gray-900">
                                        {programStudi.kode_prodi}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <School className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Nama Program Studi
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {programStudi.nama_prodi}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <BookOpen className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Fakultas
                                    </p>
                                    <p className="text-gray-900">
                                        {programStudi.fakultas}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <School className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Jenjang
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="border-green-200 text-green-700"
                                    >
                                        {programStudi.jenis_prodi}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                    <Clock className="h-5 w-5 text-green-700" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Lama Studi
                                    </p>
                                    <p className="text-gray-900">
                                        {programStudi.lama_studi} Tahun
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Konfigurasi NIM */}
                    <div className="space-y-6">
                        <Card className="border border-gray-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900">
                                    <Hash className="h-5 w-5 text-green-700" />
                                    Konfigurasi NIM
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Hash className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Prefix NIM
                                        </p>
                                        <p className="font-mono text-lg font-medium text-gray-900">
                                            {programStudi.nim_prefix}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Calendar className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Digit Tahun Masuk
                                        </p>
                                        <p className="text-gray-900">
                                            {programStudi.nim_year_digits} digit
                                            (
                                            {programStudi.nim_year_digits === 2
                                                ? '26'
                                                : '026'}
                                            )
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <Hash className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Digit Counter
                                        </p>
                                        <p className="text-gray-900">
                                            {programStudi.nim_digit_count} digit
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                        <School className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Counter Terakhir
                                        </p>
                                        <p className="text-gray-900">
                                            {programStudi.nim_counter} mahasiswa
                                            terdaftar
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                                    <p className="mb-1 text-xs text-green-600">
                                        NIM Selanjutnya
                                    </p>
                                    <p className="font-mono text-lg font-medium text-green-800">
                                        {programStudi.nim_prefix}
                                        {String(new Date().getFullYear()).slice(
                                            -programStudi.nim_year_digits,
                                        )}
                                        {String(
                                            programStudi.nim_counter + 1,
                                        ).padStart(
                                            programStudi.nim_digit_count,
                                            '0',
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

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
                                        {new Date(
                                            programStudi.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            dateStyle: 'full',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">
                                        Terakhir Diperbarui
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {new Date(
                                            programStudi.updated_at,
                                        ).toLocaleDateString('id-ID', {
                                            dateStyle: 'full',
                                        })}
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

ProgramStudiShow.layout = (page: React.ReactNode) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Program Studi', href: '/admin/program-studi' },
        { title: 'Detail', href: '#' },
    ],
});
