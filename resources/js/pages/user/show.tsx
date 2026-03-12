import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Mail, Phone, ShieldCheck, User as UserIcon, Zap, FileText, Layout, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BsTelegram } from 'react-icons/bs';

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

            <div className="flex h-full flex-1 flex-col gap-8 p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/user"
                            className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white transition-all hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-900"
                        >
                            <ArrowLeft className="h-6 w-6 text-slate-500 transition-colors group-hover:text-indigo-600" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{user.name}</h1>
                            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                    @{user.username}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                <span className="flex items-center gap-1.5">
                                    <Mail className="h-4 w-4" />
                                    {user.email || 'No email'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {user.roles?.map((role) => (
                            <span
                                key={role.id}
                                className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-black tracking-widest text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-400"
                            >
                                <ShieldCheck className="h-3.5 w-3.5" />
                                {role.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden rounded-[2rem] border-none bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-xl shadow-blue-500/10">
                        <CardContent className="flex items-center justify-between p-6 text-white">
                            <div>
                                <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{t('exam_attempts.title')}</p>
                                <div className="text-3xl font-black tabular-nums">{user.attempts_count || 0}</div>
                            </div>
                            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
                                <Zap className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tests Created</p>
                                <div className="text-3xl font-black text-slate-900 tabular-nums dark:text-white">{user.tests_count || 0}</div>
                            </div>
                            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                                <FileText className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mocks Organized</p>
                                <div className="text-3xl font-black text-slate-900 tabular-nums dark:text-white">{user.mocks_count || 0}</div>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <Layout className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Activity</p>
                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                    {user.last_attempt 
                                        ? new Date(user.last_attempt.finished_at || user.last_attempt.created_at).toLocaleDateString() 
                                        : 'No activity'}
                                </div>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                <Activity className="h-6 w-6" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left Column: Profile Card */}
                    <div className="space-y-6">
                        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-slate-100 text-slate-400 dark:bg-slate-800">
                                        <UserIcon size={64} />
                                    </div>
                                    <div className="absolute -right-2 -bottom-2 h-8 w-8 rounded-2xl border-4 border-white bg-emerald-500 dark:border-slate-900"></div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
                                <p className="mt-2 text-sm font-medium text-slate-500">
                                    {t('user_management.member_since', { date: new Date(user.created_at).toLocaleDateString() })}
                                </p>
                            </div>

                            <div className="mt-8 space-y-4 border-t border-slate-100 pt-8 dark:border-slate-800">
                                <h4 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Contact Information</h4>
                                
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-800">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase uppercase">Phone</div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.phone || '—'}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-800">
                                        <BsTelegram className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Telegram</div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {user.telegram_id ? `@${user.telegram_id}` : 'Not linked'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 dark:bg-slate-800">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Registered At</div>
                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            {new Date(user.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity / Last Attempt */}
                    <div className="lg:col-span-2 space-y-6">
                        {user.last_attempt ? (
                            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Latest Exam Performance</h3>
                                    <Link 
                                        href={route('attempt.show', user.last_attempt.id)}
                                        className="text-xs font-black tracking-tight text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                    >
                                        View Full Report →
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="flex flex-col gap-2 rounded-3xl bg-slate-50 p-6 dark:bg-slate-800/50">
                                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Test Title</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{user.last_attempt.test?.name || 'Mock Exam'}</span>
                                    </div>

                                    <div className="flex flex-col gap-2 rounded-3xl bg-slate-50 p-6 dark:bg-slate-800/50">
                                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Score / Result</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                                {user.last_attempt.score || user.last_attempt.ai_score_avg || 0}
                                            </span>
                                            <span className="text-xs font-bold text-slate-400">overall</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-64 flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                                <div className="mb-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                                    <Activity className="h-8 w-8 text-slate-300" />
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{t('user_management.no_recent_activity')}</h4>
                                <p className="mt-1 text-sm text-slate-500 text-slate-400">This user hasn't attempted any tests yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
