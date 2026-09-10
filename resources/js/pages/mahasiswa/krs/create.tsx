import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, ClipboardList } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

type MataKuliah = {
    id: number;
    kode_mk: string;
    nama_mk: string;
    sks: number;
};

type Dosen = {
    id: number;
    nama: string;
};

type Ruang = {
    id: number;
    kode_ruang: string;
};

type Kelas = {
    id: number;
    kode_kelas: string;
    nama_kelas: string;
    kapasitas: number;
    mata_kuliah: MataKuliah;
    dosen: Dosen | null;
    ruang: Ruang | null;
};

type AcademicYearSemester = {
    id: number;
    nama_tahun_akademik: string;
    semester: string;
};

type Props = {
    kelases: Kelas[];
    academicYearSemester: AcademicYearSemester;
    existingSks: number;
    minSks: number;
    maxSks: number;
};

export default function KrsCreate({
    kelases,
    academicYearSemester,
    existingSks,
    minSks,
    maxSks,
}: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        kelas_ids: number[];
    }>({
        kelas_ids: [],
    });

    const kelasById = useMemo(
        () => new Map(kelases.map((k) => [k.id, k])),
        [kelases],
    );

    const selectedSks = data.kelas_ids.reduce((sum, id) => {
        const kelas = kelasById.get(id);
        return sum + (kelas?.mata_kuliah?.sks || 0);
    }, 0);

    const totalSks = existingSks + selectedSks;
    const overMax = totalSks > maxSks;
    const underMin = totalSks < minSks;

    const toggleKelas = (kelasId: number, checked: boolean) => {
        setData(
            'kelas_ids',
            checked
                ? [...data.kelas_ids, kelasId]
                : data.kelas_ids.filter((id) => id !== kelasId),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mahasiswa/krs');
    };

    return (
        <>
            <Head title="Ajukan KRS" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/mahasiswa/krs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">
                            Ajukan KRS
                        </h1>
                        <p className="text-gray-600">
                            {academicYearSemester.nama_tahun_akademik} -
                            Semester {academicYearSemester.semester}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* SKS summary */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total SKS (termasuk yang sudah diajukan)
                                </p>
                                <p
                                    className={`text-3xl font-bold tabular-nums ${
                                        overMax
                                            ? 'text-red-600'
                                            : underMin
                                              ? 'text-amber-600'
                                              : 'text-green-700'
                                    }`}
                                >
                                    {totalSks}{' '}
                                    <span className="text-base font-normal text-gray-500">
                                        / {minSks}–{maxSks} SKS
                                    </span>
                                </p>
                            </div>
                            {(overMax || underMin) && (
                                <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                    <AlertTriangle className="h-4 w-4 shrink-0" />
                                    {overMax
                                        ? `Melebihi batas maksimal ${maxSks} SKS`
                                        : `Belum memenuhi batas minimal ${minSks} SKS`}
                                </div>
                            )}
                            <Button
                                type="submit"
                                disabled={
                                    processing ||
                                    data.kelas_ids.length === 0 ||
                                    overMax ||
                                    underMin
                                }
                                className="bg-green-700 hover:bg-green-800"
                            >
                                {processing
                                    ? 'Mengajukan...'
                                    : `Ajukan KRS (${data.kelas_ids.length} kelas)`}
                            </Button>
                        </CardContent>
                        {errors.kelas_ids && (
                            <CardContent className="pt-0">
                                <p className="text-sm text-destructive">
                                    {errors.kelas_ids}
                                </p>
                            </CardContent>
                        )}
                    </Card>

                    {/* Kelas list */}
                    <Card className="overflow-hidden py-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10" />
                                        <TableHead>Mata Kuliah</TableHead>
                                        <TableHead className="text-right">
                                            SKS
                                        </TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Dosen</TableHead>
                                        <TableHead>Ruang</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kelases.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Tidak ada kelas
                                                        tersedia
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Semua kelas program
                                                        studi Anda sudah
                                                        diajukan, atau belum
                                                        ada kelas dibuka
                                                        semester ini
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        kelases.map((kelas) => {
                                            const checked =
                                                data.kelas_ids.includes(
                                                    kelas.id,
                                                );

                                            return (
                                                <TableRow
                                                    key={kelas.id}
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        toggleKelas(
                                                            kelas.id,
                                                            !checked,
                                                        )
                                                    }
                                                >
                                                    <TableCell
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <Checkbox
                                                            checked={checked}
                                                            onCheckedChange={(
                                                                value,
                                                            ) =>
                                                                toggleKelas(
                                                                    kelas.id,
                                                                    value ===
                                                                        true,
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            {
                                                                kelas
                                                                    .mata_kuliah
                                                                    ?.nama_mk
                                                            }
                                                        </div>
                                                        <div className="font-mono text-xs text-muted-foreground">
                                                            {
                                                                kelas
                                                                    .mata_kuliah
                                                                    ?.kode_mk
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {
                                                            kelas.mata_kuliah
                                                                ?.sks
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {kelas.nama_kelas}
                                                    </TableCell>
                                                    <TableCell>
                                                        {kelas.dosen?.nama ||
                                                            '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {kelas.ruang
                                                            ?.kode_ruang ||
                                                            '-'}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </form>
            </div>
        </>
    );
}

KrsCreate.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'KRS', href: '/mahasiswa/krs' },
            { title: 'Ajukan KRS', href: '#' },
        ]}
    >
        {page}
    </AppLayout>
);
