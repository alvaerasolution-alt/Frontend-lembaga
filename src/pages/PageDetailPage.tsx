import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { fetchPage } from '@/api/pages';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';
import {
    SectionRenderer,
    preloadSectionComponents,
    type SectionWithData,
} from '@/components/public/sections/SectionRenderer';

function getTitle(
    page: { title_id: string; title_en: string; title_ar: string },
    locale: string,
): string {
    if (locale === 'ar' && page.title_ar) return page.title_ar;
    if (locale === 'en' && page.title_en) return page.title_en;
    return page.title_id;
}

function getContent(
    page: { content_id: string; content_en: string; content_ar: string },
    locale: string,
): string {
    if (locale === 'ar' && page.content_ar) return page.content_ar;
    if (locale === 'en' && page.content_en) return page.content_en;
    return page.content_id;
}

function getHomeLabel(locale: string): string {
    if (locale === 'ar')
        return '\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629';
    if (locale === 'en') return 'Home';
    return 'Beranda';
}

export default function PageDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { lang, withLocale } = useLanguage();

    const {
        data: page,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['page', slug],
        queryFn: () => fetchPage(slug!),
        enabled: !!slug,
    });

    // Map sections to SectionWithData format (moved BEFORE any early returns)
    const sectionsWithData: SectionWithData[] = useMemo(() => {
        if (!page?.sections) return [];
        return page.sections
            .filter((s) => s.is_active)
            .sort((a, b) => a.order - b.order)
            .map((s) => ({
                id: s.id,
                type: s.type,
                data: s.data,
                order: s.order,
                is_active: s.is_active,
                dynamic_data: s.dynamic_data,
            }));
    }, [page?.sections]);

    const sectionTypes = useMemo(
        () => sectionsWithData.map((s) => s.type),
        [sectionsWithData],
    );

    useEffect(() => {
        if (sectionTypes.length === 0) return;
        preloadSectionComponents(
            sectionTypes.filter((type) =>
                ['hero', 'slider', 'quick_links', 'announcements'].includes(
                    type,
                ),
            ),
        );
    }, [sectionTypes]);

    // Early returns AFTER all hooks
    if (isLoading) return <Loading />;
    if (error || !page) return <ErrorState onRetry={() => refetch()} />;

    const title = getTitle(page, lang);
    const content = getContent(page, lang);
    const isBuilder = page.layout_type === 'builder';

    return (
        <>
            <Helmet>
                <title>{page.meta_title || title}</title>
                {page.meta_description && (
                    <meta name="description" content={page.meta_description} />
                )}
                {page.meta_keywords && (
                    <meta name="keywords" content={page.meta_keywords} />
                )}
                {page.featured_image && (
                    <meta property="og:image" content={page.featured_image} />
                )}
            </Helmet>

            {isBuilder ? (
                /* -- Builder Mode: render sections -- */
                <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    <SectionRenderer
                        sections={sectionsWithData}
                        locale={lang}
                    />
                </div>
            ) : (
                /* -- Classic Mode: original rich text layout -- */
                <div
                    className="py-8 md:py-12"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                >
                    <div className="mx-auto max-w-4xl px-4">
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <Link
                                to={withLocale('/')}
                                className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                {getHomeLabel(lang)}
                            </Link>
                        </div>

                        {/* Title */}
                        <h1 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
                            {title}
                        </h1>

                        {/* Featured Image */}
                        {page.featured_image && (
                            <div className="mb-8 overflow-hidden rounded-xl">
                                <img
                                    src={page.featured_image}
                                    alt={title}
                                    loading="lazy"
                                    className="w-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)] prose-img:rounded-lg"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
