import DeleteItemModal from '@/components/delete-item-modal';
import UpdateUserModal from '@/components/user/update-user-modal';
import { type UserPaginate, SearchData } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Calendar, ChevronLeft, ChevronRight, Mail, Phone, ShieldCheck, UserCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { BsTelegram } from 'react-icons/bs';

interface UserTableProps extends UserPaginate {
    searchData: SearchData;
}

const UserTable = ({ searchData, ...user }: UserTableProps) => {
    const { t } = useTranslation();
    const { delete: deleteUser, reset, clearErrors } = useForm();

    const handleDelete = (id: number) => {
        deleteUser(route('user.destroy', id), {
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

    const getRoleStyles = (roleName: string) => {
        const name = roleName.toLowerCase();
        if (name === 'admin') return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30';
        if (name === 'teacher')
            return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30';
        return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    };

    return (
        <div className="space-y-6">
            {/* Table Wrapper */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-5">#</th>
                                <th className="px-6 py-5">{t('common.user')}</th>
                                <th className="px-6 py-5">{t('common.role')}</th>
                                <th className="px-6 py-5">{t('user_management.joined')}</th>
                                <th className="px-6 py-5">{t('user_management.activity')}</th>
                                <th className="px-6 py-5">{t('user_management.contact')}</th>
                                <th className="px-6 py-5 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {user.data.map((item, index) => {
                                const globalIndex = (user.current_page - 1) * user.per_page + index + 1;
                                return (
                                    <tr key={item.id} className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                        <td className="px-6 py-4">
                                            <span className="font-black text-slate-300 dark:text-slate-600">
                                                {globalIndex.toString().padStart(2, '0')}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <Link href={route('user.show', item.id)} className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white dark:bg-slate-800">
                                                    <UserCircle className="h-6 w-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[11px] font-medium text-slate-400 lowercase">{item.username}</span>
                                                </div>
                                            </Link>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {item.roles?.map((role) => (
                                                    <span
                                                        key={role.id}
                                                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-black tracking-tight uppercase ${getRoleStyles(role.name)}`}
                                                    >
                                                        <ShieldCheck className="h-3 w-3" />
                                                        {role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                <Calendar className="h-3.5 w-3.5 text-slate-300" />
                                                {new Date(item.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black tracking-tight text-slate-400 uppercase">
                                                        <Zap className="h-3 w-3 text-amber-500" />
                                                        {t('exam_attempts.title')}: {item.attempts_count || 0}
                                                    </div>
                                                    {(item.tests_count ?? 0) > 0 && (
                                                        <div className="text-[10px] font-bold text-slate-400">
                                                            Tests: {item.tests_count}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                                                    <Phone className="h-3 w-3 text-slate-300" />
                                                    {item.phone || '—'}
                                                </div>

                                                {item.email ? (
                                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                        <Mail className="h-3 w-3 text-slate-300" />
                                                        {item.email}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                        <BsTelegram className="h-3 w-3 text-slate-300" />
                                                        {item.username}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="flex items-center gap-1 rounded-2xl bg-slate-50 p-1.5 dark:bg-slate-800/50">
                                                    <UpdateUserModal user={item} />
                                                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
                                                    <DeleteItemModal item={item} onDelete={handleDelete} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-[1.5rem] bg-slate-50 p-4 md:flex-row dark:bg-slate-900/50">
                <div className="pl-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {t('common.pagination_info', { from: user.from, to: user.to, total: user.total })}
                </div>
                <div className="flex items-center gap-1">
                    {user.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={`${link.url ?? '?'}&search=${searchData.search}&per_page=${searchData.per_page}`}
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

export default UserTable;
