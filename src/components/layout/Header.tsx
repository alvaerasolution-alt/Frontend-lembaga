import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    Search,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Globe,
    LayoutGrid,
    Sun,
    Moon,
} from 'lucide-react';
import { fetchMenus } from '@/api/menus';
import { fetchSettings } from '@/api/settings';
import { fetchInstitution } from '@/api/institution';
import { useInstitution } from '@/context/InstitutionContext';
import { useLanguage } from '@/context/LanguageContext';
import type { MenuItem, SiteSettings } from '@/types';

const DEFAULT_PORTALS = [
    { label: 'SIAkad', key: 'siakad_url' },
    { label: 'SIDosen', key: 'sidosen_url' },
    { label: 'SIAMa', key: 'siama_url' },
    { label: 'e-Learning', key: 'elearning_url' },
    { label: 'Repository', key: 'repository_url' },
    { label: 'e-Journal', key: 'ejournal_url' },
    { label: 'LMS', key: 'lms_url' },
    { label: 'Semua Portal', key: 'portal_url' },
] as const;

const DEFAULT_MAX_NAV_ROOT_ITEMS = 7;
const OVERFLOW_MENU_ID = -999999;

function normalizeExternalUrl(url?: string): string {
    const value = (url || '').trim();
    if (!value || value === '#') return '#';
    if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) return value;
    return `https://${value.replace(/^\/+/, '')}`;
}

function resolveMaxNavRootItems(rawValue?: string): number {
    const parsed = Number.parseInt((rawValue || '').trim(), 10);
    if (Number.isNaN(parsed)) return DEFAULT_MAX_NAV_ROOT_ITEMS;
    if (parsed < 1) return 1;
    if (parsed > 7) return 7;
    return parsed;
}

// ─────────────────────────────────────────────────────────────
// Desktop: komponen rekursif untuk dropdown item (N-level)
// ─────────────────────────────────────────────────────────────
function DesktopDropdownItem({
    item,
    getLabel,
    mapUrl,
}: {
    item: MenuItem;
    getLabel: (item: MenuItem) => string;
    mapUrl: (url: string) => string;
}) {
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasChildren = item.children?.length > 0;

    const handleEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpen(true);
    };
    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 80);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!hasChildren) {
        const href = mapUrl(item.url);
        const isExternal = href.startsWith('http');
        return isExternal ? (
            <a
                href={href}
                target={item.target || '_self'}
                rel="noopener noreferrer"
                className="block px-4 py-2.5 text-base text-gray-700 transition-colors hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:bg-[var(--brand-primary)]/20 dark:hover:text-[var(--brand-primary)]"
                role="menuitem"
            >
                {getLabel(item)}
            </a>
        ) : (
            <Link
                to={href}
                className="block px-4 py-2.5 text-base text-gray-700 transition-colors hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:bg-[var(--brand-primary)]/20 dark:hover:text-[var(--brand-primary)]"
                role="menuitem"
            >
                {getLabel(item)}
            </Link>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <div
                className="flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5 text-base text-gray-700 transition-colors hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:bg-[var(--brand-primary)]/20 dark:hover:text-[var(--brand-primary)]"
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen(!open);
                    } else if (e.key === 'Escape') {
                        setOpen(false);
                    }
                }}
            >
                {getLabel(item)}
                <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-40" />
            </div>

            {open && (
                <div className="absolute top-0 left-full z-50 min-w-[200px] rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    {item.children.map((child) => (
                        <DesktopDropdownItem
                            key={child.id}
                            item={child}
                            getLabel={getLabel}
                            mapUrl={mapUrl}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Mobile: komponen rekursif accordion (N-level)
// ─────────────────────────────────────────────────────────────
function MobileMenuItem({
    item,
    getLabel,
    mapUrl,
    onClose,
    depth = 0,
}: {
    item: MenuItem;
    getLabel: (item: MenuItem) => string;
    mapUrl: (url: string) => string;
    onClose: () => void;
    depth?: number;
}) {
    const [open, setOpen] = useState(false);
    const hasChildren = item.children?.length > 0;

    return (
        <div style={{ paddingLeft: depth * 12 }}>
            {hasChildren ? (
                <>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex w-full items-center justify-between py-2.5 text-base font-medium text-gray-700 dark:text-gray-300"
                    >
                        {getLabel(item)}
                        <ChevronDown
                            className={`h-3.5 w-3.5 text-gray-400 transition-transform dark:text-gray-500 ${open ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {open &&
                        item.children.map((child) => (
                            <MobileMenuItem
                                key={child.id}
                                item={child}
                                getLabel={getLabel}
                                mapUrl={mapUrl}
                                onClose={onClose}
                                depth={depth + 1}
                            />
                        ))}
                </>
            ) : (
                (() => {
                    const href = mapUrl(item.url);
                    const isExternal = href.startsWith('http');
                    return isExternal ? (
                        <a
                            href={href}
                            target={item.target || '_self'}
                            rel="noopener noreferrer"
                            className="block py-2.5 text-base text-gray-600 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                            onClick={onClose}
                        >
                            {getLabel(item)}
                        </a>
                    ) : (
                        <Link
                            to={href}
                            className="block py-2.5 text-base text-gray-600 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                            onClick={onClose}
                        >
                            {getLabel(item)}
                        </Link>
                    );
                })()
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────
export default function Header() {
    const { institution } = useInstitution();
    const { lang, setLang, withLocale } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHint, setSearchHint] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [portalOpen, setPortalOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() =>
        document.documentElement.classList.contains('dark'),
    );
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const portalRef = useRef<HTMLDivElement>(null);

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

    const { data: institutionData } = useQuery({
        queryKey: ['institution'],
        queryFn: fetchInstitution,
        staleTime: 1000 * 60 * 10,
    });

    // Close mobile menu on route change
    useEffect(() => {
        queueMicrotask(() => setMobileMenuOpen(false));
    }, [location.pathname]);

    // Scroll shadow effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close portal dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                portalRef.current &&
                !portalRef.current.contains(event.target as Node)
            ) {
                setPortalOpen(false);
            }
        }
        if (portalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [portalOpen]);

    // Check if search feature is enabled
    const isSearchEnabled =
        institutionData?.enabled_features?.includes('pencarian');

    const getLabel = useCallback(
        (item: MenuItem) => {
            if (lang === 'ar' && item.label_ar) return item.label_ar;
            return lang === 'en' && item.label_en
                ? item.label_en
                : item.label_id;
        },
        [lang],
    );

    const siteSettings: SiteSettings = settings || {};
    const maxNavRootItems = resolveMaxNavRootItems(
        siteSettings.navbar_max_items,
    );

    const rootMenus = menus || [];
    const topLevelMenus: MenuItem[] =
        rootMenus.length <= maxNavRootItems
            ? rootMenus
            : [
                  ...rootMenus.slice(0, maxNavRootItems),
                  {
                      id: OVERFLOW_MENU_ID,
                      label_id: 'Lainnya',
                      label_en: 'More',
                      label_ar: 'المزيد',
                      url: '#',
                      icon: '',
                      target: '_self',
                      parent_id: null,
                      order: 999999,
                      is_active: true,
                      children: rootMenus.slice(maxNavRootItems),
                  },
              ];

    // Map menu URLs — relative URLs stay as-is for React Router
    const mapUrl = useCallback(
        (url: string) => {
            if (!url || url === '#') return url;
            if (url.startsWith('http://') || url.startsWith('https://'))
                return url;
            return withLocale(url);
        },
        [withLocale],
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed.length < 2) {
            setSearchHint(
                lang === 'ar'
                    ? 'الحد الأدنى حرفان'
                    : lang === 'en'
                      ? 'Minimum 2 characters'
                      : 'Minimal 2 karakter',
            );
            return;
        }
        setSearchHint('');
        navigate(withLocale(`/pencarian?q=${encodeURIComponent(trimmed)}`));
        setSearchOpen(false);
        setSearchQuery('');
    };

    const toggleDark = () => {
        document.documentElement.classList.toggle('dark');
        setDarkMode(!darkMode);
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
    };

    const LANGUAGES = [
        { code: 'id' as const, label: 'ID' },
        { code: 'en' as const, label: 'EN' },
        { code: 'ar' as const, label: 'AR' },
    ];

    const portalLinks: Array<{ label: string; href: string }> = [];
    for (const portal of DEFAULT_PORTALS) {
        const rawUrl = (siteSettings[portal.key] || '').trim();
        if (!rawUrl) continue;

        portalLinks.push({
            label: portal.label,
            href: normalizeExternalUrl(rawUrl),
        });
    }

    // Logo: prioritas logo_url dari Site Settings, fallback ke institution.logo_url
    const logoUrl =
        siteSettings.logo_url ||
        siteSettings.logo ||
        institutionData?.logo_url ||
        institution?.logo_url ||
        institution?.logo;
    const logoAlt = siteSettings.site_name || institution?.name || '';

    return (
        <header
            className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 dark:bg-gray-900 ${
                scrolled
                    ? 'shadow-lg shadow-black/5 dark:shadow-black/20'
                    : 'shadow-sm'
            }`}
        >
            {/* ── Top Utility Bar ── */}
            <div className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 py-2">
                    {/* Mobile bar 1: Brand */}
                    <div className="flex items-center justify-between lg:hidden">
                        <Link
                            to={withLocale('/')}
                            className="flex min-w-0 items-center gap-2.5"
                        >
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={logoAlt}
                                    className="h-9 w-auto"
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
                                className="max-w-[70vw] truncate text-base font-bold tracking-tight text-gray-900 dark:text-white"
                                style={{ display: logoUrl ? 'none' : '' }}
                            >
                                {logoAlt || 'Lembaga'}
                            </span>
                        </Link>
                    </div>

                    {/* Mobile bar 2: Language dropdown + Hamburger */}
                    <div className="mt-2 flex items-center justify-end gap-1 lg:hidden">
                        {/* Language selector (mobile compact as dropdown) */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setLangDropdownOpen(!langDropdownOpen)
                                }
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-gray-600 uppercase transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                aria-label="Pilih bahasa"
                            >
                                <Globe className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                                <span>{lang.toUpperCase()}</span>
                                <ChevronDown
                                    className={`h-3 w-3 text-gray-400 transition-transform dark:text-gray-500 ${
                                        langDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            {langDropdownOpen && (
                                <div className="absolute right-0 z-50 mt-1 w-24 rounded-md border border-gray-200 bg-white py-1 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900">
                                    {LANGUAGES.map((langItem) => (
                                        <button
                                            key={langItem.code}
                                            onClick={() => {
                                                setLang(langItem.code);
                                                setLangDropdownOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between px-2 py-1 transition-colors ${
                                                langItem.code === lang
                                                    ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] dark:bg-[var(--brand-primary)]/20 dark:text-[var(--brand-primary)]'
                                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                            }`}
                                            aria-label={`Switch language to ${langItem.label}`}
                                        >
                                            {langItem.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Desktop bar: Brand + Menus + utilities in one row */}
                    <div className="hidden items-center justify-between lg:flex">
                        <Link
                            to={withLocale('/')}
                            className="flex min-w-0 items-center gap-2.5"
                        >
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={logoAlt}
                                    className="h-9 w-auto"
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
                                className="max-w-[70vw] truncate text-base font-bold tracking-tight text-gray-900 dark:text-white"
                                style={{ display: logoUrl ? 'none' : '' }}
                            >
                                {logoAlt || 'Lembaga'}
                            </span>
                        </Link>

                        {/* Center: Menus */}
                        <div
                            className="hidden flex-1 items-center justify-center lg:flex"
                            role="menubar"
                        >
                            {topLevelMenus.map((item) => {
                                const hasChildren = item.children?.length > 0;

                                return (
                                    <div
                                        key={item.id}
                                        className="relative"
                                        onMouseEnter={() =>
                                            setActiveDropdown(item.id)
                                        }
                                        onMouseLeave={() =>
                                            setActiveDropdown(null)
                                        }
                                    >
                                        {/* Root-level trigger */}
                                        {hasChildren ? (
                                            <button
                                                className={`flex items-center gap-1.5 px-4 py-3.5 text-base font-medium transition-colors ${
                                                    activeDropdown === item.id
                                                        ? 'text-[var(--brand-primary)] dark:text-[var(--brand-primary)]'
                                                        : 'text-gray-700 hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:text-[var(--brand-primary)]'
                                                }`}
                                                role="menuitem"
                                                aria-haspopup="true"
                                                aria-expanded={
                                                    activeDropdown === item.id
                                                }
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === 'Enter' ||
                                                        e.key === ' '
                                                    ) {
                                                        e.preventDefault();
                                                        setActiveDropdown(
                                                            activeDropdown ===
                                                                item.id
                                                                ? null
                                                                : item.id,
                                                        );
                                                    } else if (
                                                        e.key === 'Escape'
                                                    ) {
                                                        setActiveDropdown(null);
                                                    }
                                                }}
                                            >
                                                {getLabel(item)}
                                                <ChevronDown
                                                    className={`h-3 w-3 transition-transform ${
                                                        activeDropdown ===
                                                        item.id
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            </button>
                                        ) : (
                                            (() => {
                                                const href = mapUrl(item.url);
                                                const isExternal =
                                                    href.startsWith('http');
                                                return isExternal ? (
                                                    <a
                                                        href={href}
                                                        target={
                                                            item.target ||
                                                            '_self'
                                                        }
                                                        rel="noopener noreferrer"
                                                        className="block px-4 py-3.5 text-base font-medium text-gray-700 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:text-[var(--brand-primary)]"
                                                        role="menuitem"
                                                    >
                                                        {getLabel(item)}
                                                    </a>
                                                ) : (
                                                    <Link
                                                        to={href || '#'}
                                                        className="block px-4 py-3.5 text-base font-medium text-gray-700 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:text-[var(--brand-primary)]"
                                                        role="menuitem"
                                                    >
                                                        {getLabel(item)}
                                                    </Link>
                                                );
                                            })()
                                        )}

                                        {/* Active indicator line */}
                                        {activeDropdown === item.id && (
                                            <div className="absolute right-4 bottom-0 left-4 h-0.5 rounded-full bg-[var(--brand-primary)]" />
                                        )}

                                        {/* First dropdown panel (rekursif via DesktopDropdownItem) */}
                                        {hasChildren &&
                                            activeDropdown === item.id && (
                                                <div
                                                    className="absolute top-full left-0 z-50 min-w-[220px] rounded-xl border border-gray-100 bg-white py-1.5 shadow-2xl dark:border-gray-700 dark:bg-gray-800"
                                                    role="menu"
                                                >
                                                    {item.children.map(
                                                        (child) => (
                                                            <DesktopDropdownItem
                                                                key={child.id}
                                                                item={child}
                                                                getLabel={
                                                                    getLabel
                                                                }
                                                                mapUrl={mapUrl}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-1">
                            <div className="flex items-center gap-1">
                                {/* Search toggle — only shown when 'pencarian' feature is enabled */}
                                {isSearchEnabled && (
                                    <button
                                        onClick={() =>
                                            setSearchOpen(!searchOpen)
                                        }
                                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-[var(--brand-primary)]"
                                        aria-label="Cari"
                                    >
                                        <Search className="h-4 w-4" />
                                    </button>
                                )}

                                {/* Portal Quick Access */}
                                <div className="relative" ref={portalRef}>
                                    <button
                                        onClick={() =>
                                            setPortalOpen(!portalOpen)
                                        }
                                        className={`rounded-lg p-2 transition-colors ${
                                            portalOpen
                                                ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] dark:bg-[var(--brand-primary)]/20 dark:text-[var(--brand-primary)]'
                                                : 'text-gray-500 hover:bg-gray-100 hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-[var(--brand-primary)]'
                                        }`}
                                        aria-label="Portal Sistem Informasi"
                                    >
                                        <LayoutGrid className="h-4 w-4" />
                                    </button>
                                    {portalOpen && (
                                        <div className="absolute top-full right-0 z-50 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
                                            <h3 className="mb-3 border-b border-gray-100 pb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:border-gray-700 dark:text-gray-500">
                                                Sistem Informasi
                                            </h3>
                                            <div className="grid grid-cols-2 gap-1">
                                                {portalLinks.map((portal) => (
                                                    <a
                                                        key={portal.label}
                                                        href={portal.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded-lg px-3 py-2 text-center text-xs font-medium text-gray-600 transition-colors hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] dark:text-gray-300 dark:hover:bg-[var(--brand-primary)]/20 dark:hover:text-[var(--brand-primary)]"
                                                    >
                                                        {portal.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />

                                {/* Dark mode toggle */}
                                <button
                                    onClick={toggleDark}
                                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-[var(--brand-primary)]"
                                    aria-label={
                                        darkMode
                                            ? 'Switch to light mode'
                                            : 'Switch to dark mode'
                                    }
                                >
                                    {darkMode ? (
                                        <Sun className="h-4 w-4" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />

                                {/* Language selector */}
                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setLangDropdownOpen(
                                                !langDropdownOpen,
                                            )
                                        }
                                        className="flex items-center gap-1 rounded-lg p-2 text-xs font-semibold text-gray-500 uppercase transition-colors hover:bg-gray-100 hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-[var(--brand-primary)]"
                                        aria-label="Pilih bahasa"
                                    >
                                        <Globe className="h-4 w-4" />
                                        <span>{lang}</span>
                                        <ChevronDown
                                            className={`h-3 w-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {langDropdownOpen && (
                                        <div className="absolute top-full right-0 mt-1 w-24 rounded-md border border-gray-100 bg-white py-1 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                            {LANGUAGES.map((langItem) => (
                                                <button
                                                    key={langItem.code}
                                                    onClick={() => {
                                                        setLang(langItem.code);
                                                        setLangDropdownOpen(
                                                            false,
                                                        );
                                                    }}
                                                    className={`flex w-full items-center justify-between px-3 py-2 transition-colors ${
                                                        langItem.code === lang
                                                            ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] dark:bg-[var(--brand-primary)]/20 dark:text-[var(--brand-primary)]'
                                                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {langItem.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Search Bar (expandable) ── */}
            {searchOpen && isSearchEnabled && (
                <div className="border-b border-gray-100 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                    <form onSubmit={handleSearch} className="mx-auto max-w-7xl">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (
                                        searchHint &&
                                        e.target.value.trim().length >= 2
                                    ) {
                                        setSearchHint('');
                                    }
                                }}
                                placeholder={
                                    lang === 'ar'
                                        ? 'ابحث في الأخبار والصفحات والأحداث...'
                                        : lang === 'en'
                                          ? 'Search news, pages, events...'
                                          : 'Cari berita, halaman, agenda...'
                                }
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm text-gray-900 transition-colors outline-none focus:border-[var(--brand-primary)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-[var(--brand-primary)] dark:focus:bg-gray-700 dark:focus:ring-[var(--brand-primary)]/30"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setSearchOpen(false)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        {searchHint && (
                            <p className="mt-1 pl-3 text-xs text-red-500 dark:text-red-400">
                                {searchHint}
                            </p>
                        )}
                    </form>
                </div>
            )}

            {/* ── Main Navigation ── */}
            <nav
                className="bg-white dark:bg-gray-900"
                role="navigation"
                aria-label={
                    lang === 'id'
                        ? 'Navigasi utama'
                        : lang === 'ar'
                          ? 'التنقل الرئيسي'
                          : 'Main navigation'
                }
            >
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex items-center justify-between">
                        {/* Desktop Navigation moved to top row */}

                        {/* Mobile actions moved to top utility bar */}
                    </div>
                </div>

                {/* ── Mobile Menu ── */}
                {mobileMenuOpen && (
                    <div className="border-t border-gray-100 lg:hidden dark:border-gray-700">
                        <div className="mx-auto max-w-7xl px-4 py-3">
                            {topLevelMenus.map((item) => (
                                <MobileMenuItem
                                    key={item.id}
                                    item={item}
                                    getLabel={getLabel}
                                    mapUrl={mapUrl}
                                    onClose={() => setMobileMenuOpen(false)}
                                />
                            ))}

                            {/* Portal Links in Mobile (moved from navbar) */}
                            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                                <p className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                    Sistem Informasi
                                </p>
                                <div className="grid grid-cols-2 gap-1">
                                    {portalLinks.map((portal) => (
                                        <a
                                            key={portal.label}
                                            href={portal.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg px-2 py-1.5 text-xs text-gray-600 transition-colors hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:bg-[var(--brand-primary)]/20 dark:hover:text-[var(--brand-primary)]"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            {portal.label}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Dark mode toggle in Mobile */}
                            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                                <p className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                    {lang === 'ar'
                                        ? 'المظهر'
                                        : lang === 'en'
                                          ? 'Appearance'
                                          : 'Tampilan'}
                                </p>
                                <button
                                    onClick={() => {
                                        toggleDark();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-[var(--brand-primary)]/10 hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:bg-[var(--brand-primary)]/20 dark:hover:text-[var(--brand-primary)]"
                                >
                                    {darkMode ? (
                                        <Sun className="h-4 w-4" />
                                    ) : (
                                        <Moon className="h-4 w-4" />
                                    )}
                                    {darkMode
                                        ? lang === 'ar'
                                            ? 'الوضع الفاتح'
                                            : lang === 'en'
                                              ? 'Light Mode'
                                              : 'Mode Terang'
                                        : lang === 'ar'
                                          ? 'الوضع الداكن'
                                          : lang === 'en'
                                            ? 'Dark Mode'
                                            : 'Mode Gelap'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Bottom accent line */}
            <div className="h-0.5 bg-[var(--brand-primary)]" />
        </header>
    );
}
