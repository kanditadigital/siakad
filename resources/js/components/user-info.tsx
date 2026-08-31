import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';

const ROLE_LABELS: Record<User['role'], string> = {
    admin: 'Admin',
    admin_prodi: 'Admin Prodi',
    dosen: 'Dosen',
    mahasiswa: 'Mahasiswa',
    pimpinan: 'Pimpinan',
};

export function UserInfo({
    user,
    showEmail = false,
    showRole = false,
}: {
    user: User;
    showEmail?: boolean;
    showRole?: boolean;
}) {
    const getInitials = useInitials();
    const showAvatar = Boolean(user.avatar && user.avatar !== '');

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-lg">
                {showAvatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="rounded-lg text-black dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail ? (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                ) : null}
                {showRole ? (
                    <Badge variant="outline" className="mt-1 w-fit text-[11px]">
                        {ROLE_LABELS[user.role] ?? user.role}
                    </Badge>
                ) : null}
            </div>
        </>
    );
}
