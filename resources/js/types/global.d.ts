import type { Auth } from '@/types/auth';

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            kampus: {
                nama: string;
                /** Expiring pre-signed URL for the logo uploaded in Pengaturan Sistem. */
                logo_url: string | null;
            };
            [key: string]: unknown;
        };
    }
}
