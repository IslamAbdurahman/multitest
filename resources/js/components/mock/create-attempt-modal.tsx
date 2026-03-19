import AudioRecorder from '@/components/ui/audio-recorder';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mock, Test } from '@/types';
import { useForm } from '@inertiajs/react';
import { ArrowRight, CirclePlay, Headphones, Mic2, ShieldCheck } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Props {
    mock?: Mock;
    test?: Test;
}

export default function CreateAttemptModal({ mock, test }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [hasCheckedMic, setHasCheckedMic] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const { post, processing } = useForm({
        mock_id: mock?.id || null,
        test_id: test?.id || null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('attempt.store'), {
            onSuccess: () => {
                setOpen(false);
                toast.success(t('attempt_modal.good_luck'));
            },
            onError: (err: any) => {
                toast.error(err?.error || t('error.create_failed'));
            },
        });
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 dark:shadow-none"
            >
                <CirclePlay className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-xs tracking-widest uppercase">{t('attempt_modal.start_practice')}</span>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden rounded-[1.25rem] border-none bg-white p-0 shadow-2xl md:rounded-[2rem] sm:max-w-[420px] dark:bg-slate-950">
                    {/* 🌑 Header: Micro-Compact */}
                    <div className="bg-slate-900 p-4 text-white md:p-6 dark:bg-slate-900/50">
                        <DialogHeader>
                            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/20 text-indigo-400">
                                <Headphones className="h-4 w-4" />
                            </div>
                            <DialogTitle className="text-lg md:text-xl leading-snug font-black tracking-tight">{t('attempt_modal.ready_title')}</DialogTitle>
                            <DialogDescription className="mt-0.5 text-[11px] md:text-xs font-medium text-slate-400">
                                {t('attempt_modal.mic_requirement')}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="space-y-4 p-4 md:p-6">
                        {/* 🚀 Primary Action (Micro-Compact) */}
                        <form onSubmit={submit} className="w-full space-y-2.5">
                            <Button
                                type="submit"
                                disabled={processing || !hasCheckedMic}
                                className={`group h-12 w-full rounded-xl text-xs font-black transition-all md:h-14 ${
                                    hasCheckedMic
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98]'
                                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-transparent dark:border-slate-800 cursor-not-allowed'
                                }`}
                            >
                                {processing ? (
                                    <span className="flex items-center gap-1.5">
                                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        {t('common.preparing')}...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-1.5 tracking-widest uppercase">
                                        {t('attempt_modal.start_now')}
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>

                            {!hasCheckedMic && (
                                <div className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 py-1.5 border border-amber-100/50 dark:border-amber-900/20">
                                    <span className="text-[8px] font-black tracking-tight text-amber-600 uppercase">
                                        {t('attempt_modal.record_to_unlock')}
                                    </span>
                                </div>
                            )}
                        </form>

                        {/* 🎙️ Mic Testing Area (Micro-Compact) */}
                        <div className="space-y-3 pt-2 border-t border-slate-50 dark:border-slate-900">
                            <div className="flex items-center justify-between px-1">
                                <span className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.1em] text-slate-400 dark:text-slate-500 uppercase">
                                    <Mic2 className="h-3 w-3 text-indigo-500" />
                                    {t('attempt_modal.mic_check')}
                                </span>
                                {hasCheckedMic && (
                                    <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-emerald-500 uppercase">
                                        <ShieldCheck className="h-3 w-3" />
                                        {t('common.ready')}
                                    </span>
                                )}
                            </div>

                            <AudioRecorder
                                onRecorded={(url) => {
                                    setAudioUrl(url);
                                    setHasCheckedMic(true);
                                }}
                            />

                            {audioUrl && (
                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-1.5 shadow-sm">
                                        <audio controls src={audioUrl} className="h-7 w-full opacity-80" />
                                    </div>
                                    <p className="mt-1 text-center text-[9px] font-bold text-slate-400 dark:text-slate-500">{t('attempt_modal.ensure_clear')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
