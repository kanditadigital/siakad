import { CheckCircle2, MessageSquare, Pencil, RotateCcw } from 'lucide-react';

type Entry = {
    id: number;
    tipe: string;
    tahap: string | null;
    catatan: string | null;
    created_at: string;
    dibuat_oleh: { name: string } | null;
};

type Props = {
    entries: Entry[];
    tahapan: [string, string][];
};

const TIPE_META: Record<
    string,
    { icon: typeof CheckCircle2; badge: string; label: string }
> = {
    selesai: {
        icon: CheckCircle2,
        badge: 'bg-green-100 text-green-700',
        label: 'Tahap selesai',
    },
    revisi: {
        icon: RotateCcw,
        badge: 'bg-amber-100 text-amber-700',
        label: 'Revisi',
    },
    ganti_judul: {
        icon: Pencil,
        badge: 'bg-blue-100 text-blue-700',
        label: 'Ganti judul',
    },
    catatan: {
        icon: MessageSquare,
        badge: 'bg-gray-100 text-gray-600',
        label: 'Catatan',
    },
};

export function ProgressTugasAkhirTimeline({ entries, tahapan }: Props) {
    const tahapLabel = (key: string | null) =>
        tahapan.find(([k]) => k === key)?.[1] ?? key;

    if (entries.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada aktivitas progress
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map((entry) => {
                const meta = TIPE_META[entry.tipe] ?? TIPE_META.catatan;
                const Icon = meta.icon;

                return (
                    <div
                        key={entry.id}
                        className="flex gap-3 rounded-lg border p-3"
                    >
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.badge}`}
                        >
                            <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                                <p className="text-sm font-medium text-gray-900">
                                    {meta.label}
                                    {entry.tahap && (
                                        <span className="font-normal text-muted-foreground">
                                            {' '}
                                            — {tahapLabel(entry.tahap)}
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        entry.created_at,
                                    ).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {entry.catatan && (
                                <p className="text-sm break-words text-gray-700">
                                    {entry.catatan}
                                </p>
                            )}
                            {entry.dibuat_oleh && (
                                <p className="text-xs text-muted-foreground">
                                    oleh {entry.dibuat_oleh.name}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
