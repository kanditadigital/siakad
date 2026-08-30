import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff, BookOpen, MessageSquare, BarChart, GraduationCap } from 'lucide-react';

/**
 * Floating particle component for the left panel background decoration.
 * Each particle has randomized position, size, opacity, and animation duration.
 */
function FloatingParticles() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const particles = useMemo(() =>
        Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.3 + 0.1,
            duration: Math.random() * 6 + 4,
            delay: Math.random() * 4,
        })), []
    );

    if (!mounted) {
        return <div className="absolute inset-0 overflow-hidden" />;
    }

    return (
        <div className="absolute inset-0 overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-[#D4AF37]"
                    style={{
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        width: p.size,
                        height: p.size,
                        opacity: p.opacity,
                        animation: `loginFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    );
}

/**
 * Islamic geometric pattern SVG for the left panel background.
 * Uses thin gold lines to create an elegant, traditional feel.
 */
function GeometricPattern() {
    return (
        <svg
            className="absolute inset-0 h-full w-full opacity-[0.12]"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <pattern id="islamicGeo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    {/* 8-pointed star pattern */}
                    <polygon
                        points="50,10 61,35 90,35 68,52 76,80 50,64 24,80 32,52 10,35 39,35"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="0.8"
                    />
                    {/* Inner octagon */}
                    <polygon
                        points="50,25 65,35 70,50 65,65 50,75 35,65 30,50 35,35"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="0.5"
                    />
                    {/* Center diamond */}
                    <polygon
                        points="50,35 60,50 50,65 40,50"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="0.5"
                    />
                    {/* Connecting lines */}
                    <line x1="50" y1="0" x2="50" y2="10" stroke="#D4AF37" strokeWidth="0.4" />
                    <line x1="50" y1="80" x2="50" y2="100" stroke="#D4AF37" strokeWidth="0.4" />
                    <line x1="0" y1="50" x2="10" y2="35" stroke="#D4AF37" strokeWidth="0.4" />
                    <line x1="90" y1="35" x2="100" y2="50" stroke="#D4AF37" strokeWidth="0.4" />
                </pattern>
            </defs>
            <rect width="400" height="400" fill="url(#islamicGeo)" />
        </svg>
    );
}

/**
 * Enhanced 8-pointed star logo badge with refined details
 * and a soft glow effect.
 */
function LogoBadge({ className }: { className?: string }) {
    return (
        <div className={className}>
            <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                {/* Outer glow circle */}
                <circle cx="60" cy="60" r="56" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />

                {/* 8-pointed star badge */}
                <polygon
                    points="60,8 72,40 108,40 80,60 90,95 60,76 30,95 40,60 12,40 48,40"
                    fill="#0F5132"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                />

                {/* Inner circle background */}
                <circle cx="60" cy="58" r="22" fill="white" />

                {/* Mosque dome */}
                <path d="M60 38 Q68 42 68 50 L52 50 Q52 42 60 38z" fill="#0F5132" />
                {/* Minaret tip */}
                <line x1="60" y1="35" x2="60" y2="38" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                {/* Mosque body */}
                <rect x="53" y="50" width="14" height="10" fill="#0F5132" rx="1" />
                {/* Door */}
                <path d="M58 55 Q60 52 62 55 L62 60 L58 60 Z" fill="white" />

                {/* Book */}
                <rect x="49" y="62" width="22" height="14" rx="2" fill="#D4AF37" />
                <line x1="60" y1="62" x2="60" y2="76" stroke="#0F5132" strokeWidth="1" />
                {/* Book lines */}
                <line x1="52" y1="66" x2="58" y2="66" stroke="#0F5132" strokeWidth="0.5" opacity="0.5" />
                <line x1="52" y1="69" x2="57" y2="69" stroke="#0F5132" strokeWidth="0.5" opacity="0.5" />
                <line x1="62" y1="66" x2="68" y2="66" stroke="#0F5132" strokeWidth="0.5" opacity="0.5" />
                <line x1="62" y1="69" x2="67" y2="69" stroke="#0F5132" strokeWidth="0.5" opacity="0.5" />

                {/* Outer decorative ring */}
                <circle cx="60" cy="58" r="27" fill="none" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="3 3" />
            </svg>
        </div>
    );
}

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        login_value: '',
        password: '',
    });

    useEffect(() => {
        // Trigger entrance animations after mount
        const timer = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => {
                toast.success('Login berhasil');
            },
            onError: () => {
                toast.error('Login gagal, periksa credentials anda');
            },
        });
    };

    return (
        <>
            <Head title="Login SIAKAD" />

            {/* Keyframe animations */}
            <style>{`
                @keyframes loginFloat {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-12px) scale(1.1); }
                }
                @keyframes loginShimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes loginPulseRing {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.05); }
                }
            `}</style>

            <div className="flex min-h-screen">
                {/* ─────────── Left Panel ─────────── */}
                <div className="relative hidden w-[55%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
                    {/* Base gradient background */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(ellipse at 30% 50%, #14653D 0%, #0F5132 50%, #0A3D25 100%)',
                        }}
                    />

                    {/* Islamic geometric pattern overlay */}
                    <GeometricPattern />

                    {/* Floating particles */}
                    <FloatingParticles />

                    {/* Subtle vignette overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.2) 100%)',
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-16">
                        <div
                            className="flex flex-col items-center space-y-6 text-center transition-all duration-1000 ease-out"
                            style={{
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
                            }}
                        >
                            {/* Logo badge */}
                            <LogoBadge className="h-[140px] w-[140px]" />

                            {/* Text content */}
                            <div className="space-y-2">
                                <p
                                    className="text-lg tracking-wide text-white/80 transition-all delay-200 duration-700"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                                    }}
                                >
                                    Selamat Datang di
                                </p>
                                <h1
                                    className="text-[60px] font-bold leading-none tracking-tight text-white transition-all delay-300 duration-700"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                                    }}
                                >
                                    SIAKAD
                                </h1>
                                <p
                                    className="text-[22px] font-semibold text-[#D4AF37] transition-all delay-400 duration-700"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                                    }}
                                >
                                    STIT Daarurrahmah Sepadan
                                </p>
                                <div
                                    className="mx-auto mt-3 h-px w-48 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent transition-all delay-500 duration-700"
                                    style={{ opacity: mounted ? 1 : 0 }}
                                />
                                <p
                                    className="pt-1 text-sm tracking-widest text-white/50 uppercase transition-all delay-500 duration-700"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted ? 'translateY(0)' : 'translateY(10px)',
                                    }}
                                >
                                    Sistem Informasi Akademik Terintegrasi
                                </p>
                            </div>
                        </div>

                        {/* Footer values */}
                        <div
                            className="absolute bottom-10 left-0 right-0 flex justify-center transition-all delay-700 duration-700"
                            style={{
                                opacity: mounted ? 1 : 0,
                                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                            }}
                        >
                            <div className="flex items-center gap-8">
                                {[
                                    { icon: BookOpen, label: 'Berilmu' },
                                    { icon: MessageSquare, label: 'Berbahasa' },
                                    { icon: BarChart, label: 'Berdaya' },
                                ].map(({ icon: Icon, label }) => (
                                    <div
                                        key={label}
                                        className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-105"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 transition-colors duration-300 group-hover:bg-[#D4AF37]/20">
                                            <Icon className="h-4 w-4 text-[#D4AF37]" />
                                        </div>
                                        <span className="text-sm font-medium text-white/80 transition-colors duration-300 group-hover:text-white">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─────────── Right Panel ─────────── */}
                <div className="relative flex w-full flex-col items-center justify-center bg-[#FAFAF8] px-6 py-10 lg:w-[45%] lg:px-8">
                    {/* Mobile branded header (visible only on small screens) */}
                    <div className="mb-8 flex flex-col items-center lg:hidden">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F5132]">
                            <GraduationCap className="h-7 w-7 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-[#0F5132]">SIAKAD</h2>
                        <p className="text-xs text-gray-500">STIT Daarurrahmah Sepadan</p>
                    </div>

                    {/* Subtle dot grid decoration */}
                    <div className="absolute bottom-6 right-6 opacity-[0.06]">
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            {Array.from({ length: 6 }).map((_, row) =>
                                Array.from({ length: 6 }).map((_, col) => (
                                    <circle
                                        key={`${row}-${col}`}
                                        cx={col * 22 + 11}
                                        cy={row * 22 + 11}
                                        r="2"
                                        fill="#0F5132"
                                    />
                                ))
                            )}
                        </svg>
                    </div>

                    {/* Login Card */}
                    <div
                        className="w-full max-w-[420px] transition-all duration-700 ease-out"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                        }}
                    >
                        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
                            {/* Green accent top border */}
                            <div
                                className="h-1"
                                style={{
                                    background: 'linear-gradient(90deg, #0F5132 0%, #14653D 40%, #D4AF37 100%)',
                                }}
                            />

                            <div className="p-8 sm:p-10">
                                <div className="space-y-7">
                                    {/* Icon badge */}
                                    <div
                                        className="flex justify-center transition-all delay-100 duration-500"
                                        style={{
                                            opacity: mounted ? 1 : 0,
                                            transform: mounted ? 'scale(1)' : 'scale(0.8)',
                                        }}
                                    >
                                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#E8F3ED] to-[#D4EDDE]">
                                            <User className="h-6 w-6 text-[#0F5132]" />
                                            {/* Pulse ring */}
                                            <div
                                                className="absolute inset-0 rounded-full border-2 border-[#0F5132]/20"
                                                style={{ animation: 'loginPulseRing 3s ease-in-out infinite' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div
                                        className="text-center transition-all delay-200 duration-500"
                                        style={{
                                            opacity: mounted ? 1 : 0,
                                            transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                                        }}
                                    >
                                        <h2 className="text-xl font-bold text-[#0F5132]">
                                            Login ke SIAKAD
                                        </h2>
                                        <p className="mt-1.5 text-[13px] text-gray-400">
                                            Masuk untuk mengakses sistem akademik
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={onSubmit} className="space-y-5">
                                        {/* Username field */}
                                        <div
                                            className="space-y-2 transition-all delay-300 duration-500"
                                            style={{
                                                opacity: mounted ? 1 : 0,
                                                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                                            }}
                                        >
                                            <label className="text-sm font-medium text-gray-600">
                                                Username / NIM / NIDN
                                            </label>
                                            <div className="group relative">
                                                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300 transition-colors duration-200 group-focus-within:text-[#0F5132]" />
                                                <Input
                                                    id="login-username"
                                                    type="text"
                                                    placeholder="Masukkan username atau NIM/NIDN"
                                                    value={data.login_value}
                                                    onChange={(e) => setData('login_value', e.target.value)}
                                                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 text-sm transition-all duration-200 placeholder:text-gray-300 focus:border-[#0F5132] focus:bg-white focus:ring-[#0F5132]/10"
                                                    required
                                                />
                                            </div>
                                            {errors.login_value && (
                                                <p className="text-sm text-red-500">{errors.login_value}</p>
                                            )}
                                        </div>

                                        {/* Password field */}
                                        <div
                                            className="space-y-2 transition-all delay-400 duration-500"
                                            style={{
                                                opacity: mounted ? 1 : 0,
                                                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                                            }}
                                        >
                                            <label className="text-sm font-medium text-gray-600">
                                                Password
                                            </label>
                                            <div className="group relative">
                                                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300 transition-colors duration-200 group-focus-within:text-[#0F5132]" />
                                                <Input
                                                    id="login-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Masukkan password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 pl-11 pr-11 text-sm transition-all duration-200 placeholder:text-gray-300 focus:border-[#0F5132] focus:bg-white focus:ring-[#0F5132]/10"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-300 transition-colors duration-200 hover:text-gray-500"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-sm text-red-500">{errors.password}</p>
                                            )}
                                        </div>

                                        {/* Forgot password */}
                                        <div
                                            className="text-right transition-all delay-500 duration-500"
                                            style={{
                                                opacity: mounted ? 1 : 0,
                                            }}
                                        >
                                            <a
                                                href="#"
                                                className="text-[13px] font-medium text-[#0F5132]/70 transition-colors duration-200 hover:text-[#0F5132] hover:underline"
                                            >
                                                Lupa Password?
                                            </a>
                                        </div>

                                        {/* Submit button */}
                                        <div
                                            className="transition-all delay-500 duration-500"
                                            style={{
                                                opacity: mounted ? 1 : 0,
                                                transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                                            }}
                                        >
                                            <Button
                                                id="login-submit"
                                                type="submit"
                                                disabled={processing}
                                                className="group relative h-12 w-full overflow-hidden rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
                                                style={{
                                                    background: 'linear-gradient(135deg, #0F5132 0%, #14653D 50%, #0F5132 100%)',
                                                }}
                                            >
                                                {/* Shimmer effect */}
                                                <span
                                                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                                    style={{
                                                        background:
                                                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                                                        animation: 'loginShimmer 2s ease-in-out infinite',
                                                    }}
                                                />
                                                <span className="relative flex items-center justify-center gap-2">
                                                    {processing ? (
                                                        <svg
                                                            className="h-4 w-4 animate-spin"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            />
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <Lock className="h-4 w-4" />
                                                    )}
                                                    {processing ? 'Memproses...' : 'Login ke SIAKAD'}
                                                </span>
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Footer text */}
                        <p
                            className="mt-6 text-center text-xs text-gray-300 transition-all delay-700 duration-500"
                            style={{ opacity: mounted ? 1 : 0 }}
                        >
                            © {new Date().getFullYear()} STIT Daarurrahmah Sepadan. All rights reserved.
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
