import { usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';

/** Compact avatar + dropdown for the top header, replacing the old sidebar-footer account row. */
export function HeaderUserMenu() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const photoUrl = auth.user.photo_url;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex shrink-0 items-center gap-2 rounded-full outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Menu akun ${auth.user.name}`}
                >
                    <Avatar className="size-8">
                        {photoUrl ? (
                            <AvatarImage src={photoUrl} alt={auth.user.name} />
                        ) : null}
                        <AvatarFallback className="text-xs font-semibold">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-32 truncate text-sm font-medium text-foreground sm:inline">
                        {auth.user.name}
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" side="bottom">
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
