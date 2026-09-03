import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLogoIcon from '@/components/app-logo-icon';
import PasskeyVerify from '@/components/passkey-verify';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    canResetPassword: boolean;
    status?: string;
};

/**
 * Institutional values from the campus profile (siakad.json) — constants of the
 * institution's identity, not configurable settings, so they live here rather
 * than in Pengaturan Sistem.
 */
const NILAI_INSTITUSI = ['Berilmu', 'Berbahasa', 'Berdaya'];

/**
 * Two soft, oversized tonal circles bleeding off the panel edges — a quiet
 * decorative wash behind the brand copy, not a literal shape to read.
 */
function CircleBackdrop() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-[-18%] right-[-22%] h-[65%] w-[65%] rounded-full bg-white/[0.06]" />
            <div className="absolute top-[8%] right-[-10%] h-[42%] w-[42%] rounded-full bg-white/[0.08]" />
        </div>
    );
}

/**
 * The logo an admin uploaded in Pengaturan Sistem, on a white plate — an
 * institutional logo is authored for light backgrounds and would disappear
 * against the green panel. Falls back to the built-in mark.
 */
function BrandMark({
    logoUrl,
    nama,
}: {
    logoUrl: string | null;
    nama: string;
}) {
    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
            {logoUrl ? (
                <img
                    src={logoUrl}
                    alt={`Logo ${nama}`}
                    className="h-full w-full object-contain p-1"
                />
            ) : (
                <AppLogoIcon className="h-5 w-5 text-siak-pine" />
            )}
        </div>
    );
}

export default function Login({ canResetPassword, status }: Props) {
    const { kampus, errors: pageErrors } = usePage().props;
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        login_value: '',
        password: '',
        remember: true,
    });

    // Fortify reports a failed attempt under its configured username field
    // ('email'), which is not one of this form's own fields — so it has to be
    // read off the shared page errors rather than the form helper.
    const authError =
        (pageErrors as Record<string, string>)?.email ?? errors.login_value;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => toast.success('Login berhasil'),
        });
    };

    return (
        <>
            <Head title="Masuk" />

            <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.15fr_1fr] xl:grid-cols-[1.25fr_1fr]">
                {/* Brand panel — desktop */}
                <aside className="relative hidden overflow-hidden bg-siak-pine-deep lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-20">
                    <CircleBackdrop />

                    <div className="relative z-10 flex items-center gap-3">
                        <BrandMark
                            logoUrl={kampus.logo_url}
                            nama={kampus.nama}
                        />
                        <span className="text-[11px] font-semibold tracking-[0.22em] text-white/70 uppercase">
                            Siakad
                        </span>
                    </div>

                    <div className="relative z-10 max-w-lg">
                        <p className="text-[11px] font-semibold tracking-[0.22em] text-gold-soft uppercase">
                            Portal Akademik
                        </p>
                        <h1 className="mt-5 font-display text-4xl leading-[1.12] font-semibold text-white xl:text-5xl">
                            {kampus.nama}
                        </h1>
                        <div className="mt-7 h-px w-14 bg-gold" />
                        <p className="mt-7 max-w-md text-sm leading-relaxed text-white/60">
                            Satu portal terpadu untuk perkuliahan, kartu rencana
                            studi, penilaian, dan administrasi akademik —
                            terintegrasi bagi mahasiswa, dosen, dan tenaga
                            kependidikan.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <dl className="flex flex-wrap gap-4">
                            {NILAI_INSTITUSI.map((nilai, index) => (
                                <div
                                    key={nilai}
                                    className="rounded-xl bg-white/10 px-5 py-4"
                                >
                                    <dt className="font-display text-sm text-gold-soft italic">
                                        0{index + 1}
                                    </dt>
                                    <dd className="mt-1 text-sm font-semibold tracking-wide text-white">
                                        {nilai}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-10 text-[11px] text-white/35">
                            &copy; {new Date().getFullYear()} {kampus.nama}
                        </p>
                    </div>
                </aside>

                {/* Form panel */}
                <main className="flex min-h-screen flex-col lg:min-h-0">
                    {/* Brand bar — mobile only */}
                    <div className="flex items-center gap-3 bg-siak-pine-deep px-6 py-5 lg:hidden">
                        <BrandMark
                            logoUrl={kampus.logo_url}
                            nama={kampus.nama}
                        />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                                {kampus.nama}
                            </p>
                            <p className="text-[10px] font-semibold tracking-[0.2em] text-gold-soft uppercase">
                                Portal Akademik
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-14 xl:px-20">
                        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <h2 className="font-display text-3xl font-semibold text-foreground">
                                Selamat datang
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Masuk memakai akun institusi Anda untuk
                                melanjutkan.
                            </p>

                            {status && (
                                <div className="mt-6 border-l-4 border-primary bg-accent px-4 py-3 text-sm text-accent-foreground">
                                    {status}
                                </div>
                            )}

                            {authError && (
                                <div className="mt-6 border-l-4 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                    {authError}
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="mt-8 space-y-5">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="login_value"
                                        className="text-foreground"
                                    >
                                        Email, NIM, atau NIDN
                                    </Label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="login_value"
                                            type="text"
                                            value={data.login_value}
                                            onChange={(e) =>
                                                setData(
                                                    'login_value',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="nama@kampus.ac.id"
                                            className="h-11 pl-10"
                                            aria-invalid={!!authError}
                                            autoComplete="username"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-baseline justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-foreground"
                                        >
                                            Kata Sandi
                                        </Label>
                                        {canResetPassword && (
                                            <a
                                                href="/forgot-password"
                                                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                                            >
                                                Lupa kata sandi?
                                            </a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="••••••••"
                                            className="h-11 pr-10 pl-10"
                                            aria-invalid={!!errors.password}
                                            autoComplete="current-password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            aria-label={
                                                showPassword
                                                    ? 'Sembunyikan kata sandi'
                                                    : 'Tampilkan kata sandi'
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-xs text-destructive">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) =>
                                            setData('remember', checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm font-normal text-foreground"
                                    >
                                        Ingat saya di perangkat ini
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="group h-11 w-full text-sm font-semibold"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Memproses…
                                        </>
                                    ) : (
                                        <>
                                            Masuk
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div>
                                <PasskeyVerify
                                    label="Masuk dengan Passkey"
                                    loadingLabel="Memverifikasi…"
                                    separator="Atau"
                                    separatorPosition="before"
                                />
                            </div>

                            <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
                                Belum punya akses? Hubungi BAAK atau admin
                                program studi Anda.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
