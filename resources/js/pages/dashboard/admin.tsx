import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    ClipboardList,
    GraduationCap,
    Receipt,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Periode = {
    nama_tahun_akademik: string;
    semester: string;
} | null;

type Props = {
    periode: Periode;
    stats: {
        total_mahasiswa: number;
        mahasiswa_aktif: number;
        mahasiswa_baru: number;
        total_dosen: number;
        total_tendik: number;
        total_kelas: number;
        total_mata_kuliah: number;
        mata_kuliah_aktif: number;
        total_program_studi: number;
        krs_pending: number;
        tagihan_belum_lunas: number;
        total_tunggakan: number;
        tagihan_jatuh_tempo: number;
        nilai_belum_diunggah: number;
    };
    mahasiswaPerSemester: Array<{
        label: string;
        semester: number;
        jumlah: number;
    }>;
    komposisiProdi: Array<{
        nama: string;
        kode: string;
        jumlah: number;
        persen: number;
    }>;
    jadwalHariIni: Array<{
        kode: string;
        mata_kuliah: string;
        dosen: string;
        ruang: string;
        jam_mulai: string | null;
        jam_selesai: string | null;
    }>;
    aktivitasTerbaru: Array<{
        jenis: string;
        teks: string;
        waktu: string;
    }>;
};

const rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

const tanggalPanjang = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

/** Bar/segment fills, in the order the green scale should be consumed. */
const DERET_HIJAU = [
    'bg-green-800',
    'bg-green-700',
    'bg-green-600',
    'bg-green-500',
    'bg-green-400',
    'bg-green-300',
];

/** "12 menit lalu" style stamp for the activity feed. */
function waktuRelatif(iso: string): string {
    if (!iso) {
        return '';
    }

    const selisihDetik = (Date.now() - new Date(iso).getTime()) / 1000;
    const formatter = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });
    const satuan: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ['year', 31536000],
        ['month', 2592000],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
    ];

    for (const [unit, detik] of satuan) {
        if (selisihDetik >= detik) {
            return formatter.format(-Math.floor(selisihDetik / detik), unit);
        }
    }

    return 'baru saja';
}

function jam(waktu: string | null): string {
    return waktu ? waktu.slice(0, 5) : '--:--';
}

export default function AdminDashboard({
    periode,
    stats,
    mahasiswaPerSemester,
    komposisiProdi,
    jadwalHariIni,
    aktivitasTerbaru,
}: Props) {
    const { auth } = usePage().props;
    const [modeGrafik, setModeGrafik] = useState<'semester' | 'prodi'>(
        'semester',
    );

    const batangGrafik =
        modeGrafik === 'semester'
            ? mahasiswaPerSemester.map((item, index) => ({
                  kunci: `s${item.semester}`,
                  label: item.label,
                  judul: `Semester ${item.semester}`,
                  jumlah: item.jumlah,
                  warna: index < 4 ? 'bg-green-700' : 'bg-green-300',
              }))
            : komposisiProdi.map((prodi, index) => ({
                  kunci: prodi.kode,
                  label: prodi.kode,
                  judul: prodi.nama,
                  jumlah: prodi.jumlah,
                  warna: DERET_HIJAU[index % DERET_HIJAU.length],
              }));

    const puncakGrafik = Math.max(
        1,
        ...batangGrafik.map((batang) => batang.jumlah),
    );
    const adaDataGrafik = batangGrafik.some((batang) => batang.jumlah > 0);

    const kpis = [
        {
            label: 'Total Mahasiswa',
            nilai: stats.total_mahasiswa,
            tag: 'MHS',
            ikon: GraduationCap,
            latar: 'bg-kpi-mahasiswa',
            badge: `${stats.mahasiswa_aktif} aktif`,
            sub: `${stats.mahasiswa_baru} pendaftar 30 hari terakhir`,
            href: '/admin/mahasiswa',
        },
        {
            label: 'Dosen & Tendik',
            nilai: stats.total_dosen + stats.total_tendik,
            tag: 'DSN',
            ikon: Users,
            latar: 'bg-kpi-pegawai',
            badge: `${stats.total_dosen} dosen`,
            sub: `${stats.total_tendik} tenaga kependidikan`,
            href: '/admin/dosen',
        },
        {
            label: 'Mata Kuliah Aktif',
            nilai: stats.mata_kuliah_aktif,
            tag: 'MK',
            ikon: BookOpen,
            latar: 'bg-kpi-akademik',
            badge: `${stats.total_program_studi} prodi`,
            sub: `${stats.total_kelas} kelas terjadwal`,
            href: '/admin/mata-kuliah',
        },
        {
            label: 'Tagihan Belum Lunas',
            nilai: stats.tagihan_belum_lunas,
            tag: 'KEU',
            ikon: Receipt,
            latar: 'bg-kpi-keuangan',
            badge: rupiah.format(stats.total_tunggakan),
            sub: `${stats.tagihan_jatuh_tempo} jatuh tempo pekan ini`,
            href: '/admin/tagihan-ukt',
        },
    ];

    const perluTindakan = [
        {
            teks: 'Pengajuan KRS menunggu persetujuan',
            jumlah: stats.krs_pending,
            href: '/admin/krs',
            warna: 'border-l-4 border-l-green-700',
        },
        {
            teks: 'Tagihan UKT jatuh tempo pekan ini',
            jumlah: stats.tagihan_jatuh_tempo,
            href: '/admin/tagihan-ukt',
            warna: 'border-l-4 border-l-gold',
        },
        {
            teks: 'Nilai belum diunggah dosen',
            jumlah: stats.nilai_belum_diunggah,
            href: '/admin/nilai',
            warna: 'border-l-4 border-l-destructive',
        },
    ];

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Assalamualaikum, {auth.user.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {periode
                            ? `Ringkasan akademik Semester ${periode.semester} ${periode.nama_tahun_akademik}`
                            : 'Ringkasan akademik institusi'}{' '}
                        · {tanggalPanjang.format(new Date())}
                    </p>
                </div>

                {/* KPI ribbon */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {kpis.map((kpi) => (
                        <Link
                            key={kpi.label}
                            href={kpi.href}
                            className={`rounded-lg p-5 text-white shadow-sm transition-opacity hover:opacity-95 ${kpi.latar}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span className="text-xs font-medium tracking-wide text-white/85 uppercase">
                                    {kpi.label}
                                </span>
                                <span
                                    className="flex shrink-0 items-center gap-1.5 rounded-md bg-white/20 px-2 py-1 text-[10px] font-semibold tracking-wider"
                                    title={kpi.label}
                                >
                                    <kpi.ikon className="h-3.5 w-3.5" />
                                    {kpi.tag}
                                </span>
                            </div>
                            <div className="mt-3 text-3xl font-bold tabular-nums">
                                {kpi.nilai}
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-medium tabular-nums">
                                    {kpi.badge}
                                </span>
                                <span className="text-xs text-white/80">
                                    {kpi.sub}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Distribusi mahasiswa + komposisi prodi */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>
                                    {modeGrafik === 'semester'
                                        ? 'Mahasiswa Aktif per Semester'
                                        : 'Mahasiswa per Program Studi'}
                                </CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {stats.mahasiswa_aktif} mahasiswa aktif
                                    terdaftar
                                </p>
                            </div>
                            <div className="flex shrink-0 gap-0.5 rounded-md bg-muted p-0.5">
                                {(['semester', 'prodi'] as const).map(
                                    (mode) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setModeGrafik(mode)}
                                            aria-pressed={modeGrafik === mode}
                                            className={`rounded-sm px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                                                modeGrafik === mode
                                                    ? 'bg-card text-primary shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {mode}
                                        </button>
                                    ),
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!adaDataGrafik ? (
                                <EmptyState
                                    ikon={GraduationCap}
                                    judul="Belum ada mahasiswa aktif"
                                    keterangan="Distribusi mahasiswa muncul setelah ada mahasiswa berstatus aktif."
                                />
                            ) : (
                                <>
                                    <div className="flex h-48 items-end gap-2 border-b border-border">
                                        {batangGrafik.map((batang) => (
                                            <div
                                                key={batang.kunci}
                                                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                                title={`${batang.judul}: ${batang.jumlah} mahasiswa`}
                                            >
                                                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                                                    {batang.jumlah}
                                                </span>
                                                <div
                                                    className={`w-full max-w-12 rounded-t-md ${batang.warna}`}
                                                    style={{
                                                        height: `${Math.max(
                                                            batang.jumlah > 0
                                                                ? 4
                                                                : 2,
                                                            (batang.jumlah /
                                                                puncakGrafik) *
                                                                100,
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        {batangGrafik.map((batang) => (
                                            <div
                                                key={batang.kunci}
                                                className="flex-1 truncate text-center text-xs font-medium text-muted-foreground"
                                                title={batang.judul}
                                            >
                                                {batang.label}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Komposisi Program Studi</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {stats.total_program_studi} program studi
                                terdaftar
                            </p>
                        </CardHeader>
                        <CardContent>
                            {komposisiProdi.length === 0 ? (
                                <EmptyState
                                    ikon={BookOpen}
                                    judul="Belum ada program studi"
                                    keterangan="Tambahkan program studi untuk melihat komposisinya."
                                />
                            ) : (
                                <>
                                    <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-md">
                                        {komposisiProdi.map((prodi, index) => (
                                            <div
                                                key={prodi.kode}
                                                className={
                                                    DERET_HIJAU[
                                                        index %
                                                            DERET_HIJAU.length
                                                    ]
                                                }
                                                style={{
                                                    width: `${Math.max(prodi.persen, 1)}%`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <ul className="mt-4 space-y-3">
                                        {komposisiProdi.map((prodi, index) => (
                                            <li
                                                key={prodi.kode}
                                                className="flex items-center gap-2.5"
                                            >
                                                <span
                                                    className={`h-2.5 w-2.5 shrink-0 rounded-sm ${
                                                        DERET_HIJAU[
                                                            index %
                                                                DERET_HIJAU.length
                                                        ]
                                                    }`}
                                                />
                                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                                    {prodi.nama}
                                                </span>
                                                <span className="text-sm text-muted-foreground tabular-nums">
                                                    {prodi.jumlah}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Jadwal + panel kanan */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="gap-0 py-0 lg:col-span-2">
                        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
                            <div>
                                <CardTitle>Jadwal Kuliah Hari Ini</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {jadwalHariIni.length} kelas terjadwal
                                </p>
                            </div>
                            <Link
                                href="/admin/penjadwalan"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Lihat semua
                            </Link>
                        </div>
                        {jadwalHariIni.length === 0 ? (
                            <div className="px-6 py-8">
                                <EmptyState
                                    ikon={CalendarDays}
                                    judul="Tidak ada kelas hari ini"
                                    keterangan="Jadwal perkuliahan untuk hari ini belum tersedia."
                                />
                            </div>
                        ) : (
                            <ul>
                                {jadwalHariIni.map((jadwal) => (
                                    <li
                                        key={jadwal.kode}
                                        className="flex items-center gap-4 border-b border-border px-6 py-3 last:border-b-0 hover:bg-accent/50"
                                    >
                                        <span className="w-24 shrink-0 text-sm text-muted-foreground tabular-nums">
                                            {jam(jadwal.jam_mulai)}–
                                            {jam(jadwal.jam_selesai)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {jadwal.mata_kuliah}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {jadwal.dosen}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                            {jadwal.ruang}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Perlu Tindakan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {perluTindakan.map((item) => (
                                    <Link
                                        key={item.teks}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-md bg-muted px-3 py-2.5 transition-colors hover:bg-accent ${item.warna}`}
                                    >
                                        <span className="min-w-0 flex-1 text-sm font-medium">
                                            {item.teks}
                                        </span>
                                        <span className="text-lg font-bold tabular-nums">
                                            {item.jumlah}
                                        </span>
                                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Aktivitas Terbaru</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {aktivitasTerbaru.length === 0 ? (
                                    <EmptyState
                                        ikon={ClipboardList}
                                        judul="Belum ada aktivitas"
                                        keterangan="Pendaftaran, pembayaran, dan input nilai terbaru akan tampil di sini."
                                    />
                                ) : (
                                    <ul className="space-y-4">
                                        {aktivitasTerbaru.map(
                                            (aktivitas, index) => (
                                                <li
                                                    key={`${aktivitas.jenis}-${index}`}
                                                    className="flex gap-3"
                                                >
                                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm leading-snug">
                                                            {aktivitas.teks}
                                                        </p>
                                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                                            {waktuRelatif(
                                                                aktivitas.waktu,
                                                            )}
                                                        </p>
                                                    </div>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

function EmptyState({
    ikon: Ikon,
    judul,
    keterangan,
}: {
    ikon: typeof GraduationCap;
    judul: string;
    keterangan: string;
}) {
    return (
        <div className="flex flex-col items-center gap-1 py-6 text-center">
            <Ikon className="mb-1 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium">{judul}</p>
            <p className="text-xs text-muted-foreground">{keterangan}</p>
        </div>
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
