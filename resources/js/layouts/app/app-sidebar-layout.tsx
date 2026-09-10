import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell>
            <AppSidebar />
            <AppContent className="min-w-0 overflow-x-clip bg-card">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="px-4 py-6 sm:px-6">{children}</div>
            </AppContent>
        </AppShell>
    );
}
