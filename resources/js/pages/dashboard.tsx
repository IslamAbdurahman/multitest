import AttemptsChart from '@/components/attempt/attempt-chart';
import SkillsRadarChart from '@/components/dashboard/SkillsRadarChart';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { LucideActivity, LucideTrendingUp, LucideUserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
    const { user } = usePage<{ user: User }>().props;
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('sidebar.dashboard'),
            href: '/dashboard',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('sidebar.dashboard')} />

            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                {/* 🌈 Welcome Header Section */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {t('welcome_back')}, {user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('check_your_progress_and_scores')}</p>
                </div>

                {/* 📊 Top Stats Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Attempts Card */}
                    <Card className="relative overflow-hidden rounded-[2rem] border-none bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-xl shadow-blue-500/20">
                        <CardContent className="flex items-center justify-between p-6 text-white">
                            <div>
                                <p className="text-sm font-medium opacity-80">{t('exam_attempts.title')}</p>
                                <div className="text-4xl font-black tracking-tighter">{user.attempts?.length ?? 0}</div>
                                <p className="mt-1 text-xs opacity-70">{t('completedTests')}</p>
                            </div>
                            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-md">
                                <LucideActivity className="h-8 w-8 text-white" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Last Attempt Card */}
                    <Card className="relative overflow-hidden rounded-[2rem] border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{t('lastAttempt')}</p>
                                <div className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                                    {user.last_attempt?.score ?? user.last_attempt?.ai_score_avg ?? 0}
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-500">
                                    <LucideTrendingUp className="h-3 w-3" />
                                    <span>{t('latest_result')}</span>
                                </div>
                            </div>
                            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                <LucideTrendingUp className="h-8 w-8" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Card */}
                    <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                        <CardContent className="flex h-full items-center gap-4 p-6">
                            <div className="relative">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-sm dark:border-slate-700"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                                        <LucideUserCircle className="h-10 w-10" />
                                    </div>
                                )}
                                <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900"></div>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <h3 className="truncate font-bold text-slate-900 dark:text-white">{user.name}</h3>
                                <p className="truncate text-xs text-slate-500">{user.email}</p>
                                <span className="mt-1 w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-400">
                                    {t('common.student')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 📈 Charts Section */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <AttemptsChart attempts={user.attempts ?? []} />
                    </div>
                    <div className="lg:col-span-4">
                        <SkillsRadarChart />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
