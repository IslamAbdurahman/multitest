import AttemptTable from '@/components/attempt/attempt-table';
import MobileSearchModal from '@/components/MobileSearchModal';
import SearchForm from '@/components/search-form';
import AppLayout from '@/layouts/app-layout';
import { type AttemptPaginate, type BreadcrumbItem, Role, SearchData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Attempt() {
    const { attempt, roles } = usePage<{
        attempt: AttemptPaginate;
        roles: Role[];
    }>().props;

    const { t } = useTranslation();

    // ✅ Breadcrumbs using common.dashboard and exam_attempts.title
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: route('dashboard'),
        },
        {
            title: t('exam_attempts.title'),
            href: route('attempt.index'),
        },
    ];

    // Form handling for search and per_page
    const { data, setData } = useForm<SearchData>({
        search: '',
        role: '',
        per_page: attempt.per_page,
        page: attempt.current_page,
        total: attempt.total,
    });

    // Handle search submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('attempt.index'),
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

    // Synchronize URL params with local form state
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setData((prevData) => ({
            ...prevData,
            search: urlParams.get('search') || '',
            role: urlParams.get('role') || '',
            per_page: Number(urlParams.get('per_page')) || attempt.per_page,
        }));
    }, [window.location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* ✅ Meta title from translations */}
            <Head title={t('exam_attempts.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header Section: Title and Search */}
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('exam_attempts.title')}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('exam_attempts.subtitle')}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile Search View */}
                        <MobileSearchModal roles={roles} data={data} setData={setData} handleSubmit={handleSubmit} />

                        {/* Desktop Search View */}
                        <div className="hidden lg:block">
                            <SearchForm handleSubmit={handleSubmit} roles={roles} setData={setData} data={data} />
                        </div>
                    </div>
                </div>

                {/* ✅ Results Table */}
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto">
                        <AttemptTable {...attempt} searchData={data} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
