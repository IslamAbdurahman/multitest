import DeleteItemModal from '@/components/delete-item-modal';
import CreateAttemptModal from '@/components/mock/create-attempt-modal';
import CreateMockModal from '@/components/mock/create-mock-modal';
import CreateMockTestModal from '@/components/mock/create-mock-test-modal';
import UpdateMockModal from '@/components/mock/update-mock-modal';
import { Auth, SearchData, type MockPaginate } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, ChevronLeft, ChevronRight, Copy, Headphones, Layers, LayoutGrid, Lock, LockOpen, PlusCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface MockTableProps extends MockPaginate {
    searchData: SearchData;
}

const MockTable = ({ searchData, ...mock }: MockTableProps) => {
    const { t } = useTranslation();
    const { auth } = usePage().props as unknown as { auth?: Auth };

    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');
    const isTeacher = auth?.user?.roles?.some((role) => role.name === 'Teacher');

    const { delete: deleteMock, reset, clearErrors } = useForm();

    const handleDelete = (id: number) => {
        deleteMock(route('mock.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                toast.success(t('success.deleted'));
            },
            onError: (err) => toast.error(err?.error || t('error.delete_failed')),
        });
    };

    const handleMockTestDelete = (id: number) => {
        deleteMock(route('mock-test.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                toast.success(t('success.deleted'));
            },
            onError: (err) => toast.error(err?.error || t('error.delete_failed')),
        });
    };

    const copyToClipboard = (slug: string) => {
        navigator.clipboard.writeText(`${slug}`);
        toast.success(t('mock_table.link_copied'));
    };

    return (
        <div className="space-y-8">
            {/* 🏷️ SECTION HEADER */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-8 dark:border-slate-800">
                <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 dark:shadow-none">
                        <LayoutGrid className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t('mock_table.title')}</h2>
                        <div className="mt-1 flex items-center gap-2">
                            <Sparkles className="h-3 w-3 text-indigo-500" />
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('mock_table.description')}</p>
                        </div>
                    </div>
                </div>
                {(isAdmin || isTeacher) && <CreateMockModal />}
            </div>

            {/* 🎴 CARDS GRID */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {mock.data.map((item, index) => {
                    const globalIndex = (mock.current_page - 1) * mock.per_page + index + 1;

                    return (
                        <div
                            key={item.id}
                            className="group relative flex flex-col rounded-[2.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900"
                        >
                            {/* Visual Accent */}
                            <div className="absolute top-0 h-32 w-full rounded-t-[2.5rem] bg-gradient-to-br from-indigo-500/5 to-transparent" />

                            <div className="relative flex flex-1 flex-col p-8">
                                {/* Header: Index & Status */}
                                <div className="mb-6 flex items-center justify-between">
                                    {/* Index Indicator */}
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xs font-black text-white shadow-lg dark:bg-white dark:text-slate-900">
                                        {globalIndex}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {/* Copy Button */}
                                        <button
                                            onClick={() => copyToClipboard(item.slug)}
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600 active:scale-90 dark:bg-slate-800 dark:hover:bg-indigo-900/40"
                                            title={t('mock_table.copy_link')}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </button>

                                        {/* Status Badges */}
                                        <div className="flex gap-1.5">
                                            {/* Active/Passive State */}
                                            <span
                                                className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                                                    item.active
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
                                                }`}
                                            >
                                                <CheckCircle2 className="h-3 w-3" />
                                                {item.active ? t('common.active') : t('common.passive')}
                                            </span>

                                            {/* Open/Closed State */}
                                            <span
                                                className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                                                    item.open
                                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                        : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                                                }`}
                                            >
                                                {item.open ? <LockOpen className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                                {item.open ? t('common.open') : t('common.closed')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mock Info */}
                                <div className="mb-6">
                                    <h3 className="line-clamp-1 text-2xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white">
                                        {item.name}
                                    </h3>
                                    <p className="mt-3 line-clamp-2 min-h-[40px] text-sm leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                        {item.description || t('mock_table.no_description')}
                                    </p>
                                </div>

                                {/* Introductory Audio */}
                                {item.audio_path && (
                                    <div className="mb-6 space-y-2.5">
                                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            <Headphones className="h-3.5 w-3.5" />
                                            {t('mock_table.intro_audio')}
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-950/50">
                                            <audio preload="none" controls controlsList="nodownload" className="h-8 w-full opacity-80">
                                                <source src={item.audio_path} />
                                            </audio>
                                        </div>
                                    </div>
                                )}

                                {/* Tests List */}
                                <div className="mb-8 flex-1">
                                    <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                        <Layers className="h-3.5 w-3.5" />
                                        {t('mock_table.included_tests')}
                                    </h4>
                                    <div className="space-y-2.5">
                                        {item.mock_tests?.length ? (
                                            item.mock_tests.map((mockTest, i) => (
                                                <div
                                                    key={mockTest.id}
                                                    className="group/item flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 px-4 py-3.5 transition-all hover:border-indigo-100 hover:bg-white dark:border-slate-800 dark:bg-slate-800/20"
                                                >
                                                    <span className="truncate text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        {i + 1}. {mockTest.test?.name}
                                                    </span>
                                                    {(isAdmin || isTeacher) && (
                                                        <div className="opacity-0 transition-opacity group-hover/item:opacity-100">
                                                            <DeleteItemModal item={mockTest} onDelete={handleMockTestDelete} />
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 py-8 text-center dark:border-slate-800">
                                                <PlusCircle className="mb-2 h-6 w-6 text-slate-300" />
                                                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                                    {t('mock_table.no_tests')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3.5">
                                    <CreateAttemptModal mock={item} />

                                    {(isAdmin || isTeacher) && (
                                        <div className="flex items-center gap-2 rounded-[1.5rem] bg-slate-50 p-2.5 dark:bg-slate-800/50">
                                            <div className="flex flex-1 gap-2">
                                                <CreateMockTestModal mock={item} />
                                                <UpdateMockModal mock={item} />
                                            </div>
                                            <div className="mx-1 h-10 w-[1px] bg-slate-200 dark:bg-slate-700" />
                                            <DeleteItemModal item={item} onDelete={handleDelete} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm md:flex-row dark:border-slate-800 dark:bg-slate-900">
                <div className="pl-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    {t('common.showing', { from: mock.from, to: mock.to, total: mock.total })}
                </div>
                <div className="flex items-center gap-2">
                    {mock.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={`${link.url ?? '?'}&search=${searchData.search}&per_page=${searchData.per_page}`}
                            className={`flex h-11 min-w-[44px] items-center justify-center rounded-2xl px-4 text-xs font-black transition-all ${
                                link.active
                                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                                    : !link.url
                                      ? 'cursor-not-allowed opacity-20'
                                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                            {link.label.includes('Previous') ? (
                                <ChevronLeft className="h-5 w-5" />
                            ) : link.label.includes('Next') ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MockTable;
