import { useTelegram } from '@/hooks/use-telegram';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface TMALayoutProps {
    children: ReactNode;
    header?: ReactNode;
    footer?: ReactNode;
    className?: string;
    desktopAside?: ReactNode;
}

const TMALayout: React.FC<TMALayoutProps> = ({ children, header, footer, className, desktopAside }) => {
    const { isTelegram } = useTelegram();

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background text-foreground">
            {/* Mobile Interface */}
            <div className={cn('flex flex-1 flex-col lg:hidden', className)}>
                {/* Header */}
                {header && (
                    <header
                        className="shrink-0 border-b border-border bg-card shadow-sm"
                        style={{
                            paddingTop: 'calc(1rem + var(--tg-safe-area-inset-top, env(safe-area-inset-top, 0px)))',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            paddingBottom: '1rem',
                        }}
                    >
                        {header}
                    </header>
                )}

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto outline-none">
                    <div className="container mx-auto px-4 py-6">{children}</div>
                </main>

                {/* Footer */}
                {footer && (
                    <footer
                        className="mt-auto shrink-0 border-t border-border bg-card shadow-sm"
                        style={{
                            paddingBottom: 'calc(1rem + var(--tg-safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)))',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            paddingTop: '1rem',
                        }}
                    >
                        {footer}
                    </footer>
                )}
            </div>

            {/* Desktop Interface (lg screens and up) */}
            <div className="hidden min-h-screen flex-row lg:flex">
                {/* Side Navigation or Info Sidebar */}
                <aside className="w-1/4 border-r border-border bg-card p-6 min-h-screen">
                    {desktopAside || (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold tracking-tight">Desktop View</h2>
                            <p className="text-muted-foreground">This is how your app looks on wider screens. You can add a sidebar here.</p>
                        </div>
                    )}
                </aside>

                {/* Main Content Area (Central Column) */}
                <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-10">
                    <div className="mx-auto max-w-4xl space-y-10">
                        <div className="rounded-2xl border border-border bg-background p-8 shadow-xl">
                            {header && <div className="mb-6 border-b border-border pb-6">{header}</div>}
                            {children}
                            {footer && <div className="mt-8 border-t border-border pt-6">{footer}</div>}
                        </div>
                    </div>
                </main>

                {/* Optional Right Panel */}
                <aside className="w-1/4 border-l border-border bg-card p-6 min-h-screen">
                   <div className="rounded-xl border border-dashed border-border p-4">
                       <p className="text-sm italic text-muted-foreground">Additional Context or Help Section</p>
                   </div>
                </aside>
            </div>
        </div>
    );
};

export default TMALayout;
