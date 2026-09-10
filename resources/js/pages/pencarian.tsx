import { Head, Link } from '@inertiajs/react';
import { BookOpen, GraduationCap, Search, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Hasil = {
    judul: string;
    keterangan: string;
    href: string;
};

type Props = {
    q: string;
    hasil: {
        mahasiswa: Hasil[];
        dosen: Hasil[];
        mataKuliah: Hasil[];
    };
    total: number;
};

export default function Pencarian({ q, hasil, total }: Props) {
    const kelompok = [
        {
            judul: 'Mahasiswa',
            ikon: GraduationCap,
            daftar: hasil.mahasiswa,
        },
        { judul: 'Dosen', ikon: UserCheck, daftar: hasil.dosen },
        { judul: 'Mata Kuliah', ikon: BookOpen, daftar: hasil.mataKuliah },
    ].filter((item) => item.daftar.length > 0);

    return (
        <>
            <Head title={q ? `Pencarian: ${q}` : 'Pencarian'} />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Hasil Pencarian
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {q
                            ? `${total} hasil untuk “${q}” · maksimal 5 per kategori`
                            : 'Ketik kata kunci di kolom pencarian untuk mencari mahasiswa, dosen, atau mata kuliah.'}
                    </p>
                </div>

                {q && total === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-1 py-10 text-center">
                            <Search className="mb-1 h-6 w-6 text-muted-foreground" />
                            <p className="text-sm font-medium">
                                Tidak ada data yang cocok
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Coba kata kunci lain, atau cari dengan NIM,
                                NIDN, atau kode mata kuliah.
                            </p>
                        </CardContent>
                    </Card>
                ) : null}

                {kelompok.map((item) => (
                    <Card key={item.judul} className="gap-0 py-0">
                        <CardHeader className="flex flex-row items-center gap-2 border-b border-border px-6 py-4">
                            <item.ikon className="h-4 w-4 text-muted-foreground" />
                            <CardTitle>{item.judul}</CardTitle>
                            <span className="text-sm text-muted-foreground tabular-nums">
                                ({item.daftar.length})
                            </span>
                        </CardHeader>
                        <CardContent className="px-0">
                            <ul>
                                {item.daftar.map((hasil) => (
                                    <li key={hasil.href}>
                                        <Link
                                            href={hasil.href}
                                            className="flex flex-col gap-0.5 border-b border-border px-6 py-3 last:border-b-0 hover:bg-accent/50"
                                        >
                                            <span className="text-sm font-medium">
                                                {hasil.judul}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {hasil.keterangan}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}

Pencarian.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pencarian', href: '/pencarian' },
    ],
});
