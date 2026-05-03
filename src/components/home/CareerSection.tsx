import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Briefcase, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { Career } from '@/types';

interface CareerSectionProps {
    careerPosts: Career[];
}

const CAREER_LABELS: Record<string, { deadline: string }> = {
    id: { deadline: 'Batas Waktu' },
    en: { deadline: 'Deadline' },
    ar: { deadline: 'الموعد النهائي' },
};

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

function getTitle(item: Career, locale: string): string {
    if (locale === 'en' && item.title_en) return item.title_en;
    if (locale === 'ar' && item.title_ar) return item.title_ar;
    return item.title_id;
}

export default function CareerSection({ careerPosts }: CareerSectionProps) {
    const { lang, withLocale } = useLanguage();

    if (careerPosts.length === 0) return null;

    const [featured, ...rest] = careerPosts;
    const sideItems = rest.slice(0, 3);

    return (
        <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {lang === 'ar'
                                ? 'معلومات المهنة'
                                : lang === 'en'
                                  ? 'Career Information'
                                  : 'Informasi Karir'}
                        </h2>
                        <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    </div>
                    <Link
                        to={withLocale('/karir')}
                        className="flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                    >
                        {lang === 'ar'
                            ? 'عرض كل الوظائف'
                            : lang === 'en'
                              ? 'View All Careers'
                              : 'Lihat Semua Informasi Karir'}
                        <ArrowRight
                            className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                        />
                    </Link>
                </div>

                {/* Asymmetric Grid: 1 large + 3 small */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Featured (Large Card) */}
                    {featured && (
                        <div className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
                            <div className="relative aspect-video overflow-hidden">
                                {(featured.image_url || featured.image) ? (
                                    <img
                                        src={featured.image_url || featured.image || undefined}
                                        alt={getTitle(featured, lang)}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-red-50 dark:bg-red-900/20">
                                        <Briefcase className="h-12 w-12 text-red-300" />
                                    </div>
                                )}
                                <span className="absolute top-4 left-4 rounded bg-red-700 px-3 py-1 text-xs font-semibold text-white">
                                    {lang === 'ar'
                                        ? 'وظائف'
                                        : lang === 'en'
                                          ? 'Career'
                                          : 'Karir'}
                                </span>
                            </div>
                            <div className="p-5">
                                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-xl dark:text-white">
                                    {getTitle(featured, lang)}
                                </h3>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {formatDate(
                                            featured.published_at,
                                            lang,
                                        )}
                                    </span>
                                    {featured.deadline && (
                                        <span className="flex items-center gap-1 text-red-500">
                                            <Clock className="h-3.5 w-3.5" />
                                            {(CAREER_LABELS[lang] || CAREER_LABELS.id).deadline}:{' '}
                                            {formatDate(
                                                featured.deadline,
                                                lang,
                                            )}
                                        </span>
                                    )}
                                </div>
                                {featured.registration_url && (
                                    <a
                                        href={featured.registration_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-block rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-secondary)]"
                                    >
                                        {lang === 'ar'
                                            ? 'قدم الآن'
                                            : lang === 'en'
                                              ? 'Apply Now'
                                              : 'Daftar Sekarang'}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Side Items (Small Cards) */}
                    <div className="flex flex-col gap-4">
                        {sideItems.map((item) => (
                            <div
                                key={item.id}
                                className="group flex gap-4 overflow-hidden rounded-xl bg-white p-3 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                            >
                                <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg md:h-28 md:w-36">
                                    {(item.image_url || item.image) ? (
                                        <img
                                            src={item.image_url || item.image || undefined}
                                            alt={getTitle(item, lang)}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                                            <Briefcase className="h-6 w-6 text-red-300" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col justify-center">
                                    <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-base dark:text-white">
                                        {getTitle(item, lang)}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(
                                                item.published_at,
                                                lang,
                                            )}
                                        </span>
                                        {item.deadline && (
                                            <span className="flex items-center gap-1 text-red-500">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(
                                                    item.deadline,
                                                    lang,
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
