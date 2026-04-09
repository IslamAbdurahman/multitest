import { Attempt } from '@/types';
import { useAppearance } from '@/hooks/use-appearance';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function AttemptsChart({ attempts, className }: { attempts: Attempt[]; className?: string }) {
    const { t } = useTranslation();
    const { appearance } = useAppearance();

    const isDark =
        appearance === 'dark' ||
        (appearance === 'system' &&
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    const labels = attempts.map((a) =>
        new Date(a.finished_at || a.started_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }),
    );

    const scores = attempts.map((a) => a.score ?? a.ai_score_avg ?? 0);
    const highestScore = Math.max(...scores, 9);
    const chartMax = highestScore > 9 ? Math.ceil(highestScore / 5) * 5 + 5 : 9;

    const chartData = {
        labels,
        datasets: [
            {
                label: t('exam_attempts.score', 'Score'),
                data: scores,
                fill: true,
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
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
                ticks: { color: isDark ? '#64748b' : '#94a3b8' },
            },
            y: {
                min: 0,
                max: chartMax,
                ticks: {
                    stepSize: highestScore > 10 ? undefined : 1,
                    color: isDark ? '#64748b' : '#94a3b8',
                },
                grid: {
                    color: isDark ? 'rgba(51,65,85,0.4)' : 'rgba(226,232,240,0.4)',
                },
            },
        },
    };

    return (
        <Card className={cn("rounded-[2rem] border-border bg-card shadow-sm", className)}>

            <CardHeader>
                <CardTitle className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
                    {t('exam_attempts.performance')}
                </CardTitle>
                <CardDescription>
                    {t('exam_attempts.track_and_review_student_performance')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <Line key={isDark ? 'dark' : 'light'} data={chartData} options={options} />
                </div>
            </CardContent>
        </Card>
    );
}
