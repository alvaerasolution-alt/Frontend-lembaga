import {
    Component,
    Suspense,
    lazy,
    type ErrorInfo,
    type ReactNode,
} from 'react';
import type {
    Slider,
    Testimonial,
    News,
    Announcement,
    Event,
    Partner,
    QuickLink,
    Career,
    Faq,
    DosenProfile,
} from '@/types';

const loadHeroSlider = () => import('@/components/home/HeroSlider');
const loadQuickLinks = () => import('@/components/home/QuickLinks');
const loadLatestNews = () => import('@/components/home/LatestNews');
const loadUpcomingEvents = () => import('@/components/home/UpcomingEvents');
const loadPartnersSection = () => import('@/components/home/PartnersSection');
const loadTestimonialsSection = () =>
    import('@/components/home/TestimonialsSection');
const loadAnnouncementsSection = () =>
    import('@/components/home/AnnouncementsSection');
const loadCareerSection = () => import('@/components/home/CareerSection');
const loadLecturerColumnSection = () =>
    import('@/components/home/LecturerColumnSection');
const loadDosenSection = () => import('@/components/home/DosenSection');
const loadBeritaAgendaSection = () => import('./BeritaAgendaSection');

const loadCtaSection = () =>
    import('./CtaSection').then((module) => ({ default: module.CtaSection }));
const loadGallerySection = () =>
    import('./GallerySection').then((module) => ({
        default: module.GallerySection,
    }));
const loadHeroSection = () =>
    import('./HeroSection').then((module) => ({ default: module.HeroSection }));
const loadRichTextSection = () =>
    import('./RichTextSection').then((module) => ({
        default: module.RichTextSection,
    }));
const loadSambutanSection = () =>
    import('./SambutanSection').then((module) => ({
        default: module.SambutanSection,
    }));
const loadStatsSection = () =>
    import('./StatsSection').then((module) => ({
        default: module.StatsSection,
    }));
const loadStrukturOrganisasiSection = () =>
    import('./StrukturOrganisasiSection');
const loadTimelineSection = () =>
    import('./TimelineSection').then((module) => ({
        default: module.TimelineSection,
    }));
const loadVideoSection = () =>
    import('./VideoSection').then((module) => ({
        default: module.VideoSection,
    }));

const HeroSlider = lazy(loadHeroSlider);
const QuickLinks = lazy(loadQuickLinks);
const LatestNews = lazy(loadLatestNews);
const UpcomingEvents = lazy(loadUpcomingEvents);
const PartnersSection = lazy(loadPartnersSection);
const TestimonialsSection = lazy(loadTestimonialsSection);
const AnnouncementsSection = lazy(loadAnnouncementsSection);
const CareerSection = lazy(loadCareerSection);
const LecturerColumnSection = lazy(loadLecturerColumnSection);
const DosenSection = lazy(loadDosenSection);
const BeritaAgendaSection = lazy(loadBeritaAgendaSection);

const CtaSection = lazy(loadCtaSection);
const GallerySection = lazy(loadGallerySection);
const HeroSection = lazy(loadHeroSection);
const RichTextSection = lazy(loadRichTextSection);
const SambutanSection = lazy(loadSambutanSection);
const StatsSection = lazy(loadStatsSection);
const StrukturOrganisasiSection = lazy(loadStrukturOrganisasiSection);
const TimelineSection = lazy(loadTimelineSection);
const VideoSection = lazy(loadVideoSection);

const SECTION_LOADERS: Record<string, () => Promise<unknown>> = {
    hero: loadHeroSection,
    rich_text: loadRichTextSection,
    gallery: loadGallerySection,
    cta: loadCtaSection,
    video: loadVideoSection,
    stats: loadStatsSection,
    sambutan: loadSambutanSection,
    timeline: loadTimelineSection,
    struktur_organisasi: loadStrukturOrganisasiSection,
    slider: loadHeroSlider,
    testimonials: loadTestimonialsSection,
    blog_feed: loadLatestNews,
    announcements: loadAnnouncementsSection,
    events: loadUpcomingEvents,
    partners: loadPartnersSection,
    quick_links: loadQuickLinks,
    career: loadCareerSection,
    lecturer_column: loadLecturerColumnSection,
    dosen: loadDosenSection,
    berita_agenda: loadBeritaAgendaSection,
};

export function preloadSectionComponents(sectionTypes: string[]): void {
    const unique = Array.from(new Set(sectionTypes));
    unique.forEach((type) => {
        const loader = SECTION_LOADERS[type];
        if (loader) {
            loader().catch(() => undefined);
        }
    });
}

export interface SectionWithData {
    id: number;
    type: string;
    data: Record<string, unknown>;
    order: number;
    is_active: boolean;
    dynamic_data?: unknown;
}

interface SectionRendererProps {
    sections: SectionWithData[];
    locale: string;
}

interface SingleSectionProps {
    section: SectionWithData;
    locale: string;
    hasSlider?: boolean;
}

const ERROR_LABELS: Record<string, { prefix: string; suffix: string }> = {
    id: { prefix: 'Section', suffix: 'gagal dimuat.' },
    en: { prefix: 'Section', suffix: 'failed to load.' },
    ar: { prefix: 'القسم', suffix: 'فشل في التحميل.' },
};

class SectionErrorBoundary extends Component<
    { type: string; locale: string; children: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('section-render-error', {
                    detail: {
                        type: this.props.type,
                        message: error.message,
                        stack: error.stack,
                        componentStack: errorInfo.componentStack,
                    },
                }),
            );
        }

        if (import.meta.env.DEV) {
            console.error(
                `[SectionRenderer] Failed to render section: ${this.props.type}`,
                error,
                errorInfo,
            );
        }
    }

    render(): ReactNode {
        if (this.state.hasError) {
            const labels = ERROR_LABELS[this.props.locale] || ERROR_LABELS.id;
            return (
                <div
                    className="mx-auto my-6 max-w-7xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                    dir={this.props.locale === 'ar' ? 'rtl' : 'ltr'}
                >
                    {labels.prefix} `{this.props.type}` {labels.suffix}
                </div>
            );
        }

        return this.props.children;
    }
}

function SectionSkeleton({ type }: { type: string }) {
    const minHeight =
        type === 'slider' || type === 'hero'
            ? 'min-h-[280px]'
            : type === 'gallery' || type === 'video'
              ? 'min-h-[220px]'
              : 'min-h-[160px]';

    return (
        <div className={`mx-auto my-4 w-full max-w-7xl px-4 ${minHeight}`}>
            <div className="h-full w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        </div>
    );
}

function renderAsyncSection(
    key: number,
    type: string,
    locale: string,
    node: ReactNode,
) {
    return (
        <SectionErrorBoundary key={key} type={type} locale={locale}>
            <Suspense fallback={<SectionSkeleton type={type} />}>
                {node}
            </Suspense>
        </SectionErrorBoundary>
    );
}

function SingleSection({
    section,
    locale,
    hasSlider = false,
}: SingleSectionProps) {
    const { type, data, dynamic_data } = section;

    switch (type) {
        // -- Static sections --
        case 'hero':
            return (
                <HeroSection
                    data={data as Parameters<typeof HeroSection>[0]['data']}
                    locale={locale}
                />
            );

        case 'rich_text':
            return (
                <RichTextSection
                    data={data as Parameters<typeof RichTextSection>[0]['data']}
                    locale={locale}
                />
            );

        case 'gallery':
            return (
                <GallerySection
                    data={data as Parameters<typeof GallerySection>[0]['data']}
                    locale={locale}
                />
            );

        case 'cta':
            return (
                <CtaSection
                    data={data as Parameters<typeof CtaSection>[0]['data']}
                    locale={locale}
                />
            );

        case 'video':
            return (
                <VideoSection
                    data={data as Parameters<typeof VideoSection>[0]['data']}
                    locale={locale}
                />
            );

        case 'stats':
            return (
                <StatsSection
                    data={data as Parameters<typeof StatsSection>[0]['data']}
                    dynamic_data={
                        dynamic_data as Parameters<
                            typeof StatsSection
                        >[0]['dynamic_data']
                    }
                    locale={locale}
                />
            );

        case 'sambutan':
            return (
                <SambutanSection
                    data={data as Parameters<typeof SambutanSection>[0]['data']}
                    locale={locale}
                />
            );

        case 'timeline':
            return (
                <TimelineSection
                    data={data as Parameters<typeof TimelineSection>[0]['data']}
                    locale={locale}
                />
            );

        case 'struktur_organisasi':
            return (
                <StrukturOrganisasiSection
                    data={
                        data as Parameters<
                            typeof StrukturOrganisasiSection
                        >[0]['data']
                    }
                    lecturers={
                        dynamic_data as Parameters<
                            typeof StrukturOrganisasiSection
                        >[0]['lecturers']
                    }
                    locale={locale}
                />
            );

        // -- Dynamic sections (reuse existing homepage components) --
        case 'slider': {
            const sliders = (dynamic_data || []) as Slider[];
            return sliders.length > 0 ? <HeroSlider sliders={sliders} /> : null;
        }

        case 'testimonials': {
            const testimonials = (dynamic_data || []) as Testimonial[];
            return testimonials.length > 0 ? (
                <TestimonialsSection
                    testimonials={testimonials}
                    settings={data}
                />
            ) : null;
        }

        case 'blog_feed': {
            const news = (dynamic_data || []) as News[];
            return news.length > 0 ? <LatestNews news={news} /> : null;
        }

        case 'announcements': {
            const announcements = (dynamic_data || []) as Announcement[];
            return announcements.length > 0 ? (
                <AnnouncementsSection announcements={announcements} />
            ) : null;
        }

        case 'events': {
            const events = (dynamic_data || []) as Event[];
            return events.length > 0 ? (
                <UpcomingEvents events={events} />
            ) : null;
        }

        case 'partners': {
            const partners = (dynamic_data || []) as Partner[];
            return partners.length > 0 ? (
                <PartnersSection partners={partners} />
            ) : null;
        }

        case 'quick_links': {
            const quickLinks = (dynamic_data || []) as QuickLink[];
            const scrollSpeed =
                typeof data.scroll_speed === 'number'
                    ? data.scroll_speed
                    : Number(data.scroll_speed || 40);
            return quickLinks.length > 0 ? (
                <QuickLinks
                    quickLinks={quickLinks}
                    hasSlider={hasSlider}
                    scrollSpeed={
                        Number.isFinite(scrollSpeed) ? scrollSpeed : 40
                    }
                    locale={locale}
                />
            ) : null;
        }

        case 'faq': {
            const faqs = (dynamic_data || []) as Faq[];
            return faqs.length > 0 ? (
                <FaqSection faqs={faqs} locale={locale} />
            ) : null;
        }

        case 'career': {
            const careerPosts = (dynamic_data || []) as Career[];
            return careerPosts.length > 0 ? (
                <CareerSection careerPosts={careerPosts} />
            ) : null;
        }

        case 'lecturer_column': {
            const lecturerColumns = (dynamic_data || []) as News[];
            return lecturerColumns.length > 0 ? (
                <LecturerColumnSection
                    lecturerColumns={lecturerColumns}
                    settings={
                        data as {
                            title_id?: string;
                            title_en?: string | null;
                            title_ar?: string | null;
                        }
                    }
                />
            ) : null;
        }

        case 'dosen': {
            const dosenProfiles = (dynamic_data || []) as DosenProfile[];
            if (dosenProfiles.length === 0) {
                return (
                    <section
                        className="py-12 md:py-16"
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                    >
                        <div className="mx-auto max-w-4xl px-4 text-center">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                                {locale === 'ar'
                                    ? 'أعضاء هيئة التدريس'
                                    : locale === 'en'
                                      ? 'Our Lecturers'
                                      : 'Dosen Kami'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {locale === 'ar'
                                    ? 'لا توجد بيانات أعضاء هيئة التدريس متاحة حالياً.'
                                    : locale === 'en'
                                      ? 'Lecturer data is not available yet.'
                                      : 'Data dosen belum tersedia saat ini.'}
                            </p>
                        </div>
                    </section>
                );
            }

            return <DosenSection dosenProfiles={dosenProfiles} />;
        }

        case 'berita_agenda': {
            const beritaAgenda = (dynamic_data || {}) as {
                news?: News[];
                events?: Event[];
            };
            const newsItems = beritaAgenda.news || [];
            const eventItems = beritaAgenda.events || [];
            return newsItems.length > 0 || eventItems.length > 0 ? (
                <BeritaAgendaSection
                    news={newsItems}
                    events={eventItems}
                    locale={locale}
                />
            ) : null;
        }

        default:
            return null;
    }
}

// -- Inline FAQ component (no existing homepage component for FAQ) --
function FaqSection({ faqs, locale }: { faqs: Faq[]; locale: string }) {
    function getQ(faq: Faq): string {
        return (
            (locale === 'ar' && faq.question_ar) ||
            (locale === 'en' && faq.question_en) ||
            faq.question_id ||
            ''
        );
    }

    function getA(faq: Faq): string {
        return (
            (locale === 'ar' && faq.answer_ar) ||
            (locale === 'en' && faq.answer_en) ||
            faq.answer_id ||
            ''
        );
    }

    return (
        <section
            className="py-12 md:py-16"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
            <div className="mx-auto max-w-3xl px-4">
                <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                    {locale === 'ar'
                        ? 'الأسئلة الشائعة'
                        : locale === 'en'
                          ? 'FAQ'
                          : 'FAQ'}
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <details
                            key={faq.id}
                            className="group rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                            <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                {getQ(faq)}
                                <span className="shrink-0 text-gray-400 transition-transform group-open:rotate-45 dark:text-gray-500">
                                    +
                                </span>
                            </summary>
                            <div
                                className="prose prose-sm max-w-none px-6 pb-4 text-gray-600 dark:text-gray-400 dark:prose-invert"
                                dangerouslySetInnerHTML={{
                                    __html: getA(faq),
                                }}
                            />
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

// -- Main renderer --
export function SectionRenderer({ sections, locale }: SectionRendererProps) {
    if (!sections || sections.length === 0) return null;

    const hasSlider = sections.some(
        (s) =>
            s.type === 'slider' &&
            Array.isArray(s.dynamic_data) &&
            s.dynamic_data.length > 0,
    );

    return (
        <>
            {sections.map((section) =>
                renderAsyncSection(
                    section.id,
                    section.type,
                    locale,
                    <SingleSection
                        section={section}
                        locale={locale}
                        hasSlider={hasSlider}
                    />,
                ),
            )}
        </>
    );
}
