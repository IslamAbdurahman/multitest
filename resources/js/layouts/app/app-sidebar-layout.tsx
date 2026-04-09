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
        <AppShell variant={isMobile ? "header" : "sidebar"}>
            {!isMobile && <AppSidebar />}
            <AppContent variant={isMobile ? "header" : "sidebar"} className={`${isMobile ? 'pb-20 pt-16' : 'pb-14 md:pb-0'} w-100`}>

                {!isMobile && (
                    <div className={'mb-14'}>
                        <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    </div>
                )}

                {isMobile && (
                    <div className="fixed top-0 right-0 z-[100] p-4">
                        <LanguageBar />
                    </div>
                )}

                <div className={isMobile ? 'px-4' : ''}>
                    {children}
                </div>
            </AppContent>

            {isMobile && <AppBottomNav />}

        </AppShell>
    );
}
