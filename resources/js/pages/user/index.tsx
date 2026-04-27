import MobileSearchModal from '@/components/MobileSearchModal';
import SearchForm from '@/components/search-form';
import UserTable from '@/components/user/user-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type UserPaginate, SearchData, Role } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function User() {
    const { user, roles } = usePage<{
        user: UserPaginate;
        roles: Role[];
    }>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: route('dashboard'),
        },
        {
            title: t('nav.users'),
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
        router.get(
            '/user',
            {
                search: data.search,
                role: data.role,
                per_page: data.per_page,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setData((prevData) => ({
            ...prevData,
            search: urlParams.get('search') || '',
            role: urlParams.get('role') || '',
            per_page: Number(urlParams.get('per_page')) || user.per_page,
        }));
    }, [window.location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.users')} />

            <div className="flex h-full flex-1 flex-col gap-3 rounded-xl p-2 sm:gap-4 sm:p-4">
                {/* Header Actions */}
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center sm:gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('user_management.title')}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {t('user_management.description', { count: user.total })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <MobileSearchModal roles={roles} data={data} setData={setData} handleSubmit={handleSubmit} />
                        <div className="hidden lg:block">
                            <SearchForm roles={roles} handleSubmit={handleSubmit} setData={setData} data={data} />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <UserTable {...user} searchData={data} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
