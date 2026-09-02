export type UserRole = 'admin' | 'admin_prodi' | 'dosen' | 'mahasiswa' | 'pimpinan';

export type User = {
    id: number;
    name: string;
    email: string;
    photo?: string | null;
    /** Expiring pre-signed URL for `photo`; the uploads bucket is private. */
    photo_url?: string | null;
    email_verified_at: string | null;
    role: UserRole;
    nim?: string;
    nidn?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
