import DeleteItemModal from '@/components/delete-item-modal';
import CreateAttemptModal from '@/components/mock/create-attempt-modal';
import UpdateTestModal from '@/components/test/update-test-modal';
import { Auth, SearchData, type TestPaginate } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface TestTableProps extends TestPaginate {
    searchData: SearchData;
}

const TestTable = ({ searchData, ...test }: TestTableProps) => {
    const { t, i18n } = useTranslation();
    const { auth } = usePage().props as unknown as { auth?: Auth };
    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');
    const isTeacher = auth?.user?.roles?.some((role) => role.name === 'Teacher');
    const isStudent = auth?.user?.roles?.some((role) => role.name === 'Student');

    const { delete: deleteTest, reset, clearErrors } = useForm();

    const [items, setItems] = useState(test.data);
    const [currentPage, setCurrentPage] = useState(test.current_page);
    const [hasMore, setHasMore] = useState(test.current_page < test.last_page);
    const [isLoading, setIsLoading] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setItems(test.data);
        setCurrentPage(test.current_page);
        setHasMore(test.current_page < test.last_page);
    }, [test.data, test.current_page, test.last_page]);

    const loadMore = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const nextPage = currentPage + 1;
            const params = new URLSearchParams(window.location.search);
            params.set('page', String(nextPage));

            const response = await axios.get(`${window.location.pathname}?${params.toString()}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const newData = response.data;
            setItems((prev) => [...prev, ...newData.data]);
            setCurrentPage(newData.current_page);
            setHasMore(newData.current_page < newData.last_page);
        } catch (error) {
            console.error('Failed to load more tests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '150px',
            }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) {
            observer.observe(currentSentinel);
        }

        return () => {
            if (currentSentinel) {
                observer.unobserve(currentSentinel);
            }
        };
    }, [hasMore, isLoading, currentPage]);

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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 🗃️ TEST CARDS GRID */}
            <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, index) => {
                    const globalIndex = index + 1;

                    if (isStudent) {
                        return (
                            <div
                                key={item.id}
                                className="group relative flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-3.5 transition-all duration-300 hover:border-primary/20 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                            >
                                <div className="min-w-0">
                                    <Link
                                        href={`/test/${item.id}`}
                                        className="block text-sm leading-tight font-black text-slate-900 transition-colors group-hover:text-primary dark:text-white"
                                    >
                                        <div className="line-clamp-2 min-h-[2.5rem] break-words">
                                            {item.name}
                                        </div>
                                    </Link>
                                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                        {item.language?.flag && <span>{item.language.flag}</span>}
                                        <span>
                                            {i18n.language === 'uz'
                                                ? item.language?.name_uz
                                                : i18n.language === 'ru'
                                                  ? item.language?.name_ru
                                                  : item.language?.name_en}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <div className="transform transition-transform active:scale-95">
                                        <CreateAttemptModal test={item} label="Start" />
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={item.id}
                            className="group relative flex flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                        >
                            <div className="min-w-0">
                                {/* Top bar info */}
                                <div className="mb-2.5 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400">
                                        <span>#{globalIndex.toString().padStart(2, '0')}</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                        {item.language?.flag && <span className="text-xs leading-none">{item.language.flag}</span>}
                                        <span className="truncate">
                                            {i18n.language === 'uz'
                                                ? item.language?.name_uz
                                                : i18n.language === 'ru'
                                                  ? item.language?.name_ru
                                                  : item.language?.name_en}
                                        </span>
                                    </div>

                                    {item.is_public ? (
                                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black tracking-widest text-emerald-600 uppercase dark:bg-emerald-950/30 dark:text-emerald-400">
                                            {t('common.public')}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-50 px-1.5 py-0.5 text-[8px] font-black tracking-widest text-slate-400 uppercase dark:bg-slate-800/80 dark:text-slate-400">
                                            {t('common.private')}
                                        </span>
                                    )}
                                </div>

                                <Link
                                    href={`/test/${item.id}`}
                                    className="block text-sm leading-tight font-black text-slate-900 transition-colors group-hover:text-primary dark:text-white"
                                >
                                    <span className="line-clamp-2 min-h-[2.5rem] break-words">{item.name}</span>
                                </Link>

                                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    {item.description || t('common.no_description')}
                                </p>

                                {(isAdmin || isTeacher) && item.audio_path && (
                                    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-1.5 transition-colors dark:border-slate-800 dark:bg-slate-950/50">
                                        <audio
                                            preload="none"
                                            controls
                                            controlsList="nodownload"
                                            className="h-6 w-full opacity-70 invert transition-opacity group-hover:opacity-100 dark:invert-0"
                                        >
                                            <source src={item.audio_path} />
                                        </audio>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100/50 dark:border-slate-800/40 flex flex-col gap-2">
                                <div className="transform transition-transform active:scale-95">
                                    <CreateAttemptModal test={item} label="Start" />
                                </div>

                                {(isAdmin || auth?.user.id == item.user_id) && (
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <UpdateTestModal test={item} />
                                        <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                        <DeleteItemModal item={item} onDelete={handleDelete} />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Infinite Scroll Sentinel & Loading Indicator */}
            <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center gap-2">
                {isLoading && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>{t('common.loading') || 'Loading...'}</span>
                    </div>
                )}
                {!hasMore && items.length > 0 && (
                    <div className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest py-2">
                        {t('common.no_more_items') || 'No more items'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestTable;
