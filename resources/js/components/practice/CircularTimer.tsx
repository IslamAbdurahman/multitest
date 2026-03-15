import { useEffect, useState } from 'react';

interface CircularTimerProps {
    seconds: number;
    totalSeconds: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

export default function CircularTimer({
    seconds,
    totalSeconds,
    size = 120,
    strokeWidth = 10,
    className = "",
}: CircularTimerProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (seconds / totalSeconds) * circumference;

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg className="w-full h-full -rotate-90">
                {/* Background Circle */}
                <circle
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Circle */}
                <circle
                    className="text-black transition-all duration-1000 ease-linear"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={isNaN(offset) ? 0 : offset}
                    strokeLinecap="butt"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className="absolute text-5xl md:text-7xl font-bold tracking-tighter text-black tabular-nums">
                {seconds}
            </span>
        </div>
    );
}
