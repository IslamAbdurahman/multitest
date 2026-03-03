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
                <DialogContent className="overflow-hidden rounded-[2.5rem] border-none bg-white p-0 shadow-2xl sm:max-w-[500px] dark:bg-slate-950">
                    {/* 🌑 Header: Dark Themed for Focus */}
                    <div className="bg-slate-900 p-10 text-white dark:bg-slate-900/50">
                        <DialogHeader>
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-indigo-500/30 bg-indigo-500/20 text-indigo-400">
                                <Headphones className="h-7 w-7" />
                            </div>
                            <DialogTitle className="text-3xl leading-tight font-black tracking-tight">{t('attempt_modal.ready_title')}</DialogTitle>
                            <DialogDescription className="mt-2 text-base font-medium text-slate-400">
                                {t('attempt_modal.mic_requirement')}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="space-y-8 p-10">
                        {/* 🎙️ Mic Testing Area */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                                    <Mic2 className="h-3.5 w-3.5 text-indigo-500" />
                                    {t('attempt_modal.mic_check')}
                                </span>
                                {hasCheckedMic && (
                                    <span className="flex items-center gap-1 text-[10px] font-black tracking-widest text-emerald-500 uppercase">
                                        <ShieldCheck className="h-3.5 w-3.5" />
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
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                                        <audio controls src={audioUrl} className="h-9 w-full opacity-80" />
                                    </div>
                                    <p className="mt-2 text-center text-[10px] font-bold text-slate-400">{t('attempt_modal.ensure_clear')}</p>
                                </div>
                            )}
                        </div>

                        {/* 🚀 Action Area */}
                        <DialogFooter className="pt-2">
                            <form onSubmit={submit} className="w-full">
                                <Button
                                    type="submit"
                                    disabled={processing || !hasCheckedMic}
                                    className={`group h-16 w-full rounded-2xl text-sm font-black transition-all ${
                                        hasCheckedMic
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-[0.98]'
                                            : 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600'
                                    }`}
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            {t('common.preparing')}...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2 tracking-widest uppercase">
                                            {t('attempt_modal.start_now')}
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    )}
                                </Button>

                                {!hasCheckedMic && (
                                    <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-50 py-2 dark:bg-amber-900/10">
                                        <span className="text-[10px] font-black tracking-tight text-amber-600 uppercase">
                                            {t('attempt_modal.record_to_unlock')}
                                        </span>
                                    </div>
                                )}
                            </form>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
