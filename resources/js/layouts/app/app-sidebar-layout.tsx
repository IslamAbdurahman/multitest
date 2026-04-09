import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
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
            <AppContent variant={isMobile ? "header" : "sidebar"} className="pb-14 md:pb-0 w-100" >

                {!isMobile && (
                    <div className={'mb-14'}>
                        <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    </div>
                )}

                <div className={isMobile ? 'pt-4 px-4' : ''}>
                    {children}
                </div>
            </AppContent>

            {isMobile && <AppBottomNav />}

        </AppShell>
    );
}
