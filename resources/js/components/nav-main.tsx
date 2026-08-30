import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    item.children ? (
                        <CollapsibleItem key={item.title} item={item} isCurrentUrl={isCurrentUrl as (href: string) => boolean} />
                    ) : (
                        <SimpleItem key={item.title} item={item} isCurrentUrl={isCurrentUrl as (href: string) => boolean} />
                    )
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function SimpleItem({ item, isCurrentUrl }: { item: NavItem; isCurrentUrl: (href: string) => boolean }) {
    const isActive = isCurrentUrl(item.href as string);
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={{ children: item.title }}
                className={cn(
                    'relative transition-colors',
                    isActive &&
                        'bg-siak-pine text-white hover:bg-siak-pine-deep hover:text-white data-[active=true]:bg-siak-pine data-[active=true]:text-white',
                )}
            >
                <Link href={item.href} prefetch>
                    {isActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-white" />
                    )}
                    {item.icon && (
                        <item.icon
                            className={cn(
                                'text-sidebar-foreground/60',
                                isActive && 'text-white',
                            )}
                        />
                    )}
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function CollapsibleItem({ item, isCurrentUrl }: { item: NavItem; isCurrentUrl: (href: string) => boolean }) {
    const isParentActive = item.children?.some((child) => isCurrentUrl(child.href as string)) ?? false;
    const [open, setOpen] = useState(isParentActive);

    return (
        <SidebarMenuItem>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={{ children: item.title }}
                        className={cn(
                            'relative transition-colors',
                            isParentActive &&
                                'bg-siak-pine text-white hover:bg-siak-pine-deep hover:text-white data-[active=true]:bg-siak-pine data-[active=true]:text-white',
                        )}
                    >
                        {isParentActive && (
                            <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-white" />
                        )}
                        {item.icon && (
                            <item.icon
                                className={cn(
                                    'text-sidebar-foreground/60',
                                    isParentActive && 'text-white',
                                )}
                            />
                        )}
                        <span>{item.title}</span>
                        <ChevronRight className={cn(
                            'ml-auto h-4 w-4 transition-transform',
                            open && 'rotate-90',
                        )} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenu className="ml-4">
                        {item.children?.map((child) => {
                            const isActive = isCurrentUrl(child.href as string);
                            return (
                                <SidebarMenuItem key={child.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={{ children: child.title }}
                                        className={cn(
                                            'relative transition-colors text-sm',
                                            isActive &&
                                                'bg-siak-pine text-white hover:bg-siak-pine-deep hover:text-white data-[active=true]:bg-siak-pine data-[active=true]:text-white',
                                        )}
                                    >
                                        <Link href={child.href} prefetch>
                                            {isActive && (
                                                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-white" />
                                            )}
                                            {child.icon && (
                                                <child.icon
                                                    className={cn(
                                                        'text-sidebar-foreground/60',
                                                        isActive && 'text-white',
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
