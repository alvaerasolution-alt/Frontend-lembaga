import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { DosenProfile } from '@/types';

interface DosenSectionProps {
    dosenProfiles: DosenProfile[];
}

function getExpertise(item: DosenProfile, locale: string): string {
    if (locale === 'en' && item.expertise_en) return item.expertise_en;
    if (locale === 'ar' && item.expertise_ar) return item.expertise_ar;
    return item.expertise_id || '';
}

function getStudyProgram(item: DosenProfile, locale: string): string {
    if (!item.study_program) return '';
    if (locale === 'en' && item.study_program.name_en) {
        return item.study_program.name_en;
    }
    return item.study_program.name_id;
}

export default function DosenSection({ dosenProfiles }: DosenSectionProps) {
    const { lang, withLocale } = useLanguage();

    if (dosenProfiles.length === 0) return null;

    return (
        <section className="py-12 md:py-16" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <div className="mx-auto max-w-7xl px-4">
                {/* Section Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                            {lang === 'ar'
                                ? 'أعضاء هيئة التدريس'
                                : lang === 'en'
                                  ? 'Our Lecturers'
                                  : 'Dosen Kami'}
                        </h2>
                        <div className="mt-2 h-1 w-16 rounded bg-[var(--brand-primary)]" />
                    </div>
                    <Link
                        to={withLocale('/dosen')}
                        className="flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                    >
                        {lang === 'ar'
                            ? 'عرض كل الأساتذة'
                            : lang === 'en'
                              ? 'View All Lecturers'
                              : 'Lihat Semua Dosen'}
                        <ArrowRight
                            className={`h-4 w-4 ${lang === 'ar' ? 'rotate-180' : ''}`}
                        />
                    </Link>
                </div>

                {/* Grid of Lecturer Cards */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {dosenProfiles.map((dosen) => (
                        <div
                            key={dosen.id}
                            className="group overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                        >
                            {/* Photo */}
                            <div className="bg-brand/10 dark:bg-brand/90/20 relative aspect-square overflow-hidden">
                                {(dosen.photo_url || dosen.photo) ? (
                                    <img
                                        src={(dosen.photo_url ?? dosen.photo) || undefined}
                                        alt={dosen.full_name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <GraduationCap className="text-brand/60 h-16 w-16" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="mb-1 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[var(--brand-primary)] md:text-base dark:text-white">
                                    {dosen.full_name}
                                </h3>

                                {dosen.study_program && (
                                    <p className="mb-1 line-clamp-1 text-xs font-medium text-[var(--brand-primary)]">
                                        {getStudyProgram(dosen, lang)}
                                    </p>
                                )}

                                {getExpertise(dosen, lang) && (
                                    <p className="mb-2 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                                        {getExpertise(dosen, lang)}
                                    </p>
                                )}

                                {dosen.nidn && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        NIDN: {dosen.nidn}
                                    </p>
                                )}

                                {dosen.email && (
                                    <a
                                        href={`mailto:${dosen.email}`}
                                        className="dark:hover:text-brand/70 mt-2 flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-500"
                                    >
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">
                                            {dosen.email}
                                        </span>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
