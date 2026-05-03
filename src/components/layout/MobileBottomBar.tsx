import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Newspaper, Phone, GraduationCap, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '@/api/settings';
import type { SiteSettings } from '@/types';

interface NavItem {
    id: string;
    labelId: string;
    labelEn: string;
    labelAr: string;
    icon: typeof Home;
    to?: string; // internal route (relative, will be prefixed with locale)
    href?: string; // external URL
    matchPaths?: string[]; // paths to match for active state
}

export default function MobileBottomBar() {
    const { lang, withLocale } = useLanguage();
    const location = useLocation();
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    const { data: settings } = useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 10,
    });

    const siteSettings: SiteSettings = settings || {};

    // Hide on scroll down, show on scroll up
    const handleScroll = useCallback(() => {
        if (ticking.current) return;
        ticking.current = true;

        requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;

            // Only toggle if scrolled more than 10px to avoid jitter
            if (delta > 10 && currentScrollY > 80) {
                setVisible(false);
            } else if (delta < -10) {
                setVisible(true);
            }

            lastScrollY.current = currentScrollY;
            ticking.current = false;
        });
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Always show when at top
    useEffect(() => {
        if (window.scrollY <= 10) {
            setVisible(true);
        }
    }, [location.pathname]);

    // Build nav items
    const navItems: NavItem[] = [
        {
            id: 'news',
            labelId: 'Berita',
            labelEn: 'News',
            labelAr: 'أخبار',
            icon: Newspaper,
            to: '/berita',
            matchPaths: ['berita', 'kategori'],
        },
        ...(siteSettings.pmb_url
            ? [
                  {
                      id: 'pmb',
                      labelId: 'PMB',
                      labelEn: 'PMB',
                      labelAr: 'القبول',
                      icon: GraduationCap,
                      href: siteSettings.pmb_url,
                      matchPaths: [] as string[],
                  },
              ]
            : []),
        {
            id: 'home',
            labelId: 'Beranda',
            labelEn: 'Home',
            labelAr: 'الرئيسية',
            icon: Home,
            to: '/',
            matchPaths: [''],
        },
        {
            id: 'contact',
            labelId: 'Hubungi',
            labelEn: 'Contact',
            labelAr: 'اتصل',
            icon: Phone,
            to: '/hubungi-kami',
            matchPaths: ['hubungi-kami', 'kontak'],
        },
        ...(siteSettings.portal_url
            ? [
                  {
                      id: 'portal',
                      labelId: 'Portal',
                      labelEn: 'Portal',
                      labelAr: 'البوابة',
                      icon: LayoutGrid,
                      href: siteSettings.portal_url,
                      matchPaths: [] as string[],
                  },
              ]
            : []),
    ];

    // Determine active item from current path
    const getActiveId = (): string => {
        // Extract path segments after locale prefix e.g. /id/berita/xxx → ['berita', 'xxx']
        const pathAfterLocale = location.pathname
            .replace(/^\/(id|en|ar)\/?/, '')
            .split('/')
            .filter(Boolean);
        const firstSegment = pathAfterLocale[0] || '';

        for (const item of navItems) {
            if (item.matchPaths?.includes(firstSegment)) {
                return item.id;
            }
        }

        return '';
    };

    const activeId = getActiveId();

    const getLabel = (item: NavItem): string => {
        if (lang === 'ar') return item.labelAr;
        if (lang === 'en') return item.labelEn;
        return item.labelId;
    };

    return (
        <nav
            id="mobile-bottom-bar"
            className={`fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200/60 bg-white/85 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:hidden dark:border-gray-700/60 dark:bg-gray-900/85 ${
                visible
                    ? 'translate-y-0 animate-[slideUp_0.3s_ease-out]'
                    : 'translate-y-full'
            }`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            role="navigation"
            aria-label={
                lang === 'ar'
                    ? 'التنقل السفلي'
                    : lang === 'en'
                      ? 'Bottom navigation'
                      : 'Navigasi bawah'
            }
        >
            <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1.5">
                {navItems.map((item) => {
                    const isActive = activeId === item.id;
                    const IconComponent = item.icon;

                    const itemClasses = `flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors duration-200 ${
                        isActive
                            ? 'text-[var(--brand-primary)]'
                            : 'text-gray-500 active:text-[var(--brand-primary)] dark:text-gray-400'
                    }`;

                    const content = (
                        <>
                            <div className="relative">
                                <IconComponent
                                    className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                            </div>
                            <span
                                className={`text-[10px] leading-tight font-medium ${isActive ? 'font-semibold' : ''}`}
                            >
                                {getLabel(item)}
                            </span>
                            {/* Active dot indicator */}
                            <div
                                className={`h-1 w-1 rounded-full transition-all duration-200 ${
                                    isActive
                                        ? 'bg-[var(--brand-primary)] opacity-100'
                                        : 'opacity-0'
                                }`}
                            />
                        </>
                    );

                    // External link (PMB)
                    if (item.href) {
                        return (
                            <a
                                key={item.id}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={itemClasses}
                                aria-label={getLabel(item)}
                            >
                                {content}
                            </a>
                        );
                    }

                    // Internal link
                    return (
                        <Link
                            key={item.id}
                            to={withLocale(item.to || '/')}
                            className={itemClasses}
                            aria-label={getLabel(item)}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
