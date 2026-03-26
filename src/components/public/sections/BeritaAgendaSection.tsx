import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, MapPin, Eye } from 'lucide-react';
import type { Event, News } from '@/types';

interface BeritaAgendaSectionProps {
    news: News[];
    events: Event[];
    locale: string;
}

const LABELS: Record<
    string,
    {
        no_image: string;
        timezone: string;
        news: string;
        events: string;
        view_all_news: string;
        view_all_events: string;
        views: string;
    }
> = {
    id: {
        no_image: 'Tidak ada gambar',
        timezone: 'WIB',
        news: 'Berita',
        events: 'Agenda',
        view_all_news: 'Lihat Semua Berita',
        view_all_events: 'Lihat Semua Agenda',
        views: 'dilihat',
    },
    en: {
        no_image: 'No Image',
        timezone: '',
        news: 'News',
        events: 'Events',
        view_all_news: 'View All News',
        view_all_events: 'View All Events',
        views: 'views',
    },
    ar: {
        no_image: 'لا توجد صورة',
        timezone: '',
        news: 'الأخبار',
        events: 'الأحداث',
        view_all_news: 'عرض جميع الأخبار',
        view_all_events: 'عرض جميع الأحداث',
        views: 'مشاهدة',
    },
};

function getTitle(
    item: {
        title_id: string;
        title_en?: string | null;
        title_ar?: string | null;
    },
    locale: string,
): string {
    if (locale === 'ar' && item.title_ar) return item.title_ar;
    if (locale === 'en' && item.title_en) return item.title_en;
    return item.title_id;
}

function stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function getBody(item: News, locale: string): string {
    const body =
        (locale === 'ar' && item.body_ar) ||
        (locale === 'en' && item.body_en) ||
        item.body_id;
    return body ? stripHtml(body) : '';
}

function formatDate(dateString: string, locale: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(
        locale === 'id' ? 'id-ID' : locale === 'ar' ? 'ar-SA' : 'en-US',
        {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        },
    );
}

function formatLongDate(dateString: string, locale: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(
        locale === 'id' ? 'id-ID' : locale === 'ar' ? 'ar-SA' : 'en-US',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        },
    );
}

const MONTH_COLORS = [
    'bg-blue-600',
    'bg-violet-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-pink-600',
    'bg-cyan-600',
    'bg-red-600',
    'bg-teal-600',
    'bg-orange-600',
    'bg-indigo-600',
    'bg-rose-600',
    'bg-green-700',
];

function getMonthBadge(dateString: string, locale: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIdx = date.getMonth();
    const month = date
        .toLocaleDateString(
            locale === 'id' ? 'id-ID' : locale === 'ar' ? 'ar-SA' : 'en-US',
            { month: 'short' },
        )
        .toUpperCase();
    return { day, month, colorClass: MONTH_COLORS[monthIdx] };
}

function getCategoryName(item: News, locale: string): string {
    if (!item.category) return '';

    const categoryWithAr = item.category as {
        name_ar?: string | null;
        name_en?: string | null;
        name_id: string;
    };

    if (locale === 'ar' && categoryWithAr.name_ar)
        return categoryWithAr.name_ar;
    if (locale === 'en' && item.category.name_en) return item.category.name_en;
    return item.category.name_id;
}

export default function BeritaAgendaSection({
    news,
    events,
    locale,
}: BeritaAgendaSectionProps) {
    const displayNews = news.slice(0, 6);
    const displayEvents = events.slice(0, 7);
    const t = LABELS[locale] || LABELS.id;
    const isRtl = locale === 'ar';

    return (
        <section className="py-12 md:py-16" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid gap-10 lg:grid-cols-5">
                    {/* Left: Berita */}
                    <div className="lg:col-span-3">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                                {t.news}
                            </h2>
                            <div className="mx-auto mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {displayNews.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/${locale}/${item.slug}`}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        {item.image_url || item.image_path ? (
                                            <img
                                                src={
                                                    item.image_url ||
                                                    item.image_path ||
                                                    undefined
                                                }
                                                alt={getTitle(item, locale)}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                                <span className="text-sm text-gray-400 dark:text-gray-500">
                                                    {t.no_image}
                                                </span>
                                            </div>
                                        )}
                                        {/* Date overlay */}
                                        <span
                                            className={`absolute bottom-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm ${isRtl ? 'right-2' : 'left-2'}`}
                                        >
                                            {formatDate(
                                                item.published_at,
                                                locale,
                                            )}
                                            {t.timezone && ` ${t.timezone}`}
                                        </span>
                                        {/* Views overlay */}
                                        {item.views > 0 && (
                                            <span
                                                className={`absolute bottom-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm ${isRtl ? 'left-2' : 'right-2'}`}
                                            >
                                                <Eye className="h-3 w-3" />
                                                {item.views}
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-3">
                                        <h3 className="mb-1 line-clamp-2 text-sm leading-snug font-bold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-gray-100 dark:group-hover:text-[var(--brand-primary)]">
                                            {getTitle(item, locale)}
                                        </h3>
                                        <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                                            {item.category
                                                ? `${getCategoryName(item, locale)} — `
                                                : ''}
                                            {getBody(item, locale)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* View All */}
                        <div className="mt-5 text-center">
                            <Link
                                to={`/${locale}/berita`}
                                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                            >
                                {t.view_all_news}
                                <ArrowRight
                                    className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`}
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Agenda */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                                {t.events}
                            </h2>
                            <div className="mx-auto mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                        </div>

                        <div className="space-y-3">
                            {displayEvents.map((event) => {
                                const badge = getMonthBadge(
                                    event.date_start,
                                    locale,
                                );

                                return (
                                    <Link
                                        key={event.id}
                                        to={`/${locale}/agenda/${event.id}`}
                                        className="group flex gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-[var(--brand-primary)]/20 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        {/* Date Badge */}
                                        <div
                                            className={`flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg text-white ${badge.colorClass}`}
                                        >
                                            <span className="text-[10px] leading-none font-semibold tracking-wide">
                                                {badge.month}
                                            </span>
                                            <span className="text-xl leading-tight font-bold">
                                                {badge.day}
                                            </span>
                                        </div>

                                        {/* Event Info */}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] dark:text-gray-100 dark:group-hover:text-[var(--brand-primary)]">
                                                {getTitle(event, locale)}
                                            </h4>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-0.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatLongDate(
                                                        event.date_start,
                                                        locale,
                                                    )}
                                                </span>
                                                {event.time_start && (
                                                    <span className="flex items-center gap-0.5">
                                                        <Clock className="h-3 w-3" />
                                                        {event.time_start.slice(
                                                            0,
                                                            5,
                                                        )}
                                                        {t.timezone &&
                                                            ` ${t.timezone}`}
                                                    </span>
                                                )}
                                                {event.location && (
                                                    <span className="flex items-center gap-0.5">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="truncate">
                                                            {event.location}
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* View All */}
                        <div className="mt-5 text-center">
                            <Link
                                to={`/${locale}/agenda-kegiatan`}
                                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                            >
                                {t.view_all_events}
                                <ArrowRight
                                    className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
