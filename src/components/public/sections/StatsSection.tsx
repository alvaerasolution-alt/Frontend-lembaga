import { useEffect, useRef, useState, useCallback } from 'react';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface StatItem {
    type?: 'number' | 'line_chart' | 'pie_chart' | 'bar_chart';
    number?: string;
    label_id?: string;
    label_en?: string;
    label_ar?: string;
    icon?: string;
    source?: string;
    last_update?: string;
    chart_data?: string;
}

interface StatsSectionProps {
    data: {
        title_id?: string;
        title_en?: string;
        title_ar?: string;
        items?: StatItem[];
    };
    dynamic_data?: StatItem[];
    locale: string;
}

// Hook for animated counter with intersection observer
function useAnimatedCounter(
    targetValue: number,
    duration: number = 2000,
    suffix: string = ''
): { displayValue: string; ref: React.RefObject<HTMLSpanElement> } {
    const [displayValue, setDisplayValue] = useState('0' + suffix);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    const animate = useCallback(() => {
        if (hasAnimated) return;
        setHasAnimated(true);

        const startTime = performance.now();
        const startValue = 0;

        const tick = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(
                startValue + (targetValue - startValue) * easeOut
            );

            // Format with thousands separator
            const formatted =
                currentValue.toLocaleString('id-ID') + suffix;
            setDisplayValue(formatted);

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }, [targetValue, duration, suffix, hasAnimated]);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [animate]);

    return { displayValue, ref: ref as React.RefObject<HTMLSpanElement> };
}

// Parse number string like "1.500+" or "25.000" into { value: number, suffix: string }
function parseStatNumber(numStr?: string): { value: number; suffix: string } {
    if (!numStr) return { value: 0, suffix: '' };

    // Remove dots used as thousands separators (Indonesian format)
    const cleaned = numStr.replace(/\./g, '');

    // Extract numeric part and suffix (like +, %, etc.)
    const match = cleaned.match(/^(\d+)(.*)$/);
    if (match) {
        return {
            value: parseInt(match[1], 10),
            suffix: match[2] || '',
        };
    }

    return { value: 0, suffix: '' };
}

// Colors matched with standard Unisnu branding/colors
const COLORS = [
    '#10b981',
    '#3b82f6',
    '#f43f5e',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
    '#ec4899',
    '#64748b',
];

const ICON_MAP: Record<string, string> = {
    users: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    book: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    building:
        'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    trophy: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    globe: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
};

function getLabel(item: StatItem, locale: string): string {
    return (
        (locale === 'ar' && item.label_ar) ||
        (locale === 'en' && item.label_en) ||
        item.label_id ||
        ''
    );
}

const STATS_LABELS: Record<string, { source: string; last_update: string }> = {
    id: { source: 'Sumber', last_update: 'Pembaruan Terakhir' },
    en: { source: 'Source', last_update: 'Last Update' },
    ar: { source: 'المصدر', last_update: 'آخر تحديث' },
};

function parseChartData(dataStr?: string) {
    if (!dataStr) return [];

    // Parses lines like "2024=650" into [{ name: "2024", value: 650 }]
    return dataStr
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.includes('='))
        .map((line) => {
            const [name, valStr] = line.split('=', 2);
            return {
                name: name?.trim() || '',
                value: parseFloat(valStr?.trim() || '0'),
            };
        });
}

// Animated stat card component
function AnimatedStatCard({
    item,
    iconPath,
    label,
}: {
    item: StatItem;
    iconPath?: string;
    label: string;
}) {
    const parsed = parseStatNumber(item.number);
    const { displayValue, ref } = useAnimatedCounter(
        parsed.value,
        2000,
        parsed.suffix
    );

    return (
        <div className="flex flex-col items-center justify-center rounded-xl bg-white p-6 shadow-sm transition-transform hover:scale-105 dark:bg-gray-900 dark:shadow-gray-900/30">
            {iconPath && (
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] dark:bg-[var(--brand-primary)]/20">
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={iconPath}
                        />
                    </svg>
                </div>
            )}
            <span
                ref={ref}
                className="text-3xl font-bold text-[var(--brand-primary)] tabular-nums"
            >
                {displayValue}
            </span>
            <span className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
                {label}
            </span>
        </div>
    );
}

// i18n labels for empty state
const EMPTY_STATE_LABELS: Record<string, string> = {
    id: 'Tidak ada data statistik yang tersedia.',
    en: 'No statistics data available.',
    ar: 'لا تتوفر بيانات إحصائية.',
};

export function StatsSection({
    data,
    dynamic_data,
    locale,
}: StatsSectionProps) {
    const title =
        (locale === 'ar' && data.title_ar) ||
        (locale === 'en' && data.title_en) ||
        data.title_id ||
        '';

    const items =
        dynamic_data && dynamic_data.length > 0
            ? dynamic_data
            : data.items || [];

    const statsT = STATS_LABELS[locale] || STATS_LABELS.id;
    const emptyStateText = EMPTY_STATE_LABELS[locale] || EMPTY_STATE_LABELS.id;

    // Show empty state with message instead of returning null
    if (items.length === 0) {
        return (
            <section
                className="bg-gray-50 py-12 md:py-16 dark:bg-gray-800"
                dir={locale === 'ar' ? 'rtl' : 'ltr'}
            >
                <div className="mx-auto max-w-6xl px-4 text-center">
                    {title && (
                        <h2 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {title}
                        </h2>
                    )}
                    <p className="text-gray-500 dark:text-gray-400">
                        {emptyStateText}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="bg-gray-50 py-12 md:py-16 dark:bg-gray-800"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-6xl px-4">
                {title && (
                    <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                        {title}
                    </h2>
                )}

                {/* 
                    Determine grid layout based on types. 
                    If there is at least one chart, use a more spacious grid. 
                */}
                <div
                    className={`grid gap-6 ${
                        items.some((i) => i.type && i.type !== 'number')
                            ? items.length === 1
                                ? 'mx-auto max-w-3xl grid-cols-1'
                                : 'grid-cols-1 lg:grid-cols-2'
                            : items.length <= 2
                              ? 'grid-cols-1 sm:grid-cols-2'
                              : items.length === 3
                                ? 'grid-cols-1 sm:grid-cols-3'
                                : 'grid-cols-2 md:grid-cols-4'
                    }`}
                >
                    {items.map((item, idx) => {
                        const iconPath = ICON_MAP[item.icon || ''];
                        const itemType = item.type || 'number';
                        const label = getLabel(item, locale);

                        // Check if it's a number type - use AnimatedStatCard
                        if (itemType === 'number') {
                            return (
                                <AnimatedStatCard
                                    key={idx}
                                    item={item}
                                    iconPath={iconPath}
                                    label={label}
                                />
                            );
                        }

                        // Otherwise, it's a chart type
                        const chartData = parseChartData(item.chart_data);

                        return (
                            <div
                                key={idx}
                                className="flex flex-col rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900 dark:shadow-gray-900/30"
                            >
                                <div className="mb-6 text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {label}
                                    </h3>
                                    {item.source && (
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {statsT.source}: {item.source}
                                        </p>
                                    )}
                                    {item.last_update && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {statsT.last_update}: {item.last_update}
                                        </p>
                                    )}
                                </div>

                                <div className="h-64 w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        {itemType === 'line_chart' ? (
                                            <LineChart
                                                data={chartData}
                                                margin={{
                                                    top: 5,
                                                    right: 20,
                                                    bottom: 5,
                                                    left: 0,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#3b82f6"
                                                    strokeWidth={2}
                                                    dot={{ r: 4 }}
                                                    activeDot={{ r: 6 }}
                                                    name={label}
                                                />
                                            </LineChart>
                                        ) : itemType === 'bar_chart' ? (
                                            <BarChart
                                                data={chartData}
                                                margin={{
                                                    top: 5,
                                                    right: 20,
                                                    bottom: 5,
                                                    left: 0,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <Tooltip />
                                                <Bar
                                                    dataKey="value"
                                                    fill="#10b981"
                                                    radius={[4, 4, 0, 0]}
                                                    name={label}
                                                />
                                            </BarChart>
                                        ) : itemType === 'pie_chart' ? (
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={true}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({
                                                        name,
                                                        percent,
                                                    }) =>
                                                        `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                                                    }
                                                >
                                                    {chartData.map(
                                                        (_entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        ) : (
                                            <div />
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
