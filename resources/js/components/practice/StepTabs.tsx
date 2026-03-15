import { type AttemptPart } from '@/types';
import { Check } from 'lucide-react';

type StepTabsProps = {
    attempt_parts: AttemptPart[];
    active: number;
};

export default function StepTabs({ attempt_parts, active }: StepTabsProps) {
    const activeIndex = attempt_parts.findIndex((p) => p.id === active);

    return (
        <div className="scrollbar-hide flex w-full items-center justify-between gap-1 overflow-x-auto px-2 py-3 md:px-4">
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
                                    className={`flex h-8 md:h-10 min-w-[2rem] md:min-w-[3rem] items-center justify-center gap-1 md:gap-2 rounded-lg border px-2 md:px-4 transition-all duration-500 ease-out ${
                                        isActive
                                            ? 'border-indigo-400/40 bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                            : isCompleted
                                              ? 'border-white/20 bg-white/10 text-white'
                                              : 'border-white/10 bg-white/5 text-slate-400'
                                    }`}
                                >
                                    {isCompleted && <Check className="h-4 w-4 shrink-0 stroke-[4]" />}

                                    <span
                                        className={`text-[8px] md:text-[10px] font-black tracking-tight whitespace-nowrap uppercase ${
                                            isActive ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                                        }`}
                                    >
                                        {p.part?.name}
                                    </span>
                                </div>

                                {/* Pulse Effect for active step */}
                                {isActive && <div className="absolute inset-0 -z-10 scale-110 animate-pulse rounded-lg bg-indigo-400/20" />}
                            </div>
                        </div>

                        {/* Connector Line */}
                        {!isLast && (
                            <div className="mx-1 md:mx-2 h-px md:h-0.5 min-w-[0.5rem] md:min-w-[2rem] flex-1 rounded-full bg-white/10">
                                <div
                                    className="h-full bg-indigo-400 transition-all duration-1000 ease-in-out"
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
