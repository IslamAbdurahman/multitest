import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function UserShow() {
    const { user } = usePage<{
        user: User;
    }>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.users'),
            href: '/user',
        },
        {
            title: user.name,
            href: `/user/${user.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('user_management.user_profile')} - ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/user"
                            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition-all hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-500 transition-colors group-hover:text-indigo-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{user.name}</h1>
                            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" />
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats/Badges */}
                    <div className="flex gap-2">
                        {user.roles?.map((role) => (
                            <span
                                key={role.id}
                                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black tracking-widest text-indigo-600 uppercase dark:bg-indigo-900/30 dark:text-indigo-400"
                            >
                                <ShieldCheck className="h-3 w-3" />
                                {role.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Sidebar Info Card */}
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                <UserIcon size={48} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h3>
                            <p className="text-sm text-slate-500">
                                {t('user_management.member_since', { date: new Date(user.created_at ).toLocaleDateString() })}
                            </p>
                        </div>
                    </div>

                    {/* Details/Activity Area */}
                    <div className="lg:col-span-2">
                        <div className="h-full rounded-[2rem] border border-dashed border-slate-200 p-12 dark:border-slate-800">
                            <div className="flex flex-col items-center justify-center text-center">
                                <p className="text-sm font-medium text-slate-400">{t('user_management.no_recent_activity')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
