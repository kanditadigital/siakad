import { Head, useForm } from '@inertiajs/react';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
    Fingerprint,
    GraduationCap,
    BookOpen,
    Users,
    Award,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function LeftPanel() {
    return (
        <div className="relative hidden flex-col justify-between overflow-hidden bg-siak-pine-deep p-12 lg:flex xl:p-16">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <svg
                    className="absolute -right-20 -top-20 h-[500px] w-[500px] opacity-[0.06]"
                    viewBox="0 0 500 500"
                    aria-hidden="true"
                >
                    <circle cx="250" cy="250" r="200" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold" />
                    <circle cx="250" cy="250" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
                    <circle cx="250" cy="250" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                </svg>
                <svg
                    className="absolute -bottom-32 -left-32 h-[400px] w-[400px] opacity-[0.04]"
                    viewBox="0 0 400 400"
                    aria-hidden="true"
                >
                    <polygon
                        points="200,30 240,150 370,150 265,225 305,345 200,270 95,345 135,225 30,150 160,150"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-white"
                    />
                </svg>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-white/90">
                        SIAKAD
                    </span>
                </div>
            </div>

            <div className="relative z-10 space-y-6">
                <div className="space-y-3">
                    <h2 className="font-display text-5xl leading-tight font-semibold text-white">
                        Sistem Informasi
                        <br />
                        Akademik
                    </h2>
                    <p className="max-w-md text-sm leading-relaxed text-white/50">
                        Portal terpadu untuk mengelola perkuliahan, nilai, dan
                        administrasi akademik STIT Daarurrahmah Sepadan.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {[
                        { icon: BookOpen, text: 'Kurikulum & RPS' },
                        { icon: Users, text: 'Data Mahasiswa & Dosen' },
                        { icon: Award, text: 'Penilaian & Transkrip' },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                                <Icon className="h-4.5 w-4.5 text-white/70" />
                            </div>
                            <span className="text-sm text-white/60">{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[11px] text-white/30">
                    &copy; {new Date().getFullYear()} STIT Daarurrahmah Sepadan
                </p>
            </div>
        </div>
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
            onSuccess: () => toast.success('Login berhasil'),
            onError: () => toast.error('Login gagal, periksa kredensial Anda'),
        });
    };

    return (
        <>
            <Head title="Login SIAKAD" />

            <div className="flex min-h-screen">
                <LeftPanel />

                {/* Right panel — form */}
                <div className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-10 lg:w-[45%] lg:px-16 xl:w-[45%]">
                    {/* Mobile branding */}
                    <div className="fixed top-0 right-0 left-0 flex items-center justify-between bg-background px-6 py-4 lg:hidden">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-siak-pine">
                                <GraduationCap className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-siak-pine">
                                SIAKAD
                            </span>
                        </div>
                    </div>

                    <div className="w-full max-w-lg mt-14 lg:mt-0">
                        <div className="mb-8 lg:hidden">
                            <h2 className="text-xl font-semibold text-foreground">
                                Masuk
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Akun institusi untuk sistem akademik
                            </p>
                        </div>

                        <div className="mb-8 hidden lg:block">
                            <div className="mb-5 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-siak-pine" />
                                <div className="h-1.5 w-1.5 rounded-full bg-siak-pine/40" />
                                <div className="h-1.5 w-1.5 rounded-full bg-siak-pine/20" />
                            </div>
                            <h2 className="text-2xl font-semibold text-foreground">
                                Selamat datang
                            </h2>
                            <p className="mt-1.5 text-sm text-muted-foreground">
                                Masuk dengan akun institusi Anda
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="login-username"
                                    className="text-sm font-medium text-foreground/80"
                                >
                                    Username / NIM / NIDN
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                    <Input
                                        id="login-username"
                                        type="text"
                                        placeholder="Masukkan username atau NIM/NIDN"
                                        value={data.login_value}
                                        onChange={(e) => setData('login_value', e.target.value)}
                                        className="h-12 rounded-xl border-border/60 bg-muted/40 pl-11 text-sm"
                                        aria-invalid={!!errors.login_value}
                                        autoComplete="username"
                                        required
                                    />
                                </div>
                                {errors.login_value && (
                                    <p className="text-xs text-destructive">{errors.login_value}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="login-password"
                                        className="text-sm font-medium text-foreground/80"
                                    >
                                        Password
                                    </Label>
                                    <a
                                        href="#"
                                        className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                                    >
                                        Lupa password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
                                    <Input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Masukkan password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="h-12 rounded-xl border-border/60 bg-muted/40 pl-11 pr-11 text-sm"
                                        aria-invalid={!!errors.password}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 transition-colors hover:text-foreground"
                                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="group mt-2 h-12 w-full rounded-xl text-sm font-semibold"
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

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-3 text-muted-foreground/50">atau</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-full rounded-xl text-sm font-medium"
                        >
                            <Fingerprint className="h-4 w-4" />
                            Masuk dengan Passkey
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = () => ({
    breadcrumbs: [],
});
