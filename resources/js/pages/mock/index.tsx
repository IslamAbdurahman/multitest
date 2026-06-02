import MobileSearchModal from '@/components/MobileSearchModal';
import MockTable from '@/components/mock/mock-table';
import SearchForm from '@/components/search-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type MockPaginate, SearchData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Mock() {
    const { mock } = usePage<{ mock: MockPaginate }>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            // Changed from hardcoded 'mock' to translated key
            title: t('sidebar.mock'),
            href: '/dashboard',
        },
    ];

    const { data, setData } = useForm<SearchData>({
        search: '',
        from: '',
        to: '',
        per_page: mock.per_page,
        page: mock.current_page,
        total: mock.total,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('mock.index'), data);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        setData({
            ...data,
            search: urlParams.get('search') || '',
            from: urlParams.get('from') || '',
            to: urlParams.get('to') || '',
        });
    }, [location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Added translation for the Meta Title */}
            <Head title={t('sidebar.mock')} />
            <div className="flex h-full flex-1 flex-col gap-3 rounded-xl p-1 sm:gap-4 sm:p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center sm:gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('sidebar.mock')}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <MobileSearchModal data={data} setData={setData} handleSubmit={handleSubmit} />
                        <div className="hidden lg:block">
                            <SearchForm handleSubmit={handleSubmit} setData={setData} data={data} />
                        </div>
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="overflow-x-auto p-2">
                        <MockTable {...mock} searchData={data} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
