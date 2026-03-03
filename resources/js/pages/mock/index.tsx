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
        const searchQuery = urlParams.get('search') || '';
        setData('search', searchQuery);
    }, [location.search]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {/* Added translation for the Meta Title */}
            <Head title={t('sidebar.mock')} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-end">
                    <MobileSearchModal data={data} setData={setData} handleSubmit={handleSubmit} />
                    <div className={'hidden lg:block'}>
                        <SearchForm handleSubmit={handleSubmit} setData={setData} data={data} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <MockTable {...mock} searchData={data} />
                </div>
            </div>
        </AppLayout>
    );
}
