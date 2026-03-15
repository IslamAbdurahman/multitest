import { AppShell } from '@/components/app-shell';
import StepTabs from '@/components/practice/StepTabs';
import { type Attempt } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronRight, Headphones, Info, Layers, Mic2, Play, Timer, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Practice() {
    const { attempt } = usePage<{ attempt: Attempt }>().props;
    const { t } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(true);

    const firstPartId = attempt.attempt_parts?.[0]?.id;

    const handleAudioEnd = () => {
        if (firstPartId) {
            router.visit(route('practice.show', firstPartId));
        }
    };

    return (
        <AppShell>
            <Head title={t('nav.tests')} />

            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
                {/* 1. Top Navigation & Progress */}
                <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                    <div className="mx-auto max-w-5xl">
                        <StepTabs attempt_parts={attempt?.attempt_parts ?? []} active={0} />
                    </div>
                </div>

                <div className="mx-auto max-w-5xl px-6 py-12">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        {/* 📝 Left Side: Test Context (Col 7) */}
                        <div className="space-y-8 lg:col-span-7">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-1.5 text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase dark:bg-indigo-500/10 dark:text-indigo-400">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
                                    </span>
                                    {t('practice.speaking_session_active')}
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    {attempt.mock?.name || attempt.test?.name}
                                </h1>
                                <div className="max-w-none text-base md:text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                                    {attempt.mock?.description || attempt.test?.description}
                                </div>
                            </div>

                            {/* Info Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <InfoCard
                                    label={t('practice.total_parts')}
                                    value={attempt.attempt_parts?.length ?? 0}
                                    icon={<Layers className="h-5 w-5 text-indigo-500" />}
                                />
                                <InfoCard
                                    label={t('practice.estimated_time')}
                                    value="15-20 min"
                                    icon={<Timer className="h-5 w-5 text-amber-500" />}
                                />
                            </div>

                            {/* Hardware Checklist */}
                            <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-6 dark:border-slate-800 dark:bg-slate-900/40">
                                <h4 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase">
                                    <Info className="h-4 w-4" /> {t('practice.before_you_start')}
                                </h4>
                                <div className="flex flex-wrap gap-6">
                                    <CheckItem icon={<Headphones className="h-4 w-4" />} text={t('practice.wear_headphones')} />
                                    <CheckItem icon={<Mic2 className="h-4 w-4" />} text={t('practice.check_microphone')} />
                                    <CheckItem icon={<Volume2 className="h-4 w-4" />} text={t('practice.quiet_environment')} />
                                </div>
                            </div>
                        </div>

                        {/* 🎙️ Right Side: Immersive Audio Card (Col 5) */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-8 overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 text-white shadow-2xl shadow-indigo-500/20 dark:bg-slate-900 dark:ring-1 dark:ring-white/10">
                                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]"></div>

                                <div className="relative space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight">{t('practice.instructions')}</h3>
                                        <p className="mt-2 text-sm leading-relaxed font-medium text-slate-400">
                                            {t('practice.listen_to_intro_instruction')}
                                        </p>
                                    </div>

                                    {/* Visual Audio Player */}
                                    <div className="group rounded-[2rem] border border-white/5 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10">
                                        <div className="mb-6 flex items-center gap-4">
                                            <div
                                                className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 ${
                                                    isPlaying ? 'scale-105 bg-indigo-600 shadow-lg shadow-indigo-500/40' : 'scale-100 bg-slate-800'
                                                }`}
                                            >
                                                {isPlaying ? <Volume2 className="h-6 w-6 animate-pulse" /> : <Play className="h-6 w-6" />}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-black tracking-widest text-indigo-400 uppercase">
                                                    {t('practice.playing_audio')}
                                                </p>
                                                <p className="truncate font-bold text-slate-200">{t('practice.test_introduction')}</p>
                                            </div>
                                        </div>

                                        <audio
                                            autoPlay
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                            onEnded={handleAudioEnd}
                                            className="h-10 w-full rounded-full opacity-40 transition-opacity hover:opacity-100"
                                            controls
                                            controlsList="nodownload"
                                        >
                                            <source src={attempt.mock?.audio_path ?? attempt.test?.audio_path ?? ''} type="audio/mpeg" />
                                        </audio>
                                    </div>

                                    {firstPartId && (
                                        <Link
                                            href={route('practice.show', firstPartId)}
                                            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-5 text-center font-black text-slate-900 transition-all hover:bg-indigo-50 active:scale-[0.98]"
                                        >
                                            <span>{t('practice.skip_to_first_part')}</span>
                                            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}

function InfoCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
    return (
        <div className="group flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 transition-all hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-indigo-50 dark:bg-slate-800 dark:group-hover:bg-indigo-900/30">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{label}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
}

function CheckItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="text-indigo-500">{icon}</div>
            {text}
        </div>
    );
}
