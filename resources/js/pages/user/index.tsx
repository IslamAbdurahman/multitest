import MobileSearchModal from '@/components/MobileSearchModal';
import SearchForm from '@/components/search-form';
import UserTable from '@/components/user/user-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type UserPaginate, SearchData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function User() {
    const { user } = usePage<{
        user: UserPaginate;
    }>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.users'), // Standardized nav key
            href: '/user',
        },
    ];

    // Form handling for search and per_page
    const { data, setData } = useForm<SearchData>({
        search: '',
        role: '',
        per_page: user.per_page,
        page: user.current_page,
        total: user.total,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/user', data);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get('search') || '';
        setData('search', searchQuery);
    }, [location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.users')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t('user_management.title')}</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {t('user_management.description', { count: user.total })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <MobileSearchModal data={data} setData={setData} handleSubmit={handleSubmit} />
                        <div className="hidden lg:block">
                            <SearchForm handleSubmit={handleSubmit} setData={setData} data={data} />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto p-2">
                        <UserTable {...user} searchData={data} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
