import { HourlyStatItem } from '@/types';
import { useIsDarkMode } from '@/hooks/use-is-dark-mode';
import { cn } from '@/lib/utils';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

interface Props {
    data: HourlyStatItem[];
    title: string;
    className?: string;
}

export default function HourlyAttemptsChart({ data, title, className }: Props) {
    const isDark = useIsDarkMode();

    // Fill all 24 hours with 0 by default
    const counts = Array(24).fill(0);
    data.forEach((item) => {
        counts[item.hour] = item.items_count;
    });

    const chartData = {
        labels: HOURS,
        datasets: [
            {
                label: title,
                data: counts,
                backgroundColor: 'rgba(36, 129, 204, 0.75)',
                hoverBackgroundColor: 'rgba(36, 129, 204, 1)',
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: title,
                color: isDark ? '#f1f5f9' : '#1e293b',
                font: { size: 14, weight: 700 as const },
                padding: { bottom: 16 },
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                padding: 12,
                cornerRadius: 12,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: isDark ? '#64748b' : '#94a3b8',
                    maxRotation: 45,
                    font: { size: 11 },
                },
            },
            y: {
                beginAtZero: true,
                ticks: { color: isDark ? '#64748b' : '#94a3b8' },
                grid: {
                    color: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(226,232,240,0.4)',
                },
            },
        },
    };

    return (
        <div className={cn("w-full rounded-2xl border border-border bg-card p-6 shadow-sm", className)}>

            <div className="h-[300px] w-full">
                <Bar key={isDark ? 'dark' : 'light'} data={chartData} options={options} />
            </div>
        </div>
    );
}
