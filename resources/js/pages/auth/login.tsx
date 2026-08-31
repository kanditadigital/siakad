import { Head, useForm } from '@inertiajs/react';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    BookOpen,
    MessageSquare,
    BarChart3,
    Loader2,
    ArrowRight,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Static geometric motif for the left panel. A single low-opacity pattern —
 * no animation, no particles — used as institutional texture rather than
 * decoration for its own sake.
 */
function GeometricPattern() {
    return (
        <svg
            className="absolute inset-0 h-full w-full opacity-[0.06]"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            <defs>
                <pattern
                    id="islamicGeo"
                    x="0"
                    y="0"
                    width="100"
                    height="100"
                    patternUnits="userSpaceOnUse"
                >
                    <polygon
                        points="50,10 61,35 90,35 68,52 76,80 50,64 24,80 32,52 10,35 39,35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.8"
                    />
                    <polygon
                        points="50,25 65,35 70,50 65,65 50,75 35,65 30,50 35,35"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                    />
                </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#islamicGeo)" />
        </svg>
    );
}

/**
 * Institutional emblem — a mosque/book motif inside an 8-pointed star.
 * Solid fills only, no glow/blur filters.
 */
function LogoBadge({
    className,
    style,
}: {
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className={className} style={style}>
            <svg viewBox="0 0 120 120" className="h-full w-full">
                <polygon
                    points="60,8 72,40 108,40 80,60 90,95 60,76 30,95 40,60 12,40 48,40"
                    fill="var(--color-siak-pine-deep)"
                    stroke="var(--color-gold)"
                    strokeWidth="1.5"
                />
                <circle cx="60" cy="58" r="22" fill="white" />
                <path
                    d="M60 38 Q68 42 68 50 L52 50 Q52 42 60 38z"
                    fill="var(--color-siak-pine-deep)"
                />
                <line
                    x1="60"
                    y1="35"
                    x2="60"
                    y2="38"
                    stroke="var(--color-gold)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <rect
                    x="53"
                    y="50"
                    width="14"
                    height="10"
                    fill="var(--color-siak-pine-deep)"
                    rx="1"
                />
                <path d="M58 55 Q60 52 62 55 L62 60 L58 60 Z" fill="white" />
                <rect
                    x="49"
                    y="62"
                    width="22"
                    height="14"
                    rx="2"
                    fill="var(--color-gold)"
                />
                <line
                    x1="60"
                    y1="62"
                    x2="60"
                    y2="76"
                    stroke="var(--color-siak-pine-deep)"
                    strokeWidth="1"
                />
            </svg>
        </div>
    );
}

const NILAI_INSTITUSI = [
    { icon: BookOpen, label: 'Berilmu' },
    { icon: MessageSquare, label: 'Berbahasa' },
    { icon: BarChart3, label: 'Berdaya' },
];

/**
 * Editorial input: underline-only field, no bordered box. Reserved for this
 * page — the app-wide `Input` keeps its bordered default everywhere else.
 */
function FieldInput(props: React.ComponentProps<typeof Input>) {
    return (
        <Input
            {...props}
            className={cn(
                'h-11 rounded-none border-0 border-b-2 border-border bg-transparent px-0 text-base shadow-none placeholder:text-muted-foreground/60 focus-visible:border-b-siak-pine focus-visible:ring-0',
                'aria-invalid:border-b-destructive',
                props.className,
            )}
        />
    );
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        login_value: '',
        password: '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => {
                toast.success('Login berhasil');
            },
            onError: () => {
                toast.error('Login gagal, periksa kredensial Anda');
            },
        });
    };

    return (
        <>
            <Head title="Login SIAKAD" />

            {/* One considered page-load reveal — a staggered fade+rise, nothing more. */}
            <style>{`
                @keyframes login-reveal {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .login-reveal {
                    animation: login-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
            `}</style>

            <div className="flex min-h-screen">
                {/* Left panel — institutional identity, solid color, no gradient. Asymmetric
                    58/42 split and an inset plaque frame stand in for the usual flat
                    split-screen so it reads as a credential, not a SaaS template. */}
                <div className="relative hidden w-[58%] flex-col overflow-hidden bg-siak-pine-deep lg:flex">
                    <GeometricPattern />

                    {/* Inset frame, offset from the edges like a plaque border */}
                    <div className="pointer-events-none absolute inset-10 border border-gold/25" />

                    <div className="relative z-10 flex h-full flex-col justify-between px-20 py-16">
                        <p
                            className="login-reveal text-xs tracking-[0.25em] text-white/50 uppercase"
                            style={{ animationDelay: '0ms' }}
                        >
                            Sistem Informasi Akademik
                        </p>

                        <div>
                            <LogoBadge
                                className="login-reveal mb-8 h-20 w-20"
                                style={{ animationDelay: '60ms' }}
                            />

                            <p
                                className="login-reveal text-sm tracking-widest text-gold-soft uppercase"
                                style={{ animationDelay: '120ms' }}
                            >
                                Selamat Datang di
                            </p>
                            <h1
                                className="login-reveal mt-2 font-display text-7xl leading-[0.95] font-semibold text-white"
                                style={{ animationDelay: '180ms' }}
                            >
                                SIAKAD
                            </h1>

                            <div
                                className="login-reveal mt-6 h-px w-24 bg-gold"
                                style={{ animationDelay: '260ms' }}
                            />

                            <p
                                className="login-reveal mt-6 max-w-sm font-display text-xl text-white/90 italic"
                                style={{ animationDelay: '320ms' }}
                            >
                                STIT Daarurrahmah Sepadan
                            </p>
                            <p
                                className="login-reveal mt-3 max-w-sm text-sm leading-relaxed text-white/50"
                                style={{ animationDelay: '380ms' }}
                            >
                                Portal akademik terpadu untuk mahasiswa,
                                dosen, dan tenaga kependidikan.
                            </p>
                        </div>

                        <div
                            className="login-reveal flex items-center gap-10 border-t border-white/10 pt-8"
                            style={{ animationDelay: '440ms' }}
                        >
                            {NILAI_INSTITUSI.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2.5"
                                >
                                    <Icon className="h-4 w-4 text-gold-soft" />
                                    <span className="text-sm font-medium text-white/70">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right panel — login form, editorial rather than boxed */}
                <div className="flex w-full flex-col items-center justify-center bg-background px-6 py-10 lg:w-[42%] lg:px-16">
                    {/* Mobile-only branded header */}
                    <div className="mb-10 flex flex-col items-center lg:hidden">
                        <LogoBadge className="mb-3 h-14 w-14" />
                        <h2 className="font-display text-xl font-semibold text-siak-pine">
                            SIAKAD
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            STIT Daarurrahmah Sepadan
                        </p>
                    </div>

                    <div
                        className="login-reveal w-full max-w-[360px]"
                        style={{ animationDelay: '160ms' }}
                    >
                        <div className="mb-8 h-[3px] w-10 bg-siak-pine" />

                        <h2 className="font-display text-3xl font-semibold text-foreground">
                            Masuk
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Gunakan akun institusi Anda untuk mengakses
                            sistem akademik.
                        </p>

                        <form
                            onSubmit={onSubmit}
                            className="mt-10 space-y-7"
                        >
                            <div className="space-y-2">
                                <Label
                                    htmlFor="login-username"
                                    className="text-xs tracking-widest text-muted-foreground uppercase"
                                >
                                    Username / NIM / NIDN
                                </Label>
                                <div className="relative">
                                    <FieldInput
                                        id="login-username"
                                        type="text"
                                        placeholder="Masukkan username atau NIM/NIDN"
                                        value={data.login_value}
                                        onChange={(e) =>
                                            setData(
                                                'login_value',
                                                e.target.value,
                                            )
                                        }
                                        className="pr-8"
                                        aria-invalid={!!errors.login_value}
                                        required
                                    />
                                    <User className="absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                                </div>
                                {errors.login_value && (
                                    <p className="text-sm text-destructive">
                                        {errors.login_value}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="login-password"
                                        className="text-xs tracking-widest text-muted-foreground uppercase"
                                    >
                                        Password
                                    </Label>
                                    <a
                                        href="#"
                                        className="text-xs font-medium text-siak-pine hover:underline"
                                    >
                                        Lupa Password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <FieldInput
                                        id="login-password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="Masukkan password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData(
                                                'password',
                                                e.target.value,
                                            )
                                        }
                                        className="pr-8"
                                        aria-invalid={!!errors.password}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute top-1/2 right-0 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground"
                                        aria-label={
                                            showPassword
                                                ? 'Sembunyikan password'
                                                : 'Tampilkan password'
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
                                    <p className="text-sm text-destructive">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <Button
                                id="login-submit"
                                type="submit"
                                disabled={processing}
                                className="group h-11 w-full rounded-md bg-siak-pine text-sm font-semibold tracking-wide uppercase hover:bg-siak-pine-deep"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        Masuk
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <p className="mt-10 text-xs text-muted-foreground">
                            © {new Date().getFullYear()} STIT Daarurrahmah
                            Sepadan. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = () => ({
    breadcrumbs: [],
});
