import MobileSearchModal from '@/components/MobileSearchModal';
import SearchForm from '@/components/search-form';
import TestTable from '@/components/test/test-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type TestPaginate, Language, SearchData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Test() {
    const { test, language } = usePage<{
        test: TestPaginate;
        language: Language;
    }>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.tests'),
            href: '/dashboard',
        },
    ];

    // Form handling for search and per_page
    const { data, setData } = useForm<SearchData>({
        search: '',
        per_page: test.per_page,
        page: test.current_page,
        total: test.total,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('language.show', language.id), data);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get('search') || '';
        setData('search', searchQuery);
    }, [location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.tests')} />
            <div className="flex h-full flex-1 flex-col gap-3 rounded-xl p-2 sm:gap-4 sm:p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center sm:gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('nav.tests')}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <MobileSearchModal data={data} setData={setData} handleSubmit={handleSubmit} />
                        <div className="hidden lg:block">
                            <SearchForm handleSubmit={handleSubmit} setData={setData} data={data} />
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto p-2">
                        <TestTable {...test} searchData={data} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
