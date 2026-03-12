import EvaluateAttemptModal from '@/components/attempt/evaluate-attempt-modal';
import DeleteItemModal from '@/components/delete-item-modal';
import { type AttemptPaginate, Auth, SearchData } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Clock, Info, Star, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface AttemptTableProps extends AttemptPaginate {
    searchData: SearchData;
}

const AttemptTable = ({ searchData, ...attempt }: AttemptTableProps) => {
    const { t } = useTranslation();
    const { auth } = usePage().props as unknown as { auth?: Auth };

    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'Admin');
    const isTeacher = auth?.user?.roles?.some((role) => role.name === 'Teacher');

    const { delete: deleteAttempt, reset, clearErrors } = useForm();

    const handleDelete = (id: number) => {
        deleteAttempt(route('attempt.destroy', { attempt: id }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                toast.success(t('success.deleted'));
            },
            onError: (err) => {
                toast.error(err?.error || t('error.delete_failed'));
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* 📊 TABLE DATA */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-5">#</th>
                                <th className="px-6 py-5">{t('exam_attempts.student')}</th>
                                <th className="px-6 py-5">{t('exam_attempts.details')}</th>
                                <th className="px-6 py-5">{t('exam_attempts.timeline')}</th>
                                <th className="px-6 py-5 text-center">{t('exam_attempts.performance')}</th>
                                <th className="px-6 py-5 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {attempt.data.length > 0 ? (
                                attempt.data.map((item, index) => {
                                    const globalIndex = (attempt.current_page - 1) * attempt.per_page + index + 1;

                                    return (
                                        <tr 
                                            key={item.id} 
                                            className="group cursor-pointer transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                                            onClick={() => item.id && router.get(route('attempt.show', { attempt: item.id }))}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-black text-slate-300 dark:text-slate-600">
                                                    {globalIndex.toString().padStart(2, '0')}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <Link 
                                                    href={item.id ? route('attempt.show', { attempt: item.id }) : '#'} 
                                                    className="group/user flex items-center gap-3"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover/user:bg-indigo-100 group-hover/user:text-indigo-600 dark:bg-slate-800 dark:text-slate-400">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 transition-colors group-hover/user:text-indigo-600 dark:text-white">
                                                            {item.user?.name}
                                                        </p>
                                                        <p className="text-[10px] font-medium text-slate-400">ID: {item.user?.id}</p>
                                                    </div>
                                                </Link>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-3.5 w-3.5 text-slate-300" />
                                                    <div className="max-w-[200px] truncate">
                                                        <p className="truncate font-bold text-slate-700 dark:text-slate-300">
                                                            {item.mock?.name || item.test?.name}
                                                        </p>
                                                        {item.mock && item.test && (
                                                            <p className="text-[10px] font-bold text-indigo-500 uppercase">{item.test.name}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="space-y-1 text-[11px] font-medium">
                                                    <div
                                                        className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
                                                        title={t('exam_attempts.date_started')}
                                                    >
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(item.started_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400" title={t('exam_attempts.time_started')}>
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(item.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div
                                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                                                            item.score && item.score >= 7
                                                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                                : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}
                                                    >
                                                        <Star className={`h-3 w-3 ${(item.score ?? item?.ai_score_avg) ? 'fill-current' : ''}`} />
                                                        {item?.score != null
                                                            ? Number(item.score.toFixed(2))
                                                            : item?.ai_score_avg != null
                                                              ? Number(item.ai_score_avg.toFixed(2))
                                                              : t('exam_attempts.pending')}
                                                    </div>
                                                    {item.review && (
                                                        <span className="text-[9px] font-black tracking-tighter text-indigo-500/60 uppercase">
                                                            {t('exam_attempts.reviewed')}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(isAdmin || isTeacher) && (
                                                        <div 
                                                            className="flex items-center gap-2 rounded-2xl bg-slate-50 p-1.5 dark:bg-slate-800/50"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <EvaluateAttemptModal attempt={item} />
                                                            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
                                                            <DeleteItemModal item={item} onDelete={handleDelete} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Info className="mb-2 h-10 w-10 opacity-20" />
                                            <p className="text-xs font-black tracking-widest uppercase">{t('exam_attempts.no_attempts_found')}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 📟 PAGINATION */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-[1.5rem] bg-slate-50 p-4 md:flex-row dark:bg-slate-900/50">
                <div className="pl-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {t('common.showing', {
                        from: attempt.from || 0,
                        to: attempt.to || 0,
                        total: attempt.total,
                    })}
                </div>
                <div className="flex items-center gap-1">
                    {attempt.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={`${link.url ?? '?'}&search=${searchData.search ?? ''}&per_page=${searchData.per_page ?? 10}`}
                            className={`flex h-10 min-w-[40px] items-center justify-center rounded-xl px-3 text-xs font-black transition-all ${
                                link.active
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : !link.url
                                      ? 'cursor-not-allowed opacity-30'
                                      : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                            }`}
                        >
                            {link.label.includes('Previous') ? (
                                <ChevronLeft className="h-4 w-4" />
                            ) : link.label.includes('Next') ? (
                                <ChevronRight className="h-4 w-4" />
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

export default AttemptTable;
