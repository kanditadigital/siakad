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

/**
 * Resting shape of every nav row. The hover wash is deliberately a translucent
 * white rather than the primitive's default white pill: reserving the solid
 * pill for the *active* row is what keeps the panel calm while the pointer
 * moves through it.
 */
const ITEM =
    'relative h-9 rounded-md px-3 text-[13px] font-normal transition-colors hover:bg-white/10 hover:text-white';

/** Active row: solid white pill + dark label. No left rail — against the dark panel the pill is already the loudest thing in the sidebar, and doubling the treatment reads as noise. */
const AKTIF =
    'bg-sidebar-accent font-medium text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground';

/**
 * Top-level rows only (active or just hovered): squares off the right
 * corners and bleeds the row's width 0.75rem (the group's right padding)
 * past its normal right edge so it reaches the sidebar's true border — the
 * hover wash and the active pill both read flush against the panel edge
 * instead of stopping short at the group's padding. A trailing margin can't
 * do this — a 100%-width block's right edge is fixed by its container
 * regardless of margin — so the box itself has to be widened. Applied
 * unconditionally (not just when active) so hover reaches the same edge;
 * it's invisible until a background shows since the extra width has no
 * fill on its own. Reverts to the plain rounded square button in
 * icon-collapsed mode, where there's no edge to bleed into.
 */
const UTAMA =
    'w-[calc(100%+0.75rem)] rounded-r-none group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:rounded-md';

/** Icon colour for an inactive row — translucent white, legible on the dark panel. */
const IKON_TIDAK_AKTIF = 'text-sidebar-foreground/70';
/** Icon colour for an active row — the sidebar's own green, read against the white pill. */
const IKON_AKTIF = 'text-sidebar';

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup
                    key={group.label}
                    // px-2 when collapsed so the 32px icon buttons land centred
                    // in the 48px rail instead of hugging its left edge.
                    className="px-3 py-0 group-data-[collapsible=icon]:px-2"
                >
                    <SidebarGroupLabel className="h-auto px-3 pb-1.5 text-[10px] font-medium tracking-[0.14em] text-sidebar-foreground/45 uppercase">
                        {group.label}
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-0.5">
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

function LencanaJumlah({ jumlah }: { jumlah: number }) {
    return (
        <span className="ml-auto rounded-full bg-kpi-keuangan px-1.5 py-px text-[10px] font-semibold tabular-nums text-white">
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
                className={cn(ITEM, UTAMA, isActive && AKTIF)}
            >
                <Link href={item.href} prefetch>
                    {item.icon && (
                        <item.icon
                            className={cn(
                                IKON_TIDAK_AKTIF,
                                isActive && IKON_AKTIF,
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
                        className={cn(ITEM, UTAMA, isParentActive && AKTIF)}
                    >
                        {item.icon && (
                            <item.icon
                                className={cn(
                                    IKON_TIDAK_AKTIF,
                                    isParentActive && IKON_AKTIF,
                                )}
                            />
                        )}
                        <span>{item.title}</span>
                        {item.badge ? (
                            <LencanaJumlah jumlah={item.badge} />
                        ) : null}
                        <ChevronRight
                            className={cn(
                                'size-3.5 transition-transform duration-200',
                                isParentActive
                                    ? 'text-sidebar-accent-foreground/60'
                                    : 'text-sidebar-foreground/45',
                                item.badge ? 'ml-1' : 'ml-auto',
                                open && 'rotate-90',
                            )}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenu className="my-0.5 ml-[1.3rem] gap-0.5 border-l border-white/15 pl-2 group-data-[collapsible=icon]:hidden">
                        {item.children?.map((child) => {
                            const isActive = isCurrentUrl(child.href as string);

                            return (
                                <SidebarMenuItem key={child.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={{ children: child.title }}
                                        className={cn(
                                            ITEM,
                                            'h-8 text-[12.5px]',
                                            isActive && AKTIF,
                                        )}
                                    >
                                        <Link href={child.href} prefetch>
                                            {child.icon && (
                                                <child.icon
                                                    className={cn(
                                                        IKON_TIDAK_AKTIF,
                                                        isActive && IKON_AKTIF,
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
