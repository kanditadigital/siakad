import { Check, GraduationCap, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    tahapan: [string, string][];
    tahapSaatIni: string;
    selesaiPada: string | null;
    /** True when exactly one of two pembimbing has approved the current tahap. */
    partialApproval?: boolean;
};

export function TahapTugasAkhirStepper({
    tahapan,
    tahapSaatIni,
    selesaiPada,
    partialApproval = false,
}: Props) {
    const currentIndex = tahapan.findIndex(([key]) => key === tahapSaatIni);

    return (
        <div className="space-y-3">
            {selesaiPada && (
                <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
                    <GraduationCap className="h-4 w-4" />
                    Tugas akhir selesai —{' '}
                    {new Date(selesaiPada).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
            )}

            {!selesaiPada && partialApproval && (
                <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
                    <RefreshCw className="h-4 w-4" />
                    Menunggu persetujuan pembimbing lainnya untuk tahap ini
                </div>
            )}

            {/* Desktop/tablet: horizontal stepper */}
            <div className="hidden sm:block">
                <div className="flex items-center">
                    {tahapan.map(([key], index) => {
                        const isDone = selesaiPada
                            ? true
                            : index < currentIndex;
                        const isCurrent =
                            !selesaiPada && index === currentIndex;
                        const isPartial = isCurrent && partialApproval;
                        const isLast = index === tahapan.length - 1;

                        return (
                            <div
                                key={key}
                                className="flex flex-1 items-center last:flex-none"
                            >
                                <div
                                    className={cn(
                                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                                        isDone &&
                                            'border-green-700 bg-green-700 text-white',
                                        isCurrent &&
                                            !isPartial &&
                                            'border-green-700 bg-white text-green-700',
                                        isPartial &&
                                            'border-amber-500 bg-amber-400 text-white',
                                        !isDone &&
                                            !isCurrent &&
                                            'border-gray-300 bg-white text-gray-400',
                                    )}
                                >
                                    {isDone ? (
                                        <Check className="h-4 w-4" />
                                    ) : isPartial ? (
                                        <RefreshCw className="h-3.5 w-3.5" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {!isLast && (
                                    <div
                                        className={cn(
                                            'mx-1 h-0.5 flex-1',
                                            isDone
                                                ? 'bg-green-700'
                                                : 'bg-gray-200',
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="mt-1.5 flex">
                    {tahapan.map(([key, label], index) => {
                        const isDone = selesaiPada
                            ? true
                            : index < currentIndex;
                        const isCurrent =
                            !selesaiPada && index === currentIndex;
                        const isPartial = isCurrent && partialApproval;

                        return (
                            <p
                                key={key}
                                className={cn(
                                    'flex-1 px-1 text-center text-xs',
                                    isPartial
                                        ? 'font-semibold text-amber-700'
                                        : isCurrent
                                          ? 'font-semibold text-green-800'
                                          : isDone
                                            ? 'text-gray-700'
                                            : 'text-muted-foreground',
                                )}
                            >
                                {label}
                            </p>
                        );
                    })}
                </div>
            </div>

            {/* Mobile: vertical stepper */}
            <div className="space-y-0 sm:hidden">
                {tahapan.map(([key, label], index) => {
                    const isDone = selesaiPada ? true : index < currentIndex;
                    const isCurrent = !selesaiPada && index === currentIndex;
                    const isPartial = isCurrent && partialApproval;
                    const isLast = index === tahapan.length - 1;

                    return (
                        <div key={key} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                                        isDone &&
                                            'border-green-700 bg-green-700 text-white',
                                        isCurrent &&
                                            !isPartial &&
                                            'border-green-700 bg-white text-green-700',
                                        isPartial &&
                                            'border-amber-500 bg-amber-400 text-white',
                                        !isDone &&
                                            !isCurrent &&
                                            'border-gray-300 bg-white text-gray-400',
                                    )}
                                >
                                    {isDone ? (
                                        <Check className="h-3.5 w-3.5" />
                                    ) : isPartial ? (
                                        <RefreshCw className="h-3 w-3" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {!isLast && (
                                    <div
                                        className={cn(
                                            'my-0.5 w-0.5 flex-1',
                                            isDone
                                                ? 'bg-green-700'
                                                : 'bg-gray-200',
                                        )}
                                        style={{ minHeight: '1.25rem' }}
                                    />
                                )}
                            </div>
                            <p
                                className={cn(
                                    'pb-4 text-sm',
                                    isPartial
                                        ? 'font-semibold text-amber-700'
                                        : isCurrent
                                          ? 'font-semibold text-green-800'
                                          : isDone
                                            ? 'text-gray-700'
                                            : 'text-muted-foreground',
                                )}
                            >
                                {label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
