import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue: string;
    children: React.ReactNode;
}

function Tabs({ defaultValue, children, className, ...props }: TabsProps) {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn('w-full', className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

function TabsList({ children, className, ...props }: TabsListProps) {
    return (
        <div
            className={cn(
                'inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    children: React.ReactNode;
}

function TabsTrigger({ value, children, className, ...props }: TabsTriggerProps) {
    const { activeTab, setActiveTab } = useTabs();
    const isActive = activeTab === value;

    return (
        <button
            type="button"
            className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                isActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'hover:bg-background/50 hover:text-foreground',
                className
            )}
            onClick={() => setActiveTab(value)}
            {...props}
        >
            {children}
        </button>
    );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    children: React.ReactNode;
}

function TabsContent({ value, children, className, ...props }: TabsContentProps) {
    const { activeTab } = useTabs();

    if (activeTab !== value) {
        return null;
    }

    return (
        <div
            className={cn(
                'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
