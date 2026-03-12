import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioWaveformProps {
    audioUrl: string;
    height?: number;
    waveColor?: string;
    progressColor?: string;
}

export default function AudioWaveform({
    audioUrl,
    height = 60,
    waveColor = '#cbd5e1',
    progressColor = '#6366f1'
}: AudioWaveformProps) {
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (!waveformRef.current) return;

        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor,
            progressColor,
            height,
            cursorWidth: 1,
            barWidth: 2,
            barGap: 3,
            barRadius: 3,
            url: audioUrl,
        });

        wavesurfer.current.on('play', () => setIsPlaying(true));
        wavesurfer.current.on('pause', () => setIsPlaying(false));
        wavesurfer.current.on('finish', () => setIsPlaying(false));

        return () => {
            wavesurfer.current?.destroy();
        };
    }, [audioUrl, waveColor, progressColor, height]);

    const handleTogglePlay = () => {
        wavesurfer.current?.playPause();
    };

    const handleToggleMute = () => {
        if (wavesurfer.current) {
            wavesurfer.current.setMuted(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="flex w-full items-center gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <Button
                variant="outline"
                size="icon"
                onClick={handleTogglePlay}
                className="h-10 w-10 shrink-0 rounded-full border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400"
            >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
            </Button>

            <div ref={waveformRef} className="flex-1" />

            <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleMute}
                className="h-8 w-8 shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
        </div>
    );
}
