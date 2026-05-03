import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { News } from '@/types';

interface LecturerColumnSectionProps {
    lecturerColumns: News[];
    settings?: {
        title_id?: string;
        title_en?: string | null;
        title_ar?: string | null;
    };
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

function getTitle(item: News, locale: string): string {
    if (locale === 'en' && item.title_en) return item.title_en;
    if (locale === 'ar' && item.title_ar) return item.title_ar;
    return item.title_id;
}

export default function LecturerColumnSection({
    lecturerColumns,
    settings,
}: LecturerColumnSectionProps) {
    const { lang, withLocale } = useLanguage();

    if (lecturerColumns.length === 0) return null;

    const [featured, ...rest] = lecturerColumns;
    const sideItems = rest.slice(0, 3);
    const sectionTitle =
        (lang === 'ar' && settings?.title_ar) ||
        (lang === 'en' && settings?.title_en) ||
        settings?.title_id ||
        (lang === 'ar'
            ? 'عمود المحاضر'
            : lang === 'en'
              ? 'Lecturer Column'
              : 'Kolom Dosen');

    return (
        <section className="bg-gray-50 py-12 md:py-16 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {sectionTitle}
                        </h2>
                        <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    </div>
                    <Link
                        to={withLocale('/kategori/kolom-dosen')}
                        className="flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                    >
                        {lang === 'ar'
                            ? 'عرض الكل'
                            : lang === 'en'
                              ? 'View All'
                              : 'Lihat Semua Kolom Dosen'}
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
                            to={withLocale(`/${featured.slug}`)}
                            className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                {(featured.image_url || featured.image_path) ? (
                                    <img
                                        src={featured.image_url || featured.image_path || undefined}
                                        alt={getTitle(featured, lang)}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/20">
                                        <BookOpen className="h-12 w-12 text-[var(--brand-primary)]/40" />
                                    </div>
                                )}
                                <span className="absolute top-4 left-4 rounded bg-[var(--brand-primary)] px-3 py-1 text-xs font-semibold text-white">
                                    {lang === 'ar'
                                        ? 'عمود المحاضر'
                                        : lang === 'en'
                                          ? 'Lecturer Column'
                                          : 'Kolom Dosen'}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-xl dark:text-white">
                                    {getTitle(featured, lang)}
                                </h3>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    {featured.author && (
                                        <span className="font-medium text-gray-600 dark:text-gray-300">
                                            {featured.author.name}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(
                                            featured.published_at,
                                            lang,
                                        )}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* Side Items (Small Cards) */}
                    <div className="flex flex-col gap-4">
                        {sideItems.map((item) => (
                            <Link
                                key={item.id}
                                to={withLocale(`/${item.slug}`)}
                                className="group flex gap-4 overflow-hidden rounded-xl bg-white p-3 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                            >
                                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg md:h-28 md:w-36">
                                    {(item.image_url || item.image_path) ? (
                                        <img
                                            src={item.image_url || item.image_path || undefined}
                                            alt={getTitle(item, lang)}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/20">
                                            <BookOpen className="h-6 w-6 text-[var(--brand-primary)]/40" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-center">
                                    <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-base dark:text-white">
                                        {getTitle(item, lang)}
                                    </h4>
                                    {item.author && (
                                        <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                                            {item.author.name}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(item.published_at, lang)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
