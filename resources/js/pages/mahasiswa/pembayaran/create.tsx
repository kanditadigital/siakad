import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, X, Receipt } from 'lucide-react';

type TagihanUkt = {
    id: number;
    uuid: string;
    jumlah_tagihan: number;
    jumlah_bayar: number;
    academic_year_semester: {
        nama_tahun_akademik: string;
        semester: string;
    };
};

type Props = {
    tagihanUkt: TagihanUkt;
};

export default function PembayaranCreate({ tagihanUkt }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        jumlah_bayar: String(tagihanUkt.jumlah_tagihan - tagihanUkt.jumlah_bayar),
        tanggal_bayar: new Date().toISOString().slice(0, 10),
        metode_pembayaran: 'transfer',
        bukti_pembayaran: null as File | null,
    });

    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('bukti_pembayaran', file);
            setFileName(file.name);
        }
    };

    const removeFile = () => {
        setData('bukti_pembayaran', null);
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/mahasiswa/tagihan-ukt/${tagihanUkt.uuid}/bayar`);
    };

    const sisaTagihan = tagihanUkt.jumlah_tagihan - tagihanUkt.jumlah_bayar;

    return (
        <>
            <Head title="Bayar Tagihan UKT" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">Bayar Tagihan UKT</h1>
                        <p className="text-gray-600">Unggah bukti transfer untuk diverifikasi admin</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/mahasiswa/tagihan-ukt">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                            <Receipt className="h-5 w-5 text-green-700" />
                            Info Tagihan
                        </CardTitle>
                        <CardDescription>
                            {tagihanUkt.academic_year_semester?.nama_tahun_akademik} - {tagihanUkt.academic_year_semester?.semester}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-gray-500">Jumlah Tagihan</p>
                            <p className="font-medium text-gray-900">{formatCurrency(tagihanUkt.jumlah_tagihan)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Sisa Tagihan</p>
                            <p className="font-medium text-red-600">{formatCurrency(sisaTagihan)}</p>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit}>
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Detail Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="jumlah_bayar">
                                        Jumlah Bayar <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="jumlah_bayar"
                                        type="number"
                                        min={1}
                                        value={data.jumlah_bayar}
                                        onChange={(e) => setData('jumlah_bayar', e.target.value)}
                                    />
                                    {errors.jumlah_bayar && <p className="text-sm text-destructive">{errors.jumlah_bayar}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tanggal_bayar">
                                        Tanggal Bayar <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="tanggal_bayar"
                                        type="date"
                                        value={data.tanggal_bayar}
                                        onChange={(e) => setData('tanggal_bayar', e.target.value)}
                                    />
                                    {errors.tanggal_bayar && <p className="text-sm text-destructive">{errors.tanggal_bayar}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="metode_pembayaran">
                                    Metode Pembayaran <span className="text-destructive">*</span>
                                </Label>
                                <Select value={data.metode_pembayaran} onValueChange={(value) => setData('metode_pembayaran', value)}>
                                    <SelectTrigger id="metode_pembayaran">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="transfer">Transfer Bank</SelectItem>
                                        <SelectItem value="cash">Tunai</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.metode_pembayaran && <p className="text-sm text-destructive">{errors.metode_pembayaran}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bukti_pembayaran">
                                    Bukti Transfer <span className="text-destructive">*</span>
                                </Label>
                                {fileName ? (
                                    <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                                        <span className="text-sm text-gray-900">{fileName}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Pilih File
                                        </Button>
                                        <span className="text-xs text-gray-500">JPG, PNG, atau PDF — maks. 2MB</span>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    id="bukti_pembayaran"
                                    type="file"
                                    accept="image/jpeg,image/png,application/pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {errors.bukti_pembayaran && <p className="text-sm text-destructive">{errors.bukti_pembayaran}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/mahasiswa/tagihan-ukt">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-green-700 hover:bg-green-800">
                            {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
