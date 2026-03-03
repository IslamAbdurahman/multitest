import { Role, SearchData } from '@/types';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { ChangeEvent, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';

interface SearchFormProps {
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    setData: <K extends keyof SearchData>(key: K, value: SearchData[K]) => void;
    data: SearchData;
    roles?: Role[];
}

const SearchForm = ({ handleSubmit, setData, data, roles }: SearchFormProps) => {
    const { t } = useTranslation();

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setData('search', e.target.value);
    };

    const handleMonth = (e: ChangeEvent<HTMLInputElement>) => {
        setData('month', e.target.value);
    };

    const handlePerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setData('per_page', parseInt(e.target.value, 10));
        setData('page', 1);

        const form = e.target.closest('form');
        if (form) {
            queueMicrotask(() => form.requestSubmit());
        }
    };

    const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setData('role', e.target.value);

        const form = e.target.closest('form');
        if (form) {
            queueMicrotask(() => form.requestSubmit());
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 rounded shadow-xs sm:gap-2 lg:inline-flex lg:flex-row lg:flex-wrap lg:gap-0 lg:gap-y-1" role="group">
                {/* Search Bar */}
                <input
                    type="text"
                    value={data.search}
                    onChange={handleSearch}
                    className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    placeholder={t('search_form.search')}
                />

                {/* Per Page Select */}
                {typeof data.total === 'number' && (
                    <select
                        value={data.per_page}
                        onChange={handlePerPageChange}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={data.total}>{t('search_form.pagination_option_all')}</option>
                    </select>
                )}

                <div className={'flex-column items-center justify-between'}>
                    {/* From Date */}
                    {typeof data.from === 'string' && (
                        <DatePicker
                            id="from-date"
                            placeholderText={t('search_form.from')}
                            value={data.from}
                            onChange={(from) => {
                                setData('from', from ? format(from, 'yyyy-MM-dd') : '');
                            }}
                            className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                        />
                    )}

                    {/* To Date */}
                    {typeof data.to === 'string' && (
                        <DatePicker
                            id="to-date"
                            placeholderText={t('search_form.to')}
                            value={data.to}
                            onChange={(to) => {
                                setData('to', to ? format(to, 'yyyy-MM-dd') : '');
                            }}
                            className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                        />
                    )}
                </div>

                {/* Month Picker */}
                {typeof data.month === 'string' && (
                    <input
                        type="month"
                        value={data.month}
                        max={format(new Date(), 'yyyy-MM')}
                        onChange={handleMonth}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                        placeholder={t('search_form.month')}
                    />
                )}

                {/* Specific Date Picker */}
                {typeof data.date === 'string' && (
                    <DatePicker
                        id="date"
                        placeholderText={t('search_form.date')}
                        value={data.date}
                        onChange={(date) => {
                            setData('date', date ? format(date, 'yyyy-MM-dd') : '');
                        }}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    />
                )}

                {/* Role Filter */}
                {roles && (
                    <select
                        value={data.role || ''}
                        onChange={handleRoleChange}
                        className="rounded border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
                    >
                        <option value="0">{t('search_form.role')}</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded border border-gray-200 bg-blue-700 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-blue-800 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 focus:outline-none dark:border-gray-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-800"
                >
                    <Search className="text-white dark:text-white" size={20} />
                    <span className="lg:hidden">{t('search_form.search_button')}</span>
                </button>
            </div>
        </form>
    );
};

export default SearchForm;
