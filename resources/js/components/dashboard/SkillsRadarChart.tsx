import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useAppearance } from '@/hooks/use-appearance';

interface SkillsRadarChartProps {
    skills?: {
        fluency: number;
        vocabulary: number;
        grammar: number;
        pronunciation: number;
    };
}

export default function SkillsRadarChart({ skills }: SkillsRadarChartProps) {
    const { t } = useTranslation();
    const { appearance } = useAppearance();
    
    // Determine if we are in dark mode
    const isDark = typeof window !== 'undefined' ? 
        document.documentElement.classList.contains('dark') : false;

    // Default data if no skills are provided
    const data = skills || {
        fluency: 65,
        vocabulary: 70,
        grammar: 60,
        pronunciation: 75,
    };

    const options: any = {
        chart: {
            toolbar: { show: false },
            background: 'transparent',
            dropShadow: {
                enabled: true,
                blur: 1,
                left: 1,
                top: 1,
                opacity: isDark ? 0.3 : 0.1,
            },
        },
        theme: {
            mode: isDark ? 'dark' : 'light',
        },
        title: {
            show: false,
        },
        stroke: {
            width: 2,
            colors: ['#6366f1'],
        },
        fill: {
            opacity: isDark ? 0.4 : 0.2,
            colors: ['#6366f1'],
        },
        markers: {
            size: 4,
            colors: ['#6366f1'],
            strokeColor: isDark ? '#1e293b' : '#fff',
            strokeWidth: 2,
        },
        xaxis: {
            categories: [
                t('skills.fluency'),
                t('skills.vocabulary'),
                t('skills.grammar'),
                t('skills.pronunciation'),
            ],
            labels: {
                style: {
                    colors: Array(4).fill(isDark ? '#94a3b8' : '#64748b'),
                    fontSize: '11px',
                    fontWeight: 700,
                },
            },
        },
        yaxis: {
            show: false,
            min: 0,
            max: 100,
        },
        plotOptions: {
            radar: {
                polygons: {
                    strokeColors: isDark ? '#334155' : '#e2e8f0',
                    fill: {
                        colors: isDark ? ['#1e293b', '#0f172a'] : ['#f8fafc', '#fff'],
                    },
                },
            },
        },
        colors: ['#6366f1'],
        legend: {
            show: false,
        },
        grid: {
            show: false,
        },
    };

    const series = [
        {
            name: t('skills.overall_level'),
            data: [data.fluency, data.vocabulary, data.grammar, data.pronunciation],
        },
    ];

    return (
        <Card className="rounded-[2rem] border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
                    {t('skills.skills_analysis')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex h-[300px] items-center justify-center">
                    <Chart options={options} series={series} type="radar" width="400" height="300" />
                </div>
            </CardContent>
        </Card>
    );
}
