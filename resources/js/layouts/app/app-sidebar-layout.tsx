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
            <AppContent variant="sidebar" className={`${isMobile ? 'pb-20 pt-16 overflow-x-hidden' : 'pb-14 md:pb-0'} w-full`}>

                <div className={'mb-14'}>
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                </div>

                <div className={isMobile ? 'px-4' : ''}>
                    {children}
                </div>
            </AppContent>

            {isMobile && <AppBottomNav />}

        </AppShell>
    );
}
