import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    ArrowUp,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    MessageCircle,
} from 'lucide-react';

import { fetchMenus } from '@/api/menus';
import { fetchSettings } from '@/api/settings';
import { useInstitution } from '@/context/InstitutionContext';
import { useLanguage } from '@/context/LanguageContext';
import type { MenuItem, SiteSettings } from '@/types';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        {...props}
    >
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.57-.26-1.1-.59-1.62-.93v8.18c-.11 3.27-2.73 5.9-6.02 5.97c-3.11.06-5.84-2.27-6.22-5.35c-.38-3.08 1.4-6.07 4.1-7.07c1.37-.53 2.87-.58 4.29-.18v4.25c-.71-.24-1.5-.13-2.12.35c-.62.49-.96 1.25-.9 2.03c.06.84.78 1.5 1.63 1.53c.96.03 1.78-.65 1.89-1.6c.03-.26.05-.53.05-.79V.02V.02z" />
    </svg>
);

export default function Footer() {
    const { institution } = useInstitution();
    const { lang, withLocale } = useLanguage();
    const [showBackToTop, setShowBackToTop] = useState(false);

    const { data: menus } = useQuery({
        queryKey: ['menus'],
        queryFn: fetchMenus,
        staleTime: 1000 * 60 * 10,
    });

    const { data: settings } = useQuery({
        queryKey: ['settings'],
        queryFn: fetchSettings,
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const siteSettings: SiteSettings = settings || {};

    // Build footer links from CMS menus, with fallbacks if no menus exist
    const getLabel = (item: MenuItem) => {
        if (lang === 'ar' && item.label_ar) return item.label_ar;
        return lang === 'en' && item.label_en ? item.label_en : item.label_id;
    };

    // Tambahkan prefix locale ke URL menu relatif
    const mapUrl = (url: string) => {
        if (!url || url === '#') return url;
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return withLocale(url);
    };

    const footerLinks =
        menus && menus.length > 0
            ? menus
                  .filter((m) => m.is_active)
                  .slice(0, 6)
                  .map((m) => ({
                      label: getLabel(m),
                      href: mapUrl(m.url),
                      target: m.target,
                      isExternal:
                          m.url.startsWith('http://') ||
                          m.url.startsWith('https://'),
                  }))
            : [
                  {
                      label:
                          lang === 'ar'
                              ? 'اتصل بنا'
                              : lang === 'en'
                                ? 'Contact Us'
                                : 'Hubungi Kami',
                      href: withLocale('/hubungi-kami'),
                      target: '_self',
                      isExternal: false,
                  },
                  {
                      label:
                          lang === 'ar'
                              ? 'أخبار'
                              : lang === 'en'
                                ? 'News'
                                : 'Berita',
                      href: withLocale('/berita'),
                      target: '_self',
                      isExternal: false,
                  },
                  {
                      label:
                          lang === 'ar'
                              ? 'الأحداث'
                              : lang === 'en'
                                ? 'Events'
                                : 'Agenda',
                      href: withLocale('/agenda-kegiatan'),
                      target: '_self',
                      isExternal: false,
                  },
                  {
                      label:
                          lang === 'ar'
                              ? 'الأسئلة الشائعة'
                              : lang === 'en'
                                ? 'FAQ'
                                : 'FAQ',
                      href: withLocale('/faq'),
                      target: '_self',
                      isExternal: false,
                  },
              ];

    const socialLinks = [
        {
            icon: Facebook,
            href: siteSettings.facebook_url || '#',
            label: 'Facebook',
        },
        {
            icon: Instagram,
            href: siteSettings.instagram_url || '#',
            label: 'Instagram',
        },
        {
            icon: Youtube,
            href: siteSettings.youtube_url || '#',
            label: 'YouTube',
        },
        {
            icon: TikTokIcon,
            href: siteSettings.tiktok_url || '#',
            label: 'TikTok',
        },
        {
            icon: Twitter,
            href: siteSettings.twitter_url || '#',
            label: 'Twitter',
        },
        {
            icon: MessageCircle,
            href: siteSettings.whatsapp_number
                ? siteSettings.whatsapp_number.startsWith('http')
                    ? siteSettings.whatsapp_number
                    : `https://wa.me/${siteSettings.whatsapp_number.replace(/[^0-9]/g, '')}`
                : '#',
            label: 'WhatsApp',
        },
    ].filter((s) => s.href && s.href !== '#');

    // Logo footer: prioritas logo_footer_url, fallback ke logo_url / institution.logo_url
    const logoUrl =
        siteSettings.logo_footer_url ||
        siteSettings.logo_url ||
        siteSettings.logo ||
        institution?.logo_url ||
        institution?.logo;

    return (
        <footer className="bg-brand-primary text-white">
            {/* Footer Top Bar */}
            <div className="border-b border-white/20">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 py-4 text-sm md:gap-6">
                    {footerLinks.map((link) =>
                        link.isExternal ? (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-[var(--brand-accent)]"
                            >
                                {link.label}
                            </a>
                        ) : (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="transition-colors hover:text-[var(--brand-accent)]"
                            >
                                {link.label}
                            </Link>
                        ),
                    )}
                </div>
            </div>

            {/* Footer Main */}
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Column 1: Logo + Address */}
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={institution?.name || ''}
                                    loading="lazy"
                                    className="h-12 w-auto"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        const fallback =
                                            e.currentTarget.nextElementSibling;
                                        if (fallback)
                                            (
                                                fallback as HTMLElement
                                            ).style.display = '';
                                    }}
                                />
                            ) : null}
                            <span
                                className="text-xl font-bold"
                                style={{ display: logoUrl ? 'none' : '' }}
                            >
                                {institution?.name || ''}
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/80">
                            {siteSettings.address ||
                                'Jalan Taman Siswa Pekeng, Tahunan, Kab. Jepara, Jawa Tengah, 59427'}
                        </p>
                    </div>

                    {/* Column 2: Contact Info */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            {lang === 'ar'
                                ? 'اتصل بنا'
                                : lang === 'en'
                                  ? 'Contact'
                                  : 'Kontak'}
                        </h3>
                        {siteSettings.phone && (
                            <p className="mb-2 text-sm text-white/80">
                                Telephone: {siteSettings.phone}
                            </p>
                        )}
                        {siteSettings.email && (
                            <p className="mb-2 text-sm text-white/80">
                                Email: {siteSettings.email}
                            </p>
                        )}
                        {!siteSettings.phone && !siteSettings.email && (
                            <p className="text-sm text-white/80">
                                Telephone: (0291) 595320
                            </p>
                        )}
                    </div>

                    {/* Column 3: Social + CTA */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">
                            {lang === 'ar'
                                ? 'تابعنا'
                                : lang === 'en'
                                  ? 'Follow Us'
                                  : 'Ikuti Kami'}
                        </h3>
                        <div className="mb-6 flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                        {siteSettings.pmb_url && (
                            <a
                                href={siteSettings.pmb_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                            >
                                JOIN PMB IAIKU
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-white/20">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-sm text-white/60">
                    <p>
                        {siteSettings.copyright_text ||
                            `\u00A9 Copyright ${new Date().getFullYear()}. All Rights Reserved by ${institution?.name || ''}`}
                    </p>
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={`bg-brand-primary fixed z-50 rounded-full p-3 text-white shadow-lg transition-all duration-300 hover:opacity-90 right-6 bottom-[5.5rem] lg:bottom-6 ${
                    showBackToTop
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-4 opacity-0'
                }`}
                aria-label="Back to top"
            >
                <ArrowUp className="h-5 w-5" />
            </button>
        </footer>
    );
}
