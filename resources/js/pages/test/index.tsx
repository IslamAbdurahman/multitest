import MobileSearchModal from '@/components/MobileSearchModal';
import SearchForm from '@/components/search-form';
import TestTable from '@/components/test/test-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type TestPaginate, SearchData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Test() {
    const { test } = usePage<{ test: TestPaginate }>().props;
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
        router.get(route('test.index'), data);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.get('search') || '';
        setData('search', searchQuery);
    }, [location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('nav.tests')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Search and Per-Page Selection */}
                <div className="flex items-center justify-end">
                    <MobileSearchModal data={data} setData={setData} handleSubmit={handleSubmit} />
                    <div className={'hidden lg:block'}>
                        <SearchForm handleSubmit={handleSubmit} setData={setData} data={data} />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <TestTable {...test} searchData={data} />
                </div>
            </div>
        </AppLayout>
    );
}
