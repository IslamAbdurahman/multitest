import { type AttemptPart } from '@/types';
import { Check } from 'lucide-react';

type StepTabsProps = {
    attempt_parts: AttemptPart[];
    active: number;
};

export default function StepTabs({ attempt_parts, active }: StepTabsProps) {
    const activeIndex = attempt_parts.findIndex((p) => p.id === active);

    return (
        <div className="scrollbar-hide flex w-full items-center justify-start gap-0 overflow-x-auto px-4 py-4">
            {attempt_parts.map((p, index) => {
                const isCompleted = index < activeIndex;
                const isActive = p.id === active;
                const isLast = index === attempt_parts.length - 1;

                return (
                    <div key={p.id} className={`flex items-center ${!isLast ? 'flex-1' : 'flex-none'}`}>
                        <div className="group relative flex flex-col items-center">
                            {/* 🔘 Stepper Node - Dynamic Width Pill */}
                            <div className="relative z-10 flex items-center justify-center">
                                <div
                                    className={`flex h-10 md:h-12 min-w-[2.5rem] md:min-w-[3rem] items-center justify-center gap-2 rounded-[1rem] md:rounded-[1.25rem] border-2 md:border-4 px-3 md:px-4 transition-all duration-500 ease-out ${
                                        isActive
                                            ? 'scale-105 border-indigo-100 bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:border-indigo-900/40 dark:shadow-none'
                                            : isCompleted
                                              ? 'border-slate-50 bg-slate-900 text-white dark:border-slate-800'
                                              : 'border-white bg-slate-100 text-slate-400 dark:border-slate-900 dark:bg-slate-800'
                                    }`}
                                >
                                    {isCompleted && <Check className="h-4 w-4 shrink-0 stroke-[4]" />}

                                    <span
                                        className={`text-[10px] md:text-[11px] font-black tracking-tight whitespace-nowrap uppercase ${
                                            isActive ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                                        }`}
                                    >
                                        {p.part?.name}
                                    </span>
                                </div>

                                {/* Pulse Effect for active step */}
                                {isActive && <div className="absolute inset-0 -z-10 scale-110 animate-pulse rounded-[1rem] md:rounded-[1.25rem] bg-indigo-400/30" />}
                            </div>
                        </div>

                        {/* 🔗 Connector Line - Adjusted for center alignment */}
                        {!isLast && (
                            <div className="mx-2 h-[3px] min-w-[2rem] flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-1000 ease-in-out"
                                    style={{ width: isCompleted ? '100%' : '0%' }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
