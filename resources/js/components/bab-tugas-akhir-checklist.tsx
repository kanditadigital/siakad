import { router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type Bab = {
    id: number;
    uuid: string;
    nama: string;
    selesai: boolean;
    selesai_pada: string | null;
};

type Props = {
    bab: Bab[];
    /** Present only for the dosen (pembimbing) view — omit to render read-only. */
    bimbinganUuid?: string;
};

export function BabTugasAkhirChecklist({ bab, bimbinganUuid }: Props) {
    const editable = Boolean(bimbinganUuid);

    const form = useForm({ nama: '' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();

        if (!bimbinganUuid) {
            return;
        }

        form.post(`/dosen/bimbingan-tugas-akhir/${bimbinganUuid}/bab`, {
            preserveScroll: true,
            onSuccess: () => form.reset('nama'),
        });
    };

    const handleToggle = (item: Bab) => {
        if (!bimbinganUuid) {
            return;
        }

        router.patch(
            `/dosen/bimbingan-tugas-akhir/${bimbinganUuid}/bab/${item.uuid}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const handleDelete = (item: Bab) => {
        if (!bimbinganUuid) {
            return;
        }

        router.delete(
            `/dosen/bimbingan-tugas-akhir/${bimbinganUuid}/bab/${item.uuid}`,
            { preserveScroll: true },
        );
    };

    const selesaiCount = bab.filter((item) => item.selesai).length;

    return (
        <div className="space-y-3">
            {bab.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    {selesaiCount} dari {bab.length} selesai
                </p>
            )}

            {bab.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">
                    Belum ada item bab
                </p>
            ) : (
                <ul className="space-y-1.5">
                    {bab.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-2 rounded-md border px-3 py-2"
                        >
                            <Checkbox
                                checked={item.selesai}
                                disabled={!editable}
                                onCheckedChange={() => handleToggle(item)}
                            />
                            <span
                                className={cn(
                                    'flex-1 text-sm',
                                    item.selesai
                                        ? 'text-muted-foreground line-through'
                                        : 'text-gray-900',
                                )}
                            >
                                {item.nama}
                            </span>
                            {editable && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    title="Hapus item"
                                    onClick={() => handleDelete(item)}
                                >
                                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {editable && (
                <form
                    onSubmit={handleAdd}
                    className="flex items-center gap-2"
                >
                    <Input
                        placeholder="Tambah item, mis. Bab 6"
                        value={form.data.nama}
                        onChange={(e) => form.setData('nama', e.target.value)}
                        aria-invalid={!!form.errors.nama}
                        className="h-9"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        disabled={form.processing}
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </Button>
                </form>
            )}
            {editable && form.errors.nama && (
                <p className="text-sm text-destructive">
                    {form.errors.nama}
                </p>
            )}
        </div>
    );
}
