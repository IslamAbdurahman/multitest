import { useEffect, useRef } from 'react';

interface AudioEqualizerProps {
    analyser: AnalyserNode | null;
    active: boolean;
}

export default function AudioEqualizer({
                                           analyser,
                                           active,
                                       }: AudioEqualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!analyser || !active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Set higher FFT size for a denser, more "pro" look
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Styling constants
            const barWidth = (canvas.width / bufferLength) * 2;
            const gap = 3;
            let x = 0;

            // Premium Indigo Gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop(0, '#6366f1'); // Indigo-500
            gradient.addColorStop(1, '#8b5cf6'); // Violet-500

            for (let i = 0; i < bufferLength; i++) {
                // Amplify the data slightly for better visibility
                const amplitude = dataArray[i] / 255;
                const barHeight = amplitude * canvas.height * 0.8; // Use 80% of canvas height
                const minHeight = 6; // Thicker line when silent
                const finalHeight = Math.max(barHeight, minHeight);

                ctx.fillStyle = gradient;

                // Draw pill-shaped bars centered vertically
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(
                        x,
                        (canvas.height / 2) - (finalHeight / 2),
                        barWidth - gap,
                        finalHeight,
                        10
                    );
                } else {
                    // Fallback for older browsers
                    ctx.fillRect(x, (canvas.height / 2) - (finalHeight / 2), barWidth - gap, finalHeight);
                }
                ctx.fill();

                x += barWidth;
            }
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [analyser, active]);

    if (!active) return null;

    return (
        <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/30 px-6 dark:border-indigo-900/30 dark:bg-indigo-950/20">
            {/* The Visualizer Canvas */}
            <canvas
                ref={canvasRef}
                width={1000} // Internal width for sharpness
                height={120} // Internal height
                className="h-12 w-full" // Display height (controlled by CSS)
            />

            {/* Subtle pulse glow to make it feel bigger/active */}
            <div className="absolute inset-0 animate-pulse bg-indigo-500/5 pointer-events-none" />
        </div>
    );
}
