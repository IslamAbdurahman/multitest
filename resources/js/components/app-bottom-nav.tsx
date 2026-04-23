import { TelegramThemeProvider, useHaptic } from '@/components/telegram-theme-provider';
import { router, usePage } from '@inertiajs/react';
import { FileText, History, Home, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AppBottomNav() {
    const page = usePage();
    const { t } = useTranslation();
    const { impact } = useHaptic();

    const mainNavItems = [
        {
            title: t('sidebar.dashboard'),
            href: '/dashboard',
            icon: Home,
        },
        {
            title: t('sidebar.test'),
            href: '/test',
            icon: FileText,
        },
        {
            title: t('sidebar.attempt'),
            href: '/attempt',
            icon: History,
        },
        {
            title: t('sidebar.profile'),
            href: '/settings/profile',
            icon: User,
        },
    ];

    return (
        <div className="fixed right-3 left-3 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 md:hidden">
            <div className="flex h-16 items-center justify-around rounded-3xl border border-sidebar-border bg-sidebar/95 py-2 shadow-2xl backdrop-blur-2xl dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
                {mainNavItems.map((item) => {
                    const isActive = page.url.startsWith(item.href);

                    return (
                        <button
                            key={item.href}
                            onClick={() => {
                                impact('light');
                                router.visit(item.href);
                            }}
                            className={`flex flex-1 flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                                isActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-medium mt-0.5 uppercase tracking-tighter tracking-widest leading-none">
                                {item.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
