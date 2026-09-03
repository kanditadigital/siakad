import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/types';

/** Active-item treatment: soft green wash + green label, on a white sidebar. */
const AKTIF =
    'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground';

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup key={group.label} className="px-2 py-0">
                    <SidebarGroupLabel className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground uppercase">
                        {group.label}
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) =>
                            item.children ? (
                                <CollapsibleItem
                                    key={item.title}
                                    item={item}
                                    isCurrentUrl={
                                        isCurrentUrl as (
                                            href: string,
                                        ) => boolean
                                    }
                                />
                            ) : (
                                <SimpleItem
                                    key={item.title}
                                    item={item}
                                    isCurrentUrl={
                                        isCurrentUrl as (
                                            href: string,
                                        ) => boolean
                                    }
                                />
                            ),
                        )}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}

/** Left rail marking the active item — the wash alone is too soft to anchor the eye. */
function PenandaAktif() {
    return (
        <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-full bg-sidebar-accent-foreground" />
    );
}

function LencanaJumlah({ jumlah }: { jumlah: number }) {
    return (
        <span className="ml-auto rounded-full bg-kpi-keuangan px-1.5 py-px text-[10px] font-bold tabular-nums text-white">
            {jumlah > 99 ? '99+' : jumlah}
        </span>
    );
}

function SimpleItem({
    item,
    isCurrentUrl,
}: {
    item: NavItem;
    isCurrentUrl: (href: string) => boolean;
}) {
    const isActive = isCurrentUrl(item.href as string);

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: item.title }}
                className={cn('relative transition-colors', isActive && AKTIF)}
            >
                <Link href={item.href} prefetch>
                    {isActive && <PenandaAktif />}
                    {item.icon && (
                        <item.icon
                            className={cn(
                                'text-muted-foreground',
                                isActive && 'text-sidebar-accent-foreground',
                            )}
                        />
                    )}
                    <span>{item.title}</span>
                    {item.badge ? <LencanaJumlah jumlah={item.badge} /> : null}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function CollapsibleItem({
    item,
    isCurrentUrl,
}: {
    item: NavItem;
    isCurrentUrl: (href: string) => boolean;
}) {
    const isParentActive =
        item.children?.some((child) => isCurrentUrl(child.href as string)) ??
        false;
    const [open, setOpen] = useState(isParentActive);

    return (
        <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={{ children: item.title }}
                        className={cn(
                            'relative transition-colors',
                            isParentActive && AKTIF,
                        )}
                    >
                        {isParentActive && <PenandaAktif />}
                        {item.icon && (
                            <item.icon
                                className={cn(
                                    'text-muted-foreground',
                                    isParentActive &&
                                        'text-sidebar-accent-foreground',
                                )}
                            />
                        )}
                        <span>{item.title}</span>
                        {item.badge ? (
                            <LencanaJumlah jumlah={item.badge} />
                        ) : null}
                        <ChevronRight
                            className={cn(
                                'h-4 w-4 text-muted-foreground transition-transform',
                                item.badge ? 'ml-1' : 'ml-auto',
                                open && 'rotate-90',
                            )}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenu className="my-0.5 ml-[1.15rem] gap-0.5 border-l border-sidebar-border pl-2 group-data-[collapsible=icon]:hidden">
                        {item.children?.map((child) => {
                            const isActive = isCurrentUrl(child.href as string);

                            return (
                                <SidebarMenuItem key={child.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={{ children: child.title }}
                                        className={cn(
                                            'relative text-sm transition-colors',
                                            isActive && AKTIF,
                                        )}
                                    >
                                        <Link href={child.href} prefetch>
                                            {isActive && <PenandaAktif />}
                                            {child.icon && (
                                                <child.icon
                                                    className={cn(
                                                        'text-muted-foreground',
                                                        isActive &&
                                                            'text-sidebar-accent-foreground',
                                                    )}
                                                />
                                            )}
                                            <span>{child.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
