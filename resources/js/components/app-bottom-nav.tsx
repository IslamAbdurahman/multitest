import { router, usePage } from '@inertiajs/react';
import { FileText, History, Home, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AppBottomNav() {
    const page = usePage();
    const { t } = useTranslation();

    const mainNavItems = [
        {
            title: t('sidebar.dashboard'), // Asosiy
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
            title: t('sidebar.profile'), // Oylik
            href: '/settings/profile',
            icon: User,
        },
    ];

    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 bg-white shadow-lg md:hidden dark:bg-gray-800">
            <div className="flex items-center justify-around py-2">
                {mainNavItems.map((item) => {
                    const isActive = item.href === page.url;

                    return (
                        <div key={item.title} className="flex-1">
                            <button
                                onClick={() => router.visit(item.href)}
                                className={`flex w-full flex-col items-center ${isActive ? 'text-blue-500' : 'text-gray-800'} dark:${isActive ? 'text-blue-300' : 'text-white'}`}
                            >
                                <div className="mb-1">{item.icon && <item.icon className="text-lg" />}</div>
                                <span className="text-sm">{item.title}</span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
