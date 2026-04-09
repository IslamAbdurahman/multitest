import DeleteItemModal from '@/components/delete-item-modal';
import UpdateUserModal from '@/components/user/update-user-modal';
import { type UserPaginate, SearchData } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Calendar, ChevronLeft, ChevronRight, Mail, Phone, ShieldCheck, UserCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { BsTelegram } from 'react-icons/bs';
import { useIsMobile } from '@/hooks/use-mobile';


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

    const isMobile = useIsMobile();
    
    const UserCard = ({ item, globalIndex }: { item: any, globalIndex: number }) => (
        <div className="tma-card group relative">
            <div className="mb-4 flex items-center justify-between">
                <span className="font-black text-slate-300 dark:text-slate-700">
                    #{globalIndex.toString().padStart(2, '0')}
                </span>
                <div className="flex flex-wrap justify-end gap-1">
                    {item.roles?.map((role: any) => (
                        <span
                            key={role.id}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[9px] font-black tracking-tight uppercase ${getRoleStyles(role.name)}`}
                        >
                            <ShieldCheck className="h-2.5 w-2.5" />
                            {role.name}
                        </span>
                    ))}
                </div>
            </div>

            <Link href={route('user.show', item.id)} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <UserCircle className="h-7 w-7" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-black text-slate-900 dark:text-white">
                        {item.name}
                    </span>
                    <span className="truncate text-xs font-medium text-slate-400 lowercase">
                        @{item.username}
                    </span>
                </div>
            </Link>

            <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-50 py-4 dark:border-slate-800/50">
                <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('user_management.joined')}</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Calendar className="h-3 w-3 text-slate-300" />
                        {new Date(item.created_at).toLocaleDateString()}
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{t('user_management.activity')}</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Zap className="h-3 w-3 text-amber-500" />
                        {item.attempts_count || 0} Attempts
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center gap-2 truncate text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Phone className="h-3 w-3 shrink-0 text-slate-300" />
                        <span className="truncate">{item.phone || '—'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-slate-50 p-1.5 transition-colors group-hover:bg-slate-100 dark:bg-slate-800/50 dark:group-hover:bg-slate-800">
                    <UpdateUserModal user={item} />
                    <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <DeleteItemModal item={item} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {isMobile ? (
                /* 📱 MOBILE CARD VIEW */
                <div className="space-y-4">
                    {user.data.map((item, index) => {
                        const globalIndex = (user.current_page - 1) * user.per_page + index + 1;
                        return <UserCard key={item.id} item={item} globalIndex={globalIndex} />;
                    })}
                </div>
            ) : (
                /* 💻 DESKTOP TABLE VIEW */
                <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">

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
                                        <tr key={item.id} className="group transition-colors hover:bg-muted/30">

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
                                                    <div className="flex min-w-0 flex-1 flex-col">
                                                        <span className="max-w-[150px] truncate font-bold text-slate-900 transition-colors group-hover:text-indigo-600 sm:max-w-[200px] md:max-w-[250px] dark:text-white dark:group-hover:text-indigo-400">
                                                            {item.name}
                                                        </span>
                                                        <span className="truncate text-[11px] font-medium text-slate-400 lowercase">{item.username}</span>
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
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    })} {new Date(item.created_at).toLocaleTimeString(undefined, {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
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
                                                <div className="max-w-[150px] space-y-1">
                                                    <div className="flex items-center gap-2 truncate text-xs font-medium text-slate-600 dark:text-slate-400">
                                                        <Phone className="h-3 w-3 shrink-0 text-slate-300" />
                                                        <span className="truncate">{item.phone || '—'}</span>
                                                    </div>

                                                    {item.email ? (
                                                        <div className="flex items-center gap-2 truncate text-[11px] text-slate-400">
                                                            <Mail className="h-3 w-3 shrink-0 text-slate-300" />
                                                            <span className="truncate">{item.email}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 truncate text-[11px] text-slate-400">
                                                            <BsTelegram className="h-3 w-3 shrink-0 text-slate-300" />
                                                            <span className="truncate">@{item.username}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="flex items-center gap-1 rounded-2xl bg-muted/50 p-1.5 transition-colors group-hover:bg-muted dark:bg-slate-800/50">

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
            )}


            {/* Pagination */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-[1.5rem] bg-muted/30 p-4 md:flex-row">

                <div className="pl-4 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {t('common.pagination_info', { from: user.from, to: user.to, total: user.total })}
                </div>
                <div className="flex items-center gap-1">
                    {user.links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.url ? `${link.url}&${new URLSearchParams(
                                Object.entries(searchData).reduce((acc, [k, v]) => {
                                    if (k !== 'page' && k !== 'total' && v !== '' && v !== null && v !== undefined) acc[k] = String(v);
                                    return acc;
                                }, {} as Record<string, string>)
                            ).toString()}` : '#'}
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
