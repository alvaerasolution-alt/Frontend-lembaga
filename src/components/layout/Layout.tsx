import type { SiteSettings } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import MobileBottomBar from './MobileBottomBar';
import PopupBanner from './PopupBanner';
import { fetchMenus } from '@/api/menus';
import { fetchSettings } from '@/api/settings';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingPage } from '@/components/ui/Loading';
import { useInstitution } from '@/context/InstitutionContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Layout() {
    const { institution, loading, error } = useInstitution();
    const { lang } = useLanguage();

    const { data: settings } = useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 10,
        enabled: !!institution,
    });

    const { data: menus } = useQuery({
        queryKey: ['menus'],
        queryFn: fetchMenus,
        staleTime: 1000 * 60 * 10,
        enabled: !!institution,
    });

    const siteSettings: SiteSettings = settings || {};

    // document.title
    useEffect(() => {
        if (siteSettings.site_name) {
            document.title = siteSettings.site_name;
        }
    }, [siteSettings.site_name]);

    // Favicon
    useEffect(() => {
        const favicon = siteSettings.favicon_url || siteSettings.favicon;
        if (favicon) {
            let link =
                document.querySelector<HTMLLinkElement>("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = favicon;
        }
    }, [siteSettings.favicon, siteSettings.favicon_url]);

    const themeStyle: Record<string, string> = {};

    const primaryColor = siteSettings.theme_primary || institution?.theme_color;
    if (primaryColor) {
        themeStyle['--primary'] = primaryColor;
        themeStyle['--color-primary'] = primaryColor;
        themeStyle['--brand-primary'] = primaryColor;
        themeStyle['--sidebar-primary'] = primaryColor;
        themeStyle['--brand-hover'] =
            `color-mix(in srgb, ${primaryColor} 85%, black)`;
    }

    if (siteSettings.theme_secondary) {
        themeStyle['--secondary'] = siteSettings.theme_secondary;
        themeStyle['--color-secondary'] = siteSettings.theme_secondary;
        themeStyle['--brand-secondary'] = siteSettings.theme_secondary;
    }

    if (siteSettings.theme_accent) {
        themeStyle['--accent'] = siteSettings.theme_accent;
        themeStyle['--color-accent'] = siteSettings.theme_accent;
        themeStyle['--brand-accent'] = siteSettings.theme_accent;
    }

    // Google Analytics
    useEffect(() => {
        const gaId = siteSettings.google_analytics_id;
        if (!gaId) return;
        if (document.getElementById('ga-script')) return;
        const script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
        const inline = document.createElement('script');
        inline.id = 'ga-inline';
        inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
        document.head.appendChild(inline);
    }, [siteSettings.google_analytics_id]);

    if (loading) {
        return <LoadingPage />;
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <ErrorState
                    title="Gagal Memuat Lembaga"
                    message={error}
                    onRetry={() => {
                        sessionStorage.clear();
                        window.location.reload();
                    }}
                />
            </div>
        );
    }

    const isRtl = lang === 'ar';

    // WhatsApp URL — append custom message if available
    const whatsappNumber = siteSettings.whatsapp_number || '';
    const whatsappMessage = siteSettings.whatsapp_message || '';
    const whatsappBase = whatsappNumber
        ? whatsappNumber.startsWith('http')
            ? whatsappNumber
            : `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`
        : siteSettings.phone
          ? `https://wa.me/${siteSettings.phone.replace(/[^0-9]/g, '')}`
          : '';
    const whatsappHref = whatsappBase
        ? whatsappMessage
            ? `${whatsappBase}?text=${encodeURIComponent(whatsappMessage)}`
            : whatsappBase
        : '';

    return (
        <>
            <div
                className="brand-theme flex min-h-screen flex-col bg-white text-gray-800 dark:bg-gray-950 dark:text-gray-200"
                dir={isRtl ? 'rtl' : 'ltr'}
                lang={lang}
                style={themeStyle as CSSProperties}
            >
                {/* Skip to content link for accessibility */}
                <a
                    href="#main-content"
                    className="focus:bg-brand-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-white focus:outline-none"
                >
                    {lang === 'ar'
                        ? 'انتقل إلى المحتوى الرئيسي'
                        : lang === 'en'
                          ? 'Skip to main content'
                          : 'Langsung ke konten utama'}
                </a>

                <Header />

                <PopupBanner lang={lang} institutionId={institution?.id} />

                {menus && menus.length === 0 && (
                    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                        {lang === 'en'
                            ? 'Navigation menu has not been configured. Please set up the menu in admin panel.'
                            : lang === 'ar'
                              ? 'لم يتم تكوين قائمة التنقل. يرجى إعداد القائمة في لوحة الإدارة.'
                              : 'Menu navigasi belum dikonfigurasi. Silakan atur menu di panel admin.'}
                    </div>
                )}

                <main id="main-content" className="flex-1 pb-16 lg:pb-0">
                    <Outlet />
                </main>

                <Footer />
            </div>

            {/* Floating WhatsApp Button */}
            {whatsappHref && (
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 ${isRtl ? 'left-6' : 'right-6'} bottom-[5.5rem] lg:bottom-20`}
                    aria-label="WhatsApp"
                >
                    <svg
                        className="h-7 w-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>
            )}

            {/* Mobile Bottom Navigation */}
            <MobileBottomBar />
        </>
    );
}
