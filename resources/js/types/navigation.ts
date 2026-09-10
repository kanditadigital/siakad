import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
    /** Count shown as a pill on the right of the item; hidden when 0/undefined. */
    badge?: number;
};

/**
 * A labelled block of sidebar items ("MENU UTAMA", "SISTEM"). Grouping is what
 * keeps a 20-item admin menu scannable.
 */
export type NavGroup = {
    label: string;
    items: NavItem[];
};
