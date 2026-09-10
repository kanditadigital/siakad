import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CalendarDays,
    ClipboardList,
    FileText,
    GraduationCap,
    Receipt,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardTitle } from '@/components/ui/card';

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

const angka = new Intl.NumberFormat('id-ID');

const tanggalPanjang = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

/**
 * Icon and tint per activity kind, keyed by the `jenis` the controller sends.
 * A uniform dot told the reader nothing; the kind is the fastest way to scan
 * "what happened" before reading the sentence.
 */
const JENIS_AKTIVITAS: Record<
    string,
    { ikon: typeof GraduationCap; tint: string }
> = {
    mahasiswa: {
        ikon: GraduationCap,
        tint: 'bg-kpi-mahasiswa/10 text-kpi-mahasiswa',
    },
    pembayaran: { ikon: Receipt, tint: 'bg-kpi-keuangan/10 text-kpi-keuangan' },
    nilai: { ikon: FileText, tint: 'bg-kpi-akademik/10 text-kpi-akademik' },
    krs: { ikon: ClipboardList, tint: 'bg-kpi-pegawai/10 text-kpi-pegawai' },
};

/** Segment fills for the programme-composition bar, darkest first. */
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

/**
 * Axis ticks that land on readable numbers (1/2/5 × 10ⁿ) instead of raw
 * fractions of the maximum — 0/5/10/15 rather than 0/4.25/8.5/12.75.
 */
function tickSumbu(maksimum: number, jumlahLangkah = 4): number[] {
    if (maksimum <= 0) {
        return [0, 1];
    }

    const kasar = maksimum / jumlahLangkah;
    const magnitudo = 10 ** Math.floor(Math.log10(kasar));
    const dinormalisasi = kasar / magnitudo;
    const langkah =
        (dinormalisasi <= 1 ? 1 : dinormalisasi <= 2 ? 2 : dinormalisasi <= 5 ? 5 : 10) *
        magnitudo;

    const atas = Math.ceil(maksimum / langkah) * langkah;
    const ticks: number[] = [];

    for (let nilai = 0; nilai <= atas + 1e-9; nilai += langkah) {
        ticks.push(Math.round(nilai * 100) / 100);
    }

    return ticks;
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
            ? mahasiswaPerSemester.map((item) => ({
                  kunci: `s${item.semester}`,
                  label: item.label,
                  judul: `Semester ${item.semester}`,
                  jumlah: item.jumlah,
              }))
            : komposisiProdi.map((prodi) => ({
                  kunci: prodi.kode,
                  label: prodi.kode,
                  judul: prodi.nama,
                  jumlah: prodi.jumlah,
              }));

    const adaDataGrafik = batangGrafik.some((batang) => batang.jumlah > 0);

    /**
     * Four measures an admin scans first. Tint classes are written out in full
     * because Tailwind only emits classes it can see as literal strings.
     */
    const kpis = [
        {
            label: 'Total Mahasiswa',
            nilai: angka.format(stats.total_mahasiswa),
            ikon: GraduationCap,
            tint: 'bg-kpi-mahasiswa/10 text-kpi-mahasiswa',
            badge: `${stats.mahasiswa_aktif} aktif`,
            sub: `${stats.mahasiswa_baru} pendaftar 30 hari terakhir`,
            href: '/admin/mahasiswa',
        },
        {
            label: 'Dosen & Tendik',
            nilai: angka.format(stats.total_dosen + stats.total_tendik),
            ikon: Users,
            tint: 'bg-kpi-pegawai/10 text-kpi-pegawai',
            badge: `${stats.total_dosen} dosen`,
            sub: `${stats.total_tendik} tenaga kependidikan`,
            href: '/admin/dosen',
        },
        {
            label: 'Mata Kuliah Aktif',
            nilai: angka.format(stats.mata_kuliah_aktif),
            ikon: BookOpen,
            tint: 'bg-kpi-akademik/10 text-kpi-akademik',
            badge: `${stats.total_program_studi} prodi`,
            sub: `${stats.total_kelas} kelas terjadwal`,
            href: '/admin/mata-kuliah',
        },
        {
            label: 'Tagihan Belum Lunas',
            nilai: angka.format(stats.tagihan_belum_lunas),
            ikon: Receipt,
            tint: 'bg-kpi-keuangan/10 text-kpi-keuangan',
            badge: rupiah.format(stats.total_tunggakan),
            sub: `${stats.tagihan_jatuh_tempo} jatuh tempo pekan ini`,
            href: '/admin/tagihan-ukt',
            // Money owed is the one measure that earns emphasis when non-zero;
            // at zero it stays as quiet as the rest (DESIGN.md §3.1).
            mendesak: stats.tagihan_belum_lunas > 0,
        },
    ];

    const perluTindakan = [
        {
            teks: 'Pengajuan KRS menunggu persetujuan',
            jumlah: stats.krs_pending,
            href: '/admin/krs',
            rail: 'bg-green-700',
        },
        {
            teks: 'Tagihan UKT jatuh tempo pekan ini',
            jumlah: stats.tagihan_jatuh_tempo,
            href: '/admin/tagihan-ukt',
            rail: 'bg-gold',
        },
        {
            teks: 'Nilai belum diunggah dosen',
            jumlah: stats.nilai_belum_diunggah,
            href: '/admin/nilai',
            rail: 'bg-destructive',
        },
    ];

    return (
        <>
            <Head title="Dashboard Admin" />

            <div className="space-y-5">
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
                        <KartuKpi key={kpi.label} {...kpi} />
                    ))}
                </div>

                {/* Distribusi mahasiswa + komposisi prodi.
                    items-start: without it the shorter card in each row is
                    stretched to its neighbour's height, which left a tall band
                    of empty white on this page. */}
                <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
                    <Card className="gap-0 py-0 lg:col-span-2">
                        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
                            <div>
                                <CardTitle className="text-[15px]">
                                    {modeGrafik === 'semester'
                                        ? 'Mahasiswa Aktif per Semester'
                                        : 'Mahasiswa per Program Studi'}
                                </CardTitle>
                                <p className="mt-1 text-xs text-muted-foreground">
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
                                            className={`rounded-sm px-3 py-1 text-xs font-medium capitalize transition-colors ${
                                                modeGrafik === mode
                                                    ? 'bg-card text-foreground shadow-sm'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                        >
                                            {mode}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                        <div className="px-5 pt-5 pb-5">
                            {!adaDataGrafik ? (
                                <EmptyState
                                    ikon={GraduationCap}
                                    judul="Belum ada mahasiswa aktif"
                                    keterangan="Distribusi mahasiswa muncul setelah ada mahasiswa berstatus aktif."
                                />
                            ) : (
                                <GrafikBatang data={batangGrafik} />
                            )}
                        </div>
                    </Card>

                    <Card className="gap-0 py-0">
                        <div className="px-5 pt-5">
                            <CardTitle className="text-[15px]">
                                Komposisi Program Studi
                            </CardTitle>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {stats.total_program_studi} program studi
                                terdaftar
                            </p>
                        </div>
                        <div className="px-5 pt-4 pb-5">
                            {komposisiProdi.length === 0 ? (
                                <EmptyState
                                    ikon={BookOpen}
                                    judul="Belum ada program studi"
                                    keterangan="Tambahkan program studi untuk melihat komposisinya."
                                />
                            ) : (
                                <>
                                    <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
                                        {komposisiProdi.map((prodi, index) => (
                                            <div
                                                key={prodi.kode}
                                                title={`${prodi.nama}: ${prodi.jumlah} mahasiswa (${prodi.persen}%)`}
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
                                    <ul className="mt-4 space-y-2.5">
                                        {komposisiProdi.map((prodi, index) => (
                                            <li
                                                key={prodi.kode}
                                                className="flex items-center gap-2.5"
                                            >
                                                <span
                                                    className={`size-2 shrink-0 rounded-full ${
                                                        DERET_HIJAU[
                                                            index %
                                                                DERET_HIJAU.length
                                                        ]
                                                    }`}
                                                />
                                                <span
                                                    className="min-w-0 flex-1 truncate text-[13px]"
                                                    title={prodi.nama}
                                                >
                                                    {prodi.nama}
                                                </span>
                                                <span className="text-[13px] font-medium tabular-nums">
                                                    {prodi.jumlah}
                                                </span>
                                                <span className="w-10 text-right text-[11px] text-muted-foreground tabular-nums">
                                                    {prodi.persen}%
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Jadwal + panel kanan */}
                <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
                    <Card className="gap-0 py-0 lg:col-span-2">
                        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
                            <div>
                                <CardTitle className="text-[15px]">
                                    Jadwal Kuliah Hari Ini
                                </CardTitle>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {jadwalHariIni.length} kelas terjadwal
                                </p>
                            </div>
                            <Link
                                href="/admin/penjadwalan"
                                className="shrink-0 text-xs font-medium text-primary hover:underline"
                            >
                                Lihat semua
                            </Link>
                        </div>
                        {jadwalHariIni.length === 0 ? (
                            <div className="px-5 py-8">
                                <EmptyState
                                    ikon={CalendarDays}
                                    judul="Tidak ada kelas hari ini"
                                    keterangan="Jadwal perkuliahan untuk hari ini belum tersedia."
                                />
                            </div>
                        ) : (
                            <ul className="divide-y divide-border">
                                {jadwalHariIni.map((jadwal) => (
                                    <li
                                        key={jadwal.kode}
                                        className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-accent/40"
                                    >
                                        <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                                            {jam(jadwal.jam_mulai)}–
                                            {jam(jadwal.jam_selesai)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[13px] font-medium">
                                                {jadwal.mata_kuliah}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {jadwal.dosen}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                            {jadwal.ruang}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Card>

                    <Card className="gap-0 py-0">
                        <div className="px-5 pt-5">
                            <CardTitle className="text-[15px]">
                                Perlu Tindakan
                            </CardTitle>
                        </div>
                        <div className="space-y-1.5 px-5 pt-4 pb-5">
                            {perluTindakan.map((item) => (
                                <Link
                                    key={item.teks}
                                    href={item.href}
                                    className="flex items-center gap-3 overflow-hidden rounded-md bg-muted/60 pr-3 transition-colors hover:bg-accent"
                                >
                                    <span
                                        className={`h-9 w-1 shrink-0 rounded-r-full ${item.rail}`}
                                    />
                                    <span className="min-w-0 flex-1 py-2 text-[13px] leading-snug">
                                        {item.teks}
                                    </span>
                                    <span className="text-base font-semibold tabular-nums">
                                        {item.jumlah}
                                    </span>
                                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Aktivitas melebar penuh, bukan kolom sempit: sebagai daftar
                    tegak ia menjulur jauh melewati kartu di sebelahnya dan
                    meninggalkan pita putih kosong. */}
                <Card className="gap-0 py-0">
                    <div className="px-5 pt-5">
                        <CardTitle className="text-[15px]">
                            Aktivitas Terbaru
                        </CardTitle>
                    </div>
                    <div className="px-5 pt-4 pb-5">
                        {aktivitasTerbaru.length === 0 ? (
                            <EmptyState
                                ikon={ClipboardList}
                                judul="Belum ada aktivitas"
                                keterangan="Pendaftaran, pembayaran, dan input nilai terbaru akan tampil di sini."
                            />
                        ) : (
                            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
                                {aktivitasTerbaru.map((aktivitas, index) => {
                                    const jenis =
                                        JENIS_AKTIVITAS[aktivitas.jenis] ??
                                        JENIS_AKTIVITAS.mahasiswa;

                                    return (
                                        <li
                                            key={`${aktivitas.jenis}-${index}`}
                                            className="flex gap-2.5"
                                        >
                                            <span
                                                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md ${jenis.tint}`}
                                            >
                                                <jenis.ikon className="size-3.5" />
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-[13px] leading-snug">
                                                    {aktivitas.teks}
                                                </p>
                                                <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                    {waktuRelatif(
                                                        aktivitas.waktu,
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
}

/**
 * White stat card: tinted icon tile and badge on top, measure below.
 *
 * White rather than a saturated colour block — four solid fills competed with
 * each other and with the green sidebar, and the reference dashboard reads far
 * calmer. Colour survives as the icon tint, which still separates the domains.
 */
function KartuKpi({
    label,
    nilai,
    ikon: Ikon,
    tint,
    badge,
    sub,
    href,
    mendesak = false,
}: {
    label: string;
    nilai: string;
    ikon: typeof GraduationCap;
    tint: string;
    badge: string;
    sub: string;
    href: string;
    mendesak?: boolean;
}) {
    return (
        <Link
            href={href}
            className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
        >
            <div className="flex items-start justify-between gap-2">
                <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-md ${tint}`}
                >
                    <Ikon className="size-4.5" />
                </span>
                <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums ${
                        mendesak
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted text-muted-foreground'
                    }`}
                >
                    {badge}
                </span>
            </div>

            <p className="mt-3 text-2xl leading-none font-bold tabular-nums">
                {nilai}
            </p>
            <p className="mt-1.5 text-[13px] font-medium">{label}</p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {sub}
            </p>
        </Link>
    );
}

/**
 * Bar chart drawn with plain CSS — gridlines on rounded axis ticks, a hover
 * readout, and no charting dependency for what is a single series.
 */
function GrafikBatang({
    data,
}: {
    data: Array<{
        kunci: string;
        label: string;
        judul: string;
        jumlah: number;
    }>;
}) {
    const [aktif, setAktif] = useState<string | null>(null);

    const puncak = Math.max(...data.map((batang) => batang.jumlah));
    const ticks = tickSumbu(puncak);
    const atas = ticks[ticks.length - 1] || 1;

    return (
        <div>
            <div className="flex gap-2">
                {/* Sumbu Y */}
                <div className="relative h-48 w-7 shrink-0">
                    {ticks.map((tick) => (
                        <span
                            key={tick}
                            style={{ bottom: `${(tick / atas) * 100}%` }}
                            className="absolute right-0 translate-y-1/2 text-[10px] text-muted-foreground tabular-nums"
                        >
                            {tick}
                        </span>
                    ))}
                </div>

                <div className="relative h-48 flex-1">
                    {/* Gridline pada tiap tick */}
                    {ticks.map((tick) => (
                        <div
                            key={tick}
                            style={{ bottom: `${(tick / atas) * 100}%` }}
                            className={`absolute inset-x-0 border-t ${
                                tick === 0 ? 'border-border' : 'border-border/50'
                            }`}
                        />
                    ))}

                    <div className="absolute inset-0 flex items-end gap-1.5">
                        {data.map((batang) => {
                            const tinggi = (batang.jumlah / atas) * 100;
                            const disorot = aktif === batang.kunci;

                            return (
                                <div
                                    key={batang.kunci}
                                    className="relative flex h-full flex-1 items-end justify-center"
                                    onMouseEnter={() => setAktif(batang.kunci)}
                                    onMouseLeave={() => setAktif(null)}
                                >
                                    {disorot ? (
                                        <div
                                            // Anchored just above the bar's own
                                            // top, then clamped so a tall bar
                                            // cannot push the readout out of the
                                            // plot and over the card title.
                                            style={{
                                                bottom: `min(calc(${tinggi}% + 6px), calc(100% - 46px))`,
                                            }}
                                            className="pointer-events-none absolute left-1/2 z-10 w-max max-w-40 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-center shadow-md"
                                        >
                                            <p className="truncate text-[11px] font-medium text-background">
                                                {batang.judul}
                                            </p>
                                            <p className="text-[11px] text-background/80 tabular-nums">
                                                {batang.jumlah} mahasiswa
                                            </p>
                                        </div>
                                    ) : null}

                                    <div
                                        style={{
                                            height: `${Math.max(tinggi, batang.jumlah > 0 ? 2 : 0)}%`,
                                        }}
                                        className={`w-full max-w-10 rounded-t-sm transition-colors ${
                                            disorot
                                                ? 'bg-green-800'
                                                : 'bg-green-600'
                                        }`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Label sumbu X, disejajarkan dengan area plot */}
            <div className="mt-2 flex gap-2">
                <div className="w-7 shrink-0" />
                <div className="flex flex-1 gap-1.5">
                    {data.map((batang) => (
                        <div
                            key={batang.kunci}
                            title={batang.judul}
                            className={`min-w-0 flex-1 truncate text-center text-[11px] transition-colors ${
                                aktif === batang.kunci
                                    ? 'font-medium text-foreground'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {batang.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
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
            <Ikon className="mb-1 size-6 text-muted-foreground" />
            <p className="text-[13px] font-medium">{judul}</p>
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
