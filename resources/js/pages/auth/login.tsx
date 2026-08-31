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
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Static geometric motif for the left panel. A single low-opacity pattern —
 * no animation, no particles — used as institutional texture rather than
 * decoration for its own sake.
 */
function GeometricPattern() {
    return (
        <svg
            className="absolute inset-0 h-full w-full opacity-[0.07]"
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
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .login-reveal {
                    animation: login-reveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
            `}</style>

            <div className="flex min-h-screen">
                {/* Left panel — institutional identity, solid color, no gradient */}
                <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden bg-siak-pine lg:flex">
                    <GeometricPattern />

                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-16">
                        <div className="flex flex-col items-center space-y-6 text-center">
                            <LogoBadge
                                className="login-reveal h-32 w-32"
                                style={{ animationDelay: '0ms' }}
                            />

                            <div className="space-y-2">
                                <p
                                    className="login-reveal text-sm tracking-widest text-white/70 uppercase"
                                    style={{ animationDelay: '80ms' }}
                                >
                                    Selamat Datang di
                                </p>
                                <h1
                                    className="login-reveal font-display text-6xl leading-none font-semibold text-white"
                                    style={{ animationDelay: '140ms' }}
                                >
                                    SIAKAD
                                </h1>
                                <p
                                    className="login-reveal font-display text-lg text-gold-soft italic"
                                    style={{ animationDelay: '220ms' }}
                                >
                                    STIT Daarurrahmah Sepadan
                                </p>
                                <div
                                    className="login-reveal mx-auto mt-4 h-px w-40 bg-white/20"
                                    style={{ animationDelay: '300ms' }}
                                />
                                <p
                                    className="login-reveal pt-1 text-xs tracking-widest text-white/50 uppercase"
                                    style={{ animationDelay: '340ms' }}
                                >
                                    Sistem Informasi Akademik Terintegrasi
                                </p>
                            </div>
                        </div>

                        <div
                            className="login-reveal absolute right-0 bottom-12 left-0 flex justify-center"
                            style={{ animationDelay: '420ms' }}
                        >
                            <div className="flex items-center gap-8">
                                {NILAI_INSTITUSI.map(
                                    ({ icon: Icon, label }) => (
                                        <div
                                            key={label}
                                            className="flex items-center gap-2.5"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40">
                                                <Icon className="h-4 w-4 text-gold-soft" />
                                            </div>
                                            <span className="text-sm font-medium text-white/80">
                                                {label}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel — login form */}
                <div className="flex w-full flex-col items-center justify-center bg-background px-6 py-10 lg:w-[48%] lg:px-8">
                    {/* Mobile-only branded header */}
                    <div className="mb-8 flex flex-col items-center lg:hidden">
                        <LogoBadge className="mb-3 h-14 w-14" />
                        <h2 className="font-display text-xl font-semibold text-siak-pine">
                            SIAKAD
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            STIT Daarurrahmah Sepadan
                        </p>
                    </div>

                    <div
                        className="login-reveal w-full max-w-[400px]"
                        style={{ animationDelay: '120ms' }}
                    >
                        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                            <div className="h-1 bg-siak-pine" />

                            <div className="space-y-6 p-8">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                                        <User className="h-5 w-5 text-siak-pine" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-siak-pine">
                                            Login ke SIAKAD
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Masuk untuk mengakses sistem
                                            akademik
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-username">
                                            Username / NIM / NIDN
                                        </Label>
                                        <div className="relative">
                                            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
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
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                        {errors.login_value && (
                                            <p className="text-sm text-destructive">
                                                {errors.login_value}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="login-password"
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                placeholder="Masukkan password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                className="pr-9 pl-9"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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

                                    <div className="text-right">
                                        <a
                                            href="#"
                                            className="text-sm font-medium text-siak-pine hover:underline"
                                        >
                                            Lupa Password?
                                        </a>
                                    </div>

                                    <Button
                                        id="login-submit"
                                        type="submit"
                                        disabled={processing}
                                        className="w-full"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-4 w-4" />
                                                Login ke SIAKAD
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>

                        <p className="mt-6 text-center text-xs text-muted-foreground">
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
