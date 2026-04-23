import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import LanguageBar from '@/components/language';
import { type BreadcrumbItem } from '@/types';

import { type PropsWithChildren } from 'react';
import { AppBottomNav } from '@/components/app-bottom-nav';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[]
}>) {
    const isMobile = useIsMobile();

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="w-full overflow-x-hidden pb-[calc(5rem+env(safe-area-inset-bottom))] pt-16 md:pb-0 md:pt-0">

                <div className="md:mb-14">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                </div>

                <div className="px-4 md:px-0">
                    {children}
                </div>
            </AppContent>

            {isMobile && <AppBottomNav />}

        </AppShell>
    );
}
