import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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
    return (
        <>
            <Head title={`Program Studi - ${programStudi.nama_prodi}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/program-studi" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Kembali ke Daftar
                        </Link>
                        <h1 className="text-2xl font-bold">{programStudi.nama_prodi}</h1>
                    </div>
                    <Link href={`/admin/program-studi/${programStudi.uuid}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Program Studi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Kode Program Studi</p>
                                <p className="font-mono font-medium">{programStudi.kode_prodi}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Nama Program Studi</p>
                                <p className="font-medium">{programStudi.nama_prodi}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fakultas</p>
                                <p>{programStudi.fakultas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Jenjang</p>
                                <Badge variant="outline">{programStudi.jenis_prodi}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Lama Studi</p>
                                <p>{programStudi.lama_studi} Tahun</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Konfigurasi NIM</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Prefix NIM</p>
                                    <p className="font-mono font-medium text-lg">{programStudi.nim_prefix}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Digit Tahun Masuk</p>
                                    <p>{programStudi.nim_year_digits} digit ({programStudi.nim_year_digits === 2 ? '26' : '026'})</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Digit Counter</p>
                                    <p>{programStudi.nim_digit_count} digit</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Counter Terakhir</p>
                                    <p>{programStudi.nim_counter} mahasiswa terdaftar</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">NIM Selanjutnya</p>
                                    <p className="font-mono font-medium text-lg">
                                        {programStudi.nim_prefix}{String(new Date().getFullYear()).slice(-programStudi.nim_year_digits)}{String(programStudi.nim_counter + 1).padStart(programStudi.nim_digit_count, '0')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Sistem</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Dibuat Pada</p>
                                    <p>{new Date(programStudi.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Terakhir Diperbarui</p>
                                    <p>{new Date(programStudi.updated_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ProgramStudiShow.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Program Studi', href: '/admin/program-studi' },
        { title: 'Detail', href: '#' },
    ]}>
        {page}
    </AppLayout>
);
