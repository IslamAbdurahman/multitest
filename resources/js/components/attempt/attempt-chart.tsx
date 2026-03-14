import { Attempt } from '@/types';
import { BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useAppearance } from '@/hooks/use-appearance';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

export default function AttemptsChart({ attempts }: { attempts: Attempt[] }) {
    const { t } = useTranslation();
    const { appearance } = useAppearance();

    // Determine if we are in dark mode reactively
    const isDark = appearance === 'dark' || 
        (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // X o'qi uchun sanalar
    const labels = attempts.map((a) =>
        new Date(a.finished_at || a.started_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }),
    );

    // 1. Dinamik MAKSIMAL qiymatni aniqlash
    // Agar barcha ballar 9 dan kichik bo'lsa (IELTS), 9 qoladi.
    // Agar ballar 75 gacha bo'lsa, eng katta ballga qarab grafik o'zgaradi.
    const highestScore = Math.max(...attempts.map((a) => a.score ?? 0), 9);
    const chartMax = highestScore > 9 ? Math.ceil(highestScore / 5) * 5 + 5 : 9;

    const partConfig = [
        { key: 'Part 1', color: '99, 102, 241' },
        { key: 'Part 1.1', color: '244, 63, 94' },
        { key: 'Part 2', color: '16, 185, 129' },
        { key: 'Part 3', color: '245, 158, 11' },
    ];

    const datasets = partConfig.map((config, c_index) => ({
        label: `${t('practice_show.part_label')} ${config.key.split(' ')[1]}`,
        data: attempts.map((a) => a.attempt_parts?.[c_index]?.ai_score_avg ?? 0),
        backgroundColor: `rgba(${config.color}, 0.8)`,
        borderRadius: 6,
        hoverBackgroundColor: `rgba(${config.color}, 1)`,
        barThickness: 'flex' as const, // Ustunlar soniga qarab moslashadi
        maxBarThickness: 20,
    }));

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'end' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: { size: 12, weight: 600 },
                    color: isDark ? '#94a3b8' : '#64748b',
                },
            },
            tooltip: {
                backgroundColor: isDark ? '#0f172a' : '#1e293b',
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
                // ✅ MUHIM: Endi max qiymati 9 emas, dinamik chartMax
                max: chartMax,
                ticks: {
                    stepSize: highestScore > 10 ? undefined : 1, // Katta sonlarda step avtomatik bo'lgani ma'qul
                    color: isDark ? '#64748b' : '#94a3b8',
                },
                grid: { 
                    color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.4)' 
                },
            },
        },
    };

    return (
        <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 dark:backdrop-blur-xl">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('exam_attempts.performance')}</h3>
                <p className="text-sm text-slate-500">{t('exam_attempts.track_and_review_student_performance')}</p>
            </div>

            <div className="h-[320px] w-full">
                <Bar key={isDark ? 'dark' : 'light'} data={{ labels, datasets }} options={options} />
            </div>
        </div>
    );
}
