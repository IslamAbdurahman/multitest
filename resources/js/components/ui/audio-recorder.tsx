import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import AudioEqualizer from '@/components/ui/audio-equalizer';

interface AudioRecorderProps {
    onRecorded: (audioUrl: string, audioBlob: Blob) => void;
}

export default function AudioRecorder({ onRecorded }: AudioRecorderProps) {
    const [micAllowed, setMicAllowed] = useState<boolean | null>(null);
    const [recording, setRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    const checkMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMicAllowed(true);
            stream.getTracks().forEach((t) => t.stop());
            toast.success('Microphone found');
        } catch {
            setMicAllowed(false);
            toast.error('Microphone access denied');
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                onRecorded(url, blob);
                setHasRecorded(true);
                stream.getTracks().forEach((t) => t.stop());
                audioContextRef.current?.close();
            };

            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            toast.error("Could not start recorder");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    return (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            {micAllowed === null ? (
                <Button
                    type="button"
                    onClick={checkMic}
                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                >
                    <Mic className="mr-2 h-4 w-4" />
                    Verify Microphone
                </Button>
            ) : !micAllowed ? (
                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
                    <MicOff className="h-5 w-5" />
                    <p className="text-sm font-bold">Please enable microphone access in your browser.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {recording ? 'Live Level' : 'Ready to Test'}
                        </span>
                        {hasRecorded && !recording && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                                <CheckCircle2 className="h-3 w-3" /> Tested
                            </div>
                        )}
                    </div>

                    {/* Equalizer Box */}
                    <div className={`h-16 w-full rounded-2xl flex items-center justify-center border-2 border-dashed transition-colors ${recording ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100 bg-slate-50/50'}`}>
                        {recording ? (
                            <AudioEqualizer analyser={analyserRef.current} active={recording} />
                        ) : (
                            <span className="text-xs font-medium text-slate-400 italic">Level monitor inactive</span>
                        )}
                    </div>

                    {!recording ? (
                        <Button
                            type="button"
                            onClick={startRecording}
                            className="w-full h-12 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold border border-indigo-100"
                        >
                            <Mic className="mr-2 h-4 w-4" />
                            {hasRecorded ? 'Record Again' : 'Record Test Clip'}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={stopRecording}
                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold animate-pulse"
                        >
                            <Square className="mr-2 h-4 w-4 fill-white" />
                            Stop Recording
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
