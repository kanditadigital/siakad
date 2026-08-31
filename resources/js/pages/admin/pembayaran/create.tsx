import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

type TagihanUkt = {
    id: number;
    jumlah_tagihan: number;
    jumlah_bayar: number;
    mahasiswa: {
        nim: string;
        nama: string;
    };
};

type Props = {
    tagihanUkts: TagihanUkt[];
};

export default function PembayaranCreate({ tagihanUkts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        tagihan_ukt_id: '',
        jumlah_bayar: '',
        tanggal_bayar: new Date().toISOString().slice(0, 10),
        metode_pembayaran: 'cash',
        keterangan: '',
    });

    const selectedTagihan = useMemo(
        () => tagihanUkts.find((t) => t.id.toString() === data.tagihan_ukt_id) || null,
        [data.tagihan_ukt_id, tagihanUkts],
    );

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pembayaran');
    };

    return (
        <>
            <Head title="Catat Pembayaran" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-800">Catat Pembayaran</h1>
                        <p className="text-gray-600">Untuk pembayaran tunai/manual di kantor — otomatis berstatus terverifikasi</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/pembayaran">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Detail Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="tagihan_ukt_id">
                                    Tagihan <span className="text-destructive">*</span>
                                </Label>
                                <Select value={data.tagihan_ukt_id} onValueChange={(value) => setData('tagihan_ukt_id', value)}>
                                    <SelectTrigger id="tagihan_ukt_id">
                                        <SelectValue placeholder="Pilih tagihan mahasiswa" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tagihanUkts.map((tagihan) => (
                                            <SelectItem key={tagihan.id} value={tagihan.id.toString()}>
                                                {tagihan.mahasiswa?.nim} — {tagihan.mahasiswa?.nama} ({formatCurrency(tagihan.jumlah_tagihan - tagihan.jumlah_bayar)} sisa)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.tagihan_ukt_id && <p className="text-sm text-destructive">{errors.tagihan_ukt_id}</p>}
                                {selectedTagihan && (
                                    <p className="text-xs text-gray-500">
                                        Sisa tagihan: {formatCurrency(selectedTagihan.jumlah_tagihan - selectedTagihan.jumlah_bayar)}
                                    </p>
                                )}
                            </div>

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
                                        <SelectItem value="cash">Tunai</SelectItem>
                                        <SelectItem value="transfer">Transfer Bank</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.metode_pembayaran && <p className="text-sm text-destructive">{errors.metode_pembayaran}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <Textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    placeholder="Opsional"
                                />
                                {errors.keterangan && <p className="text-sm text-destructive">{errors.keterangan}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/pembayaran">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-green-700 hover:bg-green-800">
                            {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
