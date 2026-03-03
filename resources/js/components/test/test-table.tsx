import DeleteItemModal from '@/components/delete-item-modal';
import CreateAttemptModal from '@/components/mock/create-attempt-modal';
import CreateTestModal from '@/components/test/create-test-modal';
import UpdateTestModal from '@/components/test/update-test-modal';
import { Auth, SearchData, type TestPaginate } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, CircleDashed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface TestTableProps extends TestPaginate {
    searchData: SearchData;
}

const TestTable = ({ searchData, ...test }: TestTableProps) => {
    const { t, i18n } = useTranslation();
    const { auth } = usePage().props as unknown as { auth?: Auth };
    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');
    const isTeacher = auth?.user?.roles?.some((role) => role.name === 'Teacher');

    const { delete: deleteTest, reset, clearErrors } = useForm();

    const handleDelete = (id: number) => {
        deleteTest(route('test.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                toast.success(t('success.deleted'));
            },
            onError: (err) => toast.error(err?.error || t('error.delete_failed')),
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
            {/* 🏷️ HEADER SECTION */}
            <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-8 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800/60">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">{t('test_table.test_library')}</h2>
                    <p className="mt-2 font-medium text-slate-500 dark:text-slate-400">{t('test_table.browse_description')}</p>
                </div>
                <div className="flex items-center">
                    {(isAdmin || isTeacher) && (
                        <div className="rounded-2xl bg-slate-100/50 p-1 backdrop-blur-sm dark:bg-slate-800/50">
                            <CreateTestModal />
                        </div>
                    )}
                </div>
            </div>

            {/* 🗃️ TEST CARDS GRID */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {test.data.map((item, index) => {
                    const globalIndex = (test.current_page - 1) * test.per_page + index + 1;

                    return (
                        <div
                            key={item.id}
                            className="group relative flex flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/50 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        >
                            {/* Status Indicator Bar */}
                            <div
                                className={`absolute top-0 left-1/2 h-1 w-20 -translate-x-1/2 rounded-b-full transition-colors ${item.is_public ? 'bg-indigo-500/20 group-hover:bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                            />

                            {/* 📍 FLOATING STATUS BADGE */}
                            <div className="absolute top-6 right-6 transition-transform duration-300 group-hover:scale-105">
                                {item.is_public ? (
                                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-emerald-600 uppercase ring-1 ring-emerald-500/20 dark:bg-emerald-900/20 dark:text-emerald-400">
                                        <CheckCircle2 className="h-3 w-3" />
                                        {t('common.public')}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-slate-400 uppercase ring-1 ring-slate-200 dark:bg-slate-800/40 dark:text-slate-500 dark:ring-slate-700">
                                        <CircleDashed className="h-3 w-3" />
                                        {t('common.private')}
                                    </span>
                                )}
                            </div>

                            <div className="relative">
                                <div className="mb-4 flex items-start justify-between">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 font-mono text-xs font-bold text-slate-400 transition-colors group-hover:border-indigo-200 group-hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
                                        {globalIndex}
                                    </span>
                                </div>

                                <Link
                                    href={`/test/${item.id}`}
                                    /* pr-20 prevents title overlap with the absolute badge */
                                    className="block pr-20 text-xl leading-tight font-bold text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400"
                                >
                                    {item.name}
                                    <span className="ml-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 group-hover:text-indigo-400">
                                        ({item.language?.flag && <span className="text-base leading-none">{item.language.flag}</span>}
                                        {i18n.language === 'uz'
                                            ? item.language?.name_uz
                                            : i18n.language === 'ru'
                                              ? item.language?.name_ru
                                              : item.language?.name_en}
                                        )
                                    </span>
                                </Link>

                                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                    {item.description || t('common.no_description')}
                                </p>

                                {item.audio_path && (
                                    <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-2 transition-colors group-hover:border-indigo-100 dark:border-slate-800 dark:bg-slate-950/50 dark:group-hover:border-indigo-900/30">
                                        <audio
                                            preload="none"
                                            controls
                                            controlsList="nodownload"
                                            className="h-7 w-full opacity-70 invert transition-opacity group-hover:opacity-100 dark:invert-0"
                                        >
                                            <source src={item.audio_path} />
                                        </audio>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="transform transition-transform active:scale-95">
                                    <CreateAttemptModal test={item} />
                                </div>

                                {(isAdmin || auth?.user.id == item.user_id) && (
                                    <div className="flex items-center justify-center gap-2 border-t border-slate-50 pt-4 dark:border-slate-800/60">
                                        <UpdateTestModal test={item} />
                                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                                        <DeleteItemModal item={item} onDelete={handleDelete} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 🔢 PAGINATION SECTION */}
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-transparent bg-slate-900/5 p-6 backdrop-blur-xl md:flex-row dark:border-slate-800 dark:bg-white/5">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    {t('common.showing', { from: test.from, to: test.to, total: test.total })}
                </div>

                <nav className="flex items-center gap-1.5">
                    {test.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={`${link.url ?? '?'}&search=${searchData.search}&per_page=${searchData.per_page}`}
                            className={`flex h-10 min-w-[40px] items-center justify-center rounded-xl px-4 text-xs font-bold transition-all ${
                                link.active
                                    ? 'scale-105 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/10'
                                    : !link.url
                                      ? 'cursor-not-allowed text-slate-300 dark:text-slate-700'
                                      : 'border border-slate-100 bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default TestTable;
