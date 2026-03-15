import CircularTimer from '@/components/practice/CircularTimer';
import { router } from '@inertiajs/react';
import { CloudUpload, Info, Maximize, Mic, Minimize, Timer, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function QuestionPlayer({ attempt_part }: any) {
    const { t } = useTranslation();
    const questions = attempt_part.part.questions;

    const [index, setIndex] = useState(-1);
    const [phase, setPhase] = useState<'introduction' | 'audio' | 'ready' | 'recording' | 'uploading'>('introduction');
    const [timer, setTimer] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const playerRef = useRef<HTMLDivElement>(null);

    const recorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const answersRef = useRef<any[]>([]);
    const recordingStartTimeRef = useRef<string>('');

    useEffect(() => {
        setIndex(-1);
        setPhase('introduction');
        answersRef.current = [];
        return () => stopAllMedia();
    }, [attempt_part.id]);

    const stopAllMedia = () => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
            recorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    const question = index >= 0 ? questions[index] : null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    /* Phase 0: Part Introduction */
    useEffect(() => {
        if (phase !== 'introduction') return;
        const introAudio = new Audio(attempt_part.part.audio_path);
        introAudio.play().catch(() => {
            setIndex(0);
            setPhase('audio');
        });
        introAudio.onended = () => {
            setIndex(0);
            setPhase('audio');
        };
        return () => {
            introAudio.pause();
            introAudio.src = '';
        };
    }, [phase, attempt_part.id]);

    /* Phase 1: Question Audio */
    useEffect(() => {
        if (phase !== 'audio' || !question) return;
        const audio = new Audio(question.audio_path);
        audio.play().catch(() => {
            setPhase('ready');
            setTimer(question.ready_second);
        });
        audio.onended = () => {
            const readySec = question.ready_second;
            setPhase('ready');
            setTimer(readySec);
            setTotalTime(readySec);
        };
        return () => {
            audio.pause();
            audio.src = '';
        };
    }, [phase, index]);

    /* Auto full-screen when first question starts */
    useEffect(() => {
        if (phase === 'audio' && index === 0 && !document.fullscreenElement) {
            playerRef.current?.requestFullscreen().catch(() => {});
        }
    }, [phase, index]);

    /* Phase 2 & 3: Timer Logic */
    useEffect(() => {
        if ((phase !== 'ready' && phase !== 'recording') || !question) return;
        if (timer <= 0) {
            if (phase === 'ready') {
                handleTransitionToRecording();
            } else if (phase === 'recording') {
                if (recorderRef.current && recorderRef.current.state === 'recording') {
                    recorderRef.current.stop();
                }
            }
            return;
        }
        const i = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(i);
    }, [phase, timer]);

    const handleTransitionToRecording = () => {
        const startSound = new Audio('/audio/begin-audio.m4a');
        startSound.play()
            .then(() => { startSound.onended = () => startRecording(); })
            .catch(() => startRecording());
    };

    const startRecording = async () => {
        if (!question) return;
        try {
            stopAllMedia();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Check supported types (Chrome prefers webm, Safari prefers mp4/ogg)
            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : 'audio/ogg';

            const recorder = new MediaRecorder(stream, { mimeType });
            recorderRef.current = recorder;
            chunksRef.current = [];
            recordingStartTimeRef.current = new Date().toISOString();

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const capturedBlob = new Blob(chunksRef.current, { type: recorder.mimeType });

                // Extract extension for the filename
                const extension = recorder.mimeType.includes('webm') ? 'webm' : 'ogg';

                answersRef.current.push({
                    question_id: question.id,
                    started_at: recordingStartTimeRef.current,
                    finished_at: new Date().toISOString(),
                    audio: capturedBlob,
                    ext: extension
                });

                chunksRef.current = [];
                stopAllMedia();
                goNext();
            };

            recorder.start();
            setPhase('recording');
            setTimer(question.answer_second);
            setTotalTime(question.answer_second);
        } catch (err) {
            alert(t('question_player.mic_error'));
        }
    };

    const submitAnswerIncremental = (answer: any) => {
        const form = new FormData();
        form.append(`answers[0][question_id]`, answer.question_id);
        form.append(`answers[0][started_at]`, answer.started_at);
        form.append(`answers[0][finished_at]`, answer.finished_at);
        form.append(`answers[0][audio_path]`, answer.audio, `q_${answer.question_id}.${answer.ext}`);
        
        // Use standard fetch for a silent "fire and forget" auto-save
        fetch(route('practice.save_answers', attempt_part.id), {
            method: 'POST',
            body: form,
            headers: {
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Auto-save failed:', response.statusText, errorData.errors || errorData);
            }
        })
        .catch(error => {
            console.error('Auto-save network error:', error);
        });
    };

    const goNext = () => {
        const lastAnswer = answersRef.current[answersRef.current.length - 1];
        if (lastAnswer) {
            submitAnswerIncremental(lastAnswer);
        }

        if (index + 1 < questions.length) {
            setIndex((i) => i + 1);
            setPhase('audio');
        } else {
            setPhase('uploading');
            submit(); // Final submit to handle navigation
        }
    };

    const submit = () => {
        const form = new FormData();
        answersRef.current.forEach((a, i) => {
            form.append(`answers[${i}][question_id]`, a.question_id);
            form.append(`answers[${i}][started_at]`, a.started_at);
            form.append(`answers[${i}][finished_at]`, a.finished_at);
            form.append(`answers[${i}][audio_path]`, a.audio, `q_${a.question_id}.${a.ext}`);
        });

        const next = attempt_part.attempt.attempt_parts.find((p: any) => p.id > attempt_part.id);
        if (next) form.append('next_attempt_part_id', next.id);

        router.post(route('practice.save_answers', attempt_part.id), form);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerRef.current?.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div
            ref={playerRef}
            className={`mx-auto w-full overflow-hidden border border-slate-800 bg-white shadow-2xl transition-all duration-300 dark:bg-slate-900 ${isFullscreen ? 'rounded-none min-h-screen flex flex-col' : 'rounded-2xl md:rounded-3xl'}`}
        >
            {/* ═══ TOP HEADER BAR — Official Navy ═══ */}
            <div className="flex items-center justify-between bg-slate-900 px-4 py-3 md:px-8 md:py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 ring-1 ring-indigo-400/30">
                        <span className="text-base">🇺🇿</span>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[9px] font-bold tracking-widest text-indigo-300 uppercase">National Assessment System</p>
                        <p className="text-xs font-black text-white tracking-tight">{attempt_part.part.title}</p>
                    </div>
                    <div className="block sm:hidden">
                        <p className="text-xs font-black text-white">{attempt_part.part.title}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <PhaseBadge phase={phase} />
                    <button
                        onClick={toggleFullscreen}
                        className="flex items-center justify-center rounded-lg bg-white/10 p-2 text-slate-300 transition-colors hover:bg-white/20"
                        title={isFullscreen ? t('common.exit_fullscreen') : t('common.fullscreen')}
                    >
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* ═══ MAIN CONTENT AREA ═══ */}
            <div className={`grid grid-cols-1 md:grid-cols-12 ${isFullscreen ? 'flex-1' : 'min-h-[480px] md:min-h-[560px]'}`}>

                {/* LEFT: Question / Instruction Content */}
                <div className="flex flex-col justify-center border-b border-slate-100 p-6 md:col-span-8 md:border-b-0 md:border-r md:p-12">
                    {/* Phase Label */}
                    <div className="mb-4 flex items-center gap-2">
                        <div className="h-px flex-1 bg-slate-100" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                            {phase === 'introduction'
                                ? t('question_player.introduction')
                                : phase === 'uploading'
                                    ? t('question_player.saving_results')
                                    : t('question_player.question_counter', { current: index + 1, total: questions.length })}
                        </span>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    {/* Content */}
                    {phase === 'introduction' ? (
                        <div className="space-y-5">
                            <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
                                {attempt_part.part.name}
                            </h2>
                            <div
                                className="prose prose-slate max-w-none text-lg leading-relaxed text-slate-600 md:text-xl"
                                dangerouslySetInnerHTML={{ __html: attempt_part.part.description }}
                            />
                        </div>
                    ) : phase === 'uploading' ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                                <CloudUpload className="h-8 w-8 animate-bounce text-indigo-500" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">{t('question_player.uploading_title')}</h2>
                            <p className="text-slate-500">{t('question_player.uploading_desc')}</p>
                        </div>
                    ) : (
                        <div
                            className="prose prose-slate max-w-none text-xl font-semibold leading-relaxed text-slate-800 md:text-3xl"
                            dangerouslySetInnerHTML={{ __html: question?.textarea }}
                        />
                    )}
                </div>

                {/* RIGHT: Status Panel — Dark */}
                <div className="flex flex-col items-center justify-center gap-6 bg-slate-900 p-6 text-center md:col-span-4 md:p-10">
                    {/* Circular Timer */}
                    <CircularTimer timeLeft={timer} totalTime={totalTime} phase={phase} />

                    {/* Mic / Status Pod */}
                    <RecordingPod phase={phase} />

                    {/* Status Card */}
                    <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <p className="mb-1 text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">{t('question_player.status')}</p>
                        <p className="text-sm font-bold text-white">
                            {phase === 'introduction'
                                ? t('question_player.status_intro')
                                : phase === 'audio'
                                    ? t('question_player.status_listening')
                                    : phase === 'ready'
                                        ? t('question_player.status_preparing')
                                        : phase === 'uploading'
                                            ? t('question_player.status_uploading')
                                            : t('question_player.status_capturing')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══ Sub-Components ═══

function RecordingPod({ phase }: { phase: string }) {
    const { t } = useTranslation();

    if (phase === 'uploading') {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-400/30" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                        <CloudUpload size={28} className="animate-bounce" strokeWidth={2} />
                    </div>
                </div>
                <span className="animate-pulse text-[10px] font-black tracking-[0.15em] text-indigo-400 uppercase">
                    {t('question_player.uploading_live')}
                </span>
            </div>
        );
    }

    if (phase === 'recording') {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="relative">
                    <div className="absolute -inset-2 animate-ping rounded-full bg-red-500/20" />
                    <div className="absolute -inset-1 animate-pulse rounded-full bg-red-500/10" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/40">
                        <Mic size={28} strokeWidth={2} />
                    </div>
                </div>
                <span className="animate-pulse text-[10px] font-black tracking-[0.15em] text-red-400 uppercase">
                    {t('question_player.recording_live')}
                </span>
            </div>
        );
    }

    if (phase === 'ready') {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                    <Timer size={28} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-black tracking-[0.15em] text-amber-400 uppercase">{t('question_player.get_ready')}</span>
            </div>
        );
    }

    if (phase === 'introduction') {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                    <Info size={28} strokeWidth={2} />
                </div>
                <span className="text-[10px] font-black tracking-[0.15em] text-indigo-400 uppercase">{t('question_player.part_intro')}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400">
                <Volume2 size={28} />
            </div>
            <span className="text-[10px] font-black tracking-[0.15em] text-slate-500 uppercase">{t('question_player.playing_audio')}</span>
        </div>
    );
}

function PhaseBadge({ phase }: { phase: string }) {
    const { t } = useTranslation();
    const styles: Record<string, string> = {
        introduction: 'bg-indigo-500/20 text-indigo-300 ring-indigo-500/30',
        audio: 'bg-blue-500/20 text-blue-300 ring-blue-500/30',
        ready: 'bg-amber-500/20 text-amber-300 ring-amber-500/30',
        recording: 'bg-red-500/20 text-red-300 ring-red-500/30',
        uploading: 'bg-indigo-500/20 text-indigo-300 ring-indigo-500/30',
    };
    return (
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black tracking-widest ring-1 uppercase ${styles[phase] ?? styles.introduction}`}>
            <span className={`h-1.5 w-1.5 rounded-full bg-current ${phase === 'recording' ? 'animate-pulse' : phase === 'uploading' ? 'animate-bounce' : ''}`} />
            {phase === 'introduction' ? t('question_player.phase_intro')
                : phase === 'audio' ? t('question_player.phase_instruction')
                : phase === 'ready' ? t('question_player.phase_preparing')
                : phase === 'uploading' ? t('question_player.phase_saving')
                : t('question_player.phase_answering')}
        </div>
    );
}
