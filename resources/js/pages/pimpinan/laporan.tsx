import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, FileText, DollarSign } from 'lucide-react';

type Props = {
    laporanAkademik: {
        total_mahasiswa: number;
        mahasiswa_aktif: number;
        mahasiswa_cuti: number;
        mahasiswa_lulus: number;
    };
    laporanNilai: {
        total_nilai: number;
        nilai_tercatat: number;
        krs_disetujui: number;
        total_yudisium: number;
    };
    laporanKeuangan: {
        total_tagihan: number;
        total_terbayar: number;
        tagihan_lunas: number;
        tagihan_belum_lunas: number;
    };
};

export default function LaporanPimpinan({ laporanAkademik, laporanNilai, laporanKeuangan }: Props) {
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    return (
        <>
            <Head title="Laporan Ringkas" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-green-800">Laporan Ringkas</h1>
                    <p className="text-gray-600">Ringkasan akademik, mahasiswa, nilai/yudisium, dan keuangan kampus</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <GraduationCap className="h-5 w-5 text-green-700" />
                                Akademik & Mahasiswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Mahasiswa</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanAkademik.total_mahasiswa}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Aktif</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanAkademik.mahasiswa_aktif}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Cuti</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanAkademik.mahasiswa_cuti}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Lulus</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanAkademik.mahasiswa_lulus}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <FileText className="h-5 w-5 text-green-700" />
                                Nilai & Yudisium
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Nilai</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanNilai.total_nilai}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Nilai Tercatat</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanNilai.nilai_tercatat}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">KRS Disetujui</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanNilai.krs_disetujui}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Yudisium</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanNilai.total_yudisium}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900">
                                <DollarSign className="h-5 w-5 text-green-700" />
                                Keuangan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Tagihan</span>
                                <span className="font-medium text-gray-900">{formatCurrency(laporanKeuangan.total_tagihan)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total Terbayar</span>
                                <span className="font-medium text-green-700">{formatCurrency(laporanKeuangan.total_terbayar)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tagihan Lunas</span>
                                <span className="font-medium tabular-nums text-gray-900">{laporanKeuangan.tagihan_lunas}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tagihan Belum Lunas</span>
                                <span className="font-medium tabular-nums text-red-600">{laporanKeuangan.tagihan_belum_lunas}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
