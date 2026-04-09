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
        <div className="fixed right-0 bottom-0 left-0 z-50 glass-effect bg-background/80 border-t md:hidden pb-safe">
            <div className="flex items-center justify-around py-2 h-16">
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
