interface CircularTimerProps {
    timeLeft: number;
    totalTime: number;
    phase: string;
}

export default function CircularTimer({ timeLeft, totalTime, phase }: CircularTimerProps) {
    const size = 140;
    const strokeWidth = 11;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // Progress goes from 1 (full) down to 0 (empty), clockwise
    const progress = totalTime > 0 ? timeLeft / totalTime : 0;
    // strokeDashoffset: 0 = full circle, circumference = empty
    // We want it to "decrease" clockwise as time runs out
    const dashOffset = circumference * (1 - progress);

    const isRecording = phase === 'recording';
    const isReady = phase === 'ready';
    const isUploading = phase === 'uploading';

    const trackColor = isRecording
        ? 'var(--color-destructive, #ef4444)'
        : isReady
          ? 'var(--color-warning, #f59e0b)'
          : 'var(--primary, #6366f1)';

    const bgTrackColor = isRecording
        ? 'rgba(239, 68, 68, 0.15)'
        : isReady
          ? 'rgba(245, 158, 11, 0.15)'
          : 'rgba(99, 102, 241, 0.15)';

    const timeColor = isRecording
        ? 'var(--color-destructive, #dc2626)'
        : isReady
          ? 'var(--color-warning, #d97706)'
          : 'var(--primary, #4f46e5)';

    const displayTime = () => {
        if (isUploading) return '--';
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        if (mins > 0) {
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        return `${secs}`;
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-scale-x-100 rotate-[-270deg]"
            >
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={bgTrackColor}
                    strokeWidth={strokeWidth}
                />
                {/* Animated countdown arc - decreases clockwise */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s' }}
                />
            </svg>
            {/* Center number */}
            <span
                className="absolute font-black tabular-nums transition-colors duration-300"
                style={{
                    color: timeColor,
                    fontSize: timeLeft >= 100 ? '1.5rem' : timeLeft >= 10 ? '2rem' : '2.5rem',
                    lineHeight: 1,
                }}
            >
                {displayTime()}
            </span>
        </div>
    );
}
