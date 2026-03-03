import { AttemptAnswer } from '@/types';
import { AlertCircle, BrainCircuit, Clock, FileText, Mic, Sparkles, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuestionTableProps {
    attempt_answers: AttemptAnswer[];
}

const AttemptAnswerComponent = ({ attempt_answers }: QuestionTableProps) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-8">
            {attempt_answers?.map((item, index) => {
                const globalIndex = index + 1;

                return (
                    <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-1 shadow-sm transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex flex-col lg:flex-row">
                            {/* 📝 LEFT SIDE: THE QUESTION */}
                            <div className="flex-1 p-8 lg:border-r lg:border-slate-50 lg:dark:border-slate-800">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800">
                                            {globalIndex.toString().padStart(2, '0')}
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            {t('response_card.question_details')}
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Badge
                                            icon={<Clock className="h-3 w-3" />}
                                            label={`${item.question?.ready_second}s`}
                                            title={t('response_card.preparation_time')}
                                        />
                                        <Badge
                                            icon={<Mic className="h-3 w-3" />}
                                            label={`${item.question?.answer_second}s`}
                                            title={t('response_card.speaking_time')}
                                        />
                                    </div>
                                </div>

                                <div
                                    className="prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-img:rounded-3xl prose-p:text-slate-700 dark:prose-p:text-slate-300 max-w-none"
                                    dangerouslySetInnerHTML={{ __html: item.question?.textarea ?? '' }}
                                />
                            </div>

                            {/* 🎙️ RIGHT SIDE: THE RESPONSE */}
                            <div className="flex-1 bg-slate-50/50 p-8 dark:bg-slate-800/20">
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-[10px] font-black tracking-widest text-indigo-500 uppercase">
                                        <Volume2 className="h-3.5 w-3.5" />
                                        {t('response_card.student_response')}
                                    </span>

                                    {/* AI Score Badge */}
                                    <div className="flex items-center gap-2 rounded-xl border border-purple-100 bg-white px-3 py-1.5 shadow-sm dark:border-purple-900/30 dark:bg-slate-800">
                                        <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                                        <span className="text-xs font-black text-slate-700 dark:text-slate-200">
                                            {t('response_card.ai_score')}: {item.score_ai ?? '0.0'}
                                        </span>
                                    </div>
                                </div>

                                {/* Audio Player */}
                                {item.audio_path ? (
                                    <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                        <audio preload="none" controls className="h-10 w-full focus:outline-none">
                                            <source src={item.audio_path} type="audio/mpeg" />
                                            {t('response_card.audio_not_supported')}
                                        </audio>
                                    </div>
                                ) : (
                                    <div className="mb-6 flex h-16 items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-xs font-bold text-slate-400 dark:border-slate-800 dark:bg-slate-950/50">
                                        <AlertCircle className="h-4 w-4" />
                                        {t('response_card.no_audio')}
                                    </div>
                                )}

                                {/* Transcript & Feedback */}
                                <div className="space-y-5">
                                    {item.transcript && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                                                <FileText className="h-3 w-3" />
                                                {t('response_card.transcript')}
                                            </div>
                                            <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 text-sm leading-relaxed text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
                                                {item.transcript}
                                            </div>
                                        </div>
                                    )}

                                    {item.review_ai && (
                                        <div className="group/ai relative space-y-2">
                                            <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-purple-500 uppercase">
                                                <BrainCircuit className="h-3 w-3" />
                                                {t('response_card.ai_analysis')}
                                            </div>
                                            <div className="relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 to-white p-4 text-sm leading-relaxed text-purple-900/80 shadow-sm dark:border-purple-900/20 dark:from-purple-900/10 dark:to-slate-900 dark:text-purple-300">
                                                <div className="relative z-10 italic">{item.review_ai}</div>
                                                <Sparkles className="absolute -right-2 -bottom-2 h-12 w-12 rotate-12 text-purple-500/5" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/* --- UI Helper --- */
function Badge({ icon, label, title }: { icon: React.ReactNode; label: string; title?: string }) {
    return (
        <div
            title={title}
            className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
            {icon}
            {label}
        </div>
    );
}

export default AttemptAnswerComponent;
