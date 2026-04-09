import TMALayout from '@/layouts/tma-layout';
import { useTelegram } from '@/hooks/use-telegram';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
    CheckCircle2, 
    AlertCircle, 
    Touchpad, 
    Command, 
    ArrowRight, 
    Zap,
    Layout as IconLayout,
    Laptop,
    Smartphone
} from 'lucide-react';

export default function TMADemo() {
    const { haptic, showMainButton, showAlert } = useTelegram();
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const features = [
        { id: 1, title: 'Light Impact', type: 'impact', style: 'light' as const, icon: <Touchpad className="w-5 h-5" /> },
        { id: 2, title: 'Medium Impact', type: 'impact', style: 'medium' as const, icon: <Touchpad className="w-5 h-5" /> },
        { id: 3, title: 'Success Vibe', type: 'notification', style: 'success' as const, icon: <CheckCircle2 className="w-5 h-5" /> },
        { id: 4, title: 'Error Vibe', type: 'notification', style: 'error' as const, icon: <AlertCircle className="w-5 h-5" /> },
    ];

    const handleHaptic = (f: any) => {
        if (f.type === 'impact') {
            haptic.impact(f.style);
        } else {
            haptic.notification(f.style);
        }
        setSelectedId(f.id);
        haptic.selection(); // Trigger additional selection feedback
    };

    const handleMainButton = () => {
        haptic.impact('heavy');
        showMainButton('Confirmed!', () => {
            showAlert('Action confirmed via Telegram Main Button!');
        });
    };

    return (
        <TMALayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            TMA Premium UI
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium">Telegram Mini App Experience</p>
                    </div>
                    <div className="flex bg-secondary/50 p-1 rounded-full border border-border">
                        <Smartphone className="w-4 h-4 m-1 text-blue-600" />
                        <Laptop className="w-4 h-4 m-1 text-muted-foreground" />
                    </div>
                </div>
            }
            footer={
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleMainButton}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all active:scale-[0.96] hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                    >
                        <Zap className="w-5 h-5 group-hover:animate-pulse" />
                        Aktivlashtirish (MainButton)
                    </button>
                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold">
                        Powered by Antigravity AI
                    </p>
                </div>
            }
        >
            <Head title="TMA Interface Demo" />

            <div className="space-y-8">
                {/* Introduction Section */}
                <section>
                    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl dark:from-slate-800 dark:to-slate-950">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                             Welcome, User! <span className="animate-bounce">👋</span>
                        </h3>
                        <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                            Bu interfeys Telegram Mini App'lar uchun maxsus optimizatsiya qilingan.
                            Safe area'lar, haptic teginishlar va silliq animatsiyalar bilan premium tajribadan bahramand bo'ling.
                        </p>
                    </div>
                </section>

                {/* Haptic Feedback Demo */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                           <Command className="w-4 h-4" /> Haptic Test (Vibratsiya)
                        </h4>
                        <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                            NATIVE EVENT
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {features.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => handleHaptic(f)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-5 transition-all active:scale-[0.95] duration-200",
                                    selectedId === f.id 
                                        ? "border-blue-500 bg-blue-50/50 text-blue-700 ring-2 ring-blue-400/30 scale-105 z-10 dark:bg-blue-950/30 dark:text-blue-300" 
                                        : "border-border hover:border-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-900/10"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-xl transition-colors",
                                    selectedId === f.id ? "bg-blue-600 text-white" : "bg-secondary text-muted-foreground"
                                )}>
                                    {f.icon}
                                </div>
                                <span className="text-sm font-semibold">{f.title}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Layout Features */}
                <section className="space-y-4">
                     <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <IconLayout className="w-4 h-4" /> Layout Details
                    </h4>
                    <div className="space-y-3">
                        <div className="flex items-start gap-4 rounded-xl border border-border p-4 bg-card/40">
                             <div className="mt-1 flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                             </div>
                             <div>
                                <p className="text-sm font-bold">Mobile First & Safe Area</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Telegram kamerasi va pastki qismiga xalaqit bermaydi.
                                </p>
                             </div>
                        </div>
                        <div className="flex items-start gap-4 rounded-xl border border-border p-4 bg-card/40">
                             <div className="mt-1 flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                             </div>
                             <div>
                                <p className="text-sm font-bold">Full Scroll Support</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Kontent qismi mustaqil scroll bo'lib, header va footer qotib turadi.
                                </p>
                             </div>
                        </div>
                         <div className="flex items-start gap-4 rounded-xl border border-border p-4 bg-card/40">
                             <div className="mt-1 flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                             </div>
                             <div>
                                <p className="text-sm font-bold">Desktop Ready</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Desktopda ekranni 3 ga bo'lib ko'rsatuvchi interfeys.
                                </p>
                             </div>
                        </div>
                    </div>
                </section>

                {/* Example Content Block */}
                <section className="pb-10">
                    <div className="rounded-2xl border border-dashed border-border p-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="relative">
                             <div className="absolute -inset-1 rounded-full bg-blue-500 blur opacity-25 animate-pulse"></div>
                             <ArrowRight className="w-12 h-12 text-blue-600 relative" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Scroll test qilish uchun qo'shimcha bo'shliq...
                        </p>
                    </div>
                </section>
            </div>
        </TMALayout>
    );
}
