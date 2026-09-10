import { usePage } from '@inertiajs/react';
import type { CSSProperties, ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

type Props = {
    children: ReactNode;
};

export function AppShell({ children }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    return (
        <SidebarProvider
            defaultOpen={isOpen}
            // 240px rather than the primitive's 256px: tighter than the default
            // shadcn shell and inside the 220–230px band the reference sits in,
            // while still clearing the longest label ("Bimbingan Tugas Akhir").
            style={{ '--sidebar-width': '15rem' } as CSSProperties}
        >
            {children}
        </SidebarProvider>
    );
}
