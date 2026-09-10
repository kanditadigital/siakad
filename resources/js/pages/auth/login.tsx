import { Head, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    ShieldCheck,
    User,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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
 * Faint diagonal grid over the pine panel, like a campus site plan — reads as
 * texture at a glance, not a literal pattern to inspect.
 */
function GridBackdrop() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.07]"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="grid-login"
                    width="56"
                    height="56"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M56 0H0V56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-login)" />
        </svg>
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

/**
 * Text field whose label sits inside the field at rest and floats up into a
 * small caption the moment the field is focused or already holds a value —
 * so the label doubles as a placeholder without ever obscuring what's typed.
 */
function FloatingLabelField({
    id,
    label,
    icon: Icon,
    trailing,
    className,
    value,
    onFocus,
    onBlur,
    ...inputProps
}: {
    id: string;
    label: string;
    icon: LucideIcon;
    trailing?: React.ReactNode;
} & React.ComponentProps<typeof Input>) {
    const [focused, setFocused] = useState(false);
    const floated = focused || String(value ?? '').length > 0;

    return (
        <div className="relative">
            <Icon className="pointer-events-none absolute top-1/2 left-3.5 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                id={id}
                value={value}
                onFocus={(e) => {
                    setFocused(true);
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    setFocused(false);
                    onBlur?.(e);
                }}
                className={cn(
                    'h-14 pl-10',
                    trailing && 'pr-10',
                    floated ? 'pt-5 pb-1' : 'pt-0 pb-0',
                    className,
                )}
                {...inputProps}
            />
            <Label
                htmlFor={id}
                className={cn(
                    'pointer-events-none absolute left-10 origin-left transition-all duration-150 ease-out',
                    floated
                        ? 'top-3.5 -translate-y-0 text-[11px] font-semibold text-primary'
                        : 'top-1/2 -translate-y-1/2 text-sm font-normal text-muted-foreground',
                )}
            >
                {label}
            </Label>
            {trailing}
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

            <div className="grid min-h-screen lg:grid-cols-2">
                {/* Brand panel — desktop */}
                <aside className="relative hidden overflow-hidden bg-siak-pine-deep lg:flex lg:flex-col lg:justify-between lg:p-16 xl:p-20">
                    <GridBackdrop />
                    <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
                    <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />

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
                        <h1 className="mt-5 text-4xl leading-[1.12] font-semibold text-white xl:text-5xl">
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
                        <dl className="grid grid-cols-3 gap-3">
                            {NILAI_INSTITUSI.map((nilai, index) => (
                                <div
                                    key={nilai}
                                    className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-4"
                                >
                                    <dt className="text-sm font-semibold text-gold-soft">
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
                <main className="flex min-h-screen flex-col bg-background">
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

                    <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
                        <div className="w-full max-w-sm animate-in duration-500 fade-in slide-in-from-bottom-2">
                            <div className="mb-8 flex items-center gap-2 text-siak-pine">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase">
                                    Akses Aman
                                </span>
                            </div>

                            <h2 className="text-3xl font-semibold text-foreground">
                                Selamat datang kembali
                            </h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Masuk memakai akun institusi Anda untuk
                                melanjutkan.
                            </p>

                            {status && (
                                <div className="mt-6 rounded-lg border-l-4 border-primary bg-accent px-4 py-3 text-sm text-accent-foreground">
                                    {status}
                                </div>
                            )}

                            {authError && (
                                <div className="mt-6 rounded-lg border-l-4 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                    {authError}
                                </div>
                            )}

                            <form
                                onSubmit={onSubmit}
                                className="mt-8 space-y-5"
                            >
                                <FloatingLabelField
                                    id="login_value"
                                    label="Email, NIM, atau NIDN"
                                    icon={User}
                                    type="text"
                                    value={data.login_value}
                                    onChange={(e) =>
                                        setData('login_value', e.target.value)
                                    }
                                    aria-invalid={!!authError}
                                    autoComplete="username"
                                    autoFocus
                                    required
                                />

                                <div className="space-y-2">
                                    <FloatingLabelField
                                        id="password"
                                        label="Kata Sandi"
                                        icon={Lock}
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        aria-invalid={!!errors.password}
                                        autoComplete="current-password"
                                        required
                                        trailing={
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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
                                        }
                                    />
                                    <div className="flex items-center justify-between">
                                        {errors.password ? (
                                            <p className="text-xs text-destructive">
                                                {errors.password}
                                            </p>
                                        ) : (
                                            <span />
                                        )}
                                        {canResetPassword && (
                                            <a
                                                href="/forgot-password"
                                                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                                            >
                                                Lupa kata sandi?
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                'remember',
                                                checked === true,
                                            )
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
