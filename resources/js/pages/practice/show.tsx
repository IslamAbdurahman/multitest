import { AppShell } from '@/components/app-shell';
import QuestionPlayer from '@/components/practice/QuestionPlayer';
import StepTabs from '@/components/practice/StepTabs';
import { AttemptPart } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Mic, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'sonner';

export default function PracticeShow() {
    const { attempt_part } = usePage<{ attempt_part: AttemptPart }>().props;
    const { t } = useTranslation();

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                toast.warning(t('practice_show.anti_cheat_warning_title'), {
                    description: t('practice_show.anti_cheat_warning_desc'),
                    duration: 5000,
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [t]);

    return (
        <AppShell>
            <Toaster position="top-center" richColors />
            <Head title={`${attempt_part.part?.name || t('practice_show.part_label')} - CEFR Speaking`} />

            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
                {/* 🛰️ Global Progress Bar — Dark Nav */}
                <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900">
                    <div className="mx-auto max-w-[95vw] flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 shrink-0">
                            <span className="text-lg">🇺🇿</span>
                            <span className="text-[9px] font-bold tracking-widest text-indigo-400 uppercase whitespace-nowrap">CEFR Speaking</span>
                        </div>
                        <div className="flex-1">
                            <StepTabs attempt_parts={attempt_part.attempt?.attempt_parts ?? []} active={attempt_part.id} />
                        </div>
                    </div>
                </div>

                {/* 🎭 Main Stage */}
                <main className="mx-auto flex max-w-[95vw] flex-col items-center px-4 py-6 md:px-6 md:py-12">
                    {/* 🎙️ The Interactive Player Instance */}
                    <div className="w-full">
                        <div className="relative overflow-hidden rounded-2xl md:rounded-[3rem] bg-white shadow-2xl ring-1 shadow-indigo-500/10 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                            {/* Key forces a re-mount of QuestionPlayer logic (timers/state) for each new part */}
                            <QuestionPlayer key={attempt_part.id} attempt_part={attempt_part} />
                        </div>
                    </div>

                    {/* Institutional footer bar */}
                    <div className="mt-6 md:mt-10 flex w-full flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🇺🇿</span>
                            <div>
                                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">National System of Foreign Language Assessment</p>
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">CEFR Speaking Practice Examination</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Mic className="h-3.5 w-3.5 text-indigo-500" />
                                <span className="text-[10px] font-bold text-slate-500">{t('practice_show.microphone')} · {t('practice_show.ready')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-500">{t('practice_show.exam_mode')} · {t('practice_show.secure')}</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AppShell>
    );
}

