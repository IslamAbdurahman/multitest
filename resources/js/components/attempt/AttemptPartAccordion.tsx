import AttemptAnswerComponent from '@/components/attempt/AttemptAnswer';
import { AttemptPart } from '@/types';
import { CheckCircle2, ChevronDown, Info, Star } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PartAccordionProps {
    attempt_parts: AttemptPart[];
    isAdmin?: boolean;
    isTeacher?: boolean;
}

export default function AttemptPartAccordion({ attempt_parts }: PartAccordionProps) {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open the first part

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            {attempt_parts.map((item: AttemptPart, index: number) => {
                const isOpen = openIndex === index;
                const globalIndex = index + 1;

                // Calculate total score for this specific part
                const partScore = item?.ai_score_avg ?? 0;
                const totalQuestions = item.attempt_answers?.length || 0;

                return (
                    <div
                        key={item.id}
                        className={`overflow-hidden rounded-[2rem] border transition-all duration-500 ease-in-out ${
                            isOpen
                                ? 'border-indigo-200 bg-white shadow-2xl shadow-indigo-500/10 dark:border-indigo-500/30 dark:bg-slate-900'
                                : 'border-slate-100 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40'
                        }`}
                    >
                        {/* Accordion Header */}
                        <button
                            type="button"
                            onClick={() => toggle(index)}
                            className="group flex w-full items-center justify-between px-6 py-5 focus:outline-none"
                        >
                            <div className="flex items-center gap-5">
                                {/* Number Indicator */}
                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black transition-all duration-300 ${
                                        isOpen
                                            ? 'scale-110 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                            : 'border border-slate-100 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800'
                                    }`}
                                >
                                    {globalIndex.toString().padStart(2, '0')}
                                </div>

                                <div className="text-left">
                                    <h3
                                        className={`text-lg font-black tracking-tight transition-colors duration-300 ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}
                                    >
                                        {item.part?.name}
                                    </h3>
                                    <div className="mt-0.5 flex items-center gap-2">
                                        <CheckCircle2 className={`h-3 w-3 ${totalQuestions > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                            {totalQuestions} {t('questions_answered')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                {/* Score Badge */}
                                <div className="hidden items-center gap-3 border-l border-slate-100 pl-8 sm:flex dark:border-slate-800">
                                    <div className="text-right">
                                        <p className="mb-1 text-[9px] leading-none font-black tracking-tighter text-slate-400 uppercase">
                                            {t('attempt_details.part_score')}
                                        </p>
                                        <p className="text-xl leading-none font-black text-slate-900 dark:text-white">{partScore.toFixed(1)}</p>
                                    </div>
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${partScore > 0 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-slate-50 dark:bg-slate-800'}`}
                                    >
                                        <Star className={`h-5 w-5 ${partScore > 0 ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                                    </div>
                                </div>

                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </div>
                            </div>
                        </button>

                        {/* Accordion Content with CSS Grid for smooth height animation */}
                        <div
                            className={`grid transition-all duration-500 ease-in-out ${
                                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                            }`}
                        >
                            <div className="overflow-hidden">
                                <div className="space-y-8 border-t border-slate-50 p-8 dark:border-slate-800">
                                    {/* Description/Instruction Box */}
                                    {item.part?.description && (
                                        <div className="flex gap-4 rounded-[1.5rem] border border-indigo-100/50 bg-indigo-50/30 p-5 dark:border-indigo-500/10 dark:bg-indigo-500/5">
                                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />
                                            <div>
                                                <p className="mb-1 text-[10px] font-black tracking-widest text-indigo-500 uppercase">
                                                    {t('instructions')}
                                                </p>
                                                <p className="text-sm leading-relaxed font-medium text-slate-600 dark:text-slate-400">
                                                    {item.part.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Answers List Container */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black tracking-[0.25em] whitespace-nowrap text-slate-400 uppercase">
                                                {t('response_details')}
                                            </span>
                                            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                                        </div>

                                        <div className="rounded-3xl bg-slate-50/50 p-2 dark:bg-slate-950/30">
                                            <AttemptAnswerComponent attempt_answers={item.attempt_answers ?? []} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
