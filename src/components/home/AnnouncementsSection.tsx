import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Download, Paperclip } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Announcement } from '@/types';

interface AnnouncementsSectionProps {
    announcements: Announcement[];
}

function formatDate(dateString: string, locale: string): string {
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

function getTitle(item: Announcement, locale: string): string {
    if (locale === 'en' && item.title_en) return item.title_en;
    if (locale === 'ar' && item.title_ar) return item.title_ar;
    return item.title_id;
}

export default function AnnouncementsSection({
    announcements,
}: AnnouncementsSectionProps) {
    const { lang, withLocale } = useLanguage();

    if (announcements.length === 0) return null;

    const [featured, ...rest] = announcements;
    const sideItems = rest.slice(0, 3);

    return (
        <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {lang === 'ar'
                                ? 'إعلانات'
                                : lang === 'en'
                                  ? 'Announcements'
                                  : 'Pengumuman'}
                        </h2>
                        <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    </div>
                    <Link
                        to={withLocale('/pengumuman')}
                        className="flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                    >
                        {lang === 'ar'
                            ? 'عرض كل الإعلانات'
                            : lang === 'en'
                              ? 'View All Announcements'
                              : 'Lihat Semua Pengumuman'}
                        <ArrowRight
                            className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                        />
                    </Link>
                </div>

                {/* Asymmetric Grid: 1 large + 3 small */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Featured (Large Card) */}
                    {featured && (
                        <Link
                            to={withLocale(`/pengumuman/${featured.slug}`)}
                            className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                {featured.image_url || featured.image_path ? (
                                    <img
                                        src={
                                            featured.image_url ||
                                            featured.image_path ||
                                            undefined
                                        }
                                        alt={getTitle(featured, lang)}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-amber-50 dark:bg-amber-900/20">
                                        <Paperclip className="h-12 w-12 text-amber-300" />
                                    </div>
                                )}
                                <span className="absolute top-4 left-4 rounded bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
                                    {lang === 'ar'
                                        ? 'إعلان'
                                        : lang === 'en'
                                          ? 'Announcement'
                                          : 'Pengumuman'}
                                </span>
                                {featured.file_url && (
                                    <span className="absolute top-4 right-4 flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white shadow-sm">
                                        <Download className="h-3 w-3" />
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-xl dark:text-white">
                                    {getTitle(featured, lang)}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(featured.published_at, lang)}
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Side Items (Small Cards) */}
                    <div className="flex flex-col gap-4">
                        {sideItems.map((item) => (
                            <Link
                                key={item.id}
                                to={withLocale(`/pengumuman/${item.slug}`)}
                                className="group flex gap-4 overflow-hidden rounded-xl bg-white p-3 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-900/30"
                            >
                                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg md:h-28 md:w-36">
                                    {item.image_url || item.image_path ? (
                                        <img
                                            src={
                                                item.image_url ||
                                                item.image_path ||
                                                undefined
                                            }
                                            alt={getTitle(item, lang)}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                            <Paperclip className="h-6 w-6 text-amber-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-center">
                                    <h4 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-base dark:text-white">
                                        {getTitle(item, lang)}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(item.published_at, lang)}
                                    </div>
                                    <span className="mt-1 text-xs font-medium text-[var(--brand-primary)]">
                                        {lang === 'ar'
                                            ? 'اقرأ المزيد'
                                            : lang === 'en'
                                              ? 'Read more'
                                              : 'Selengkapnya'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
