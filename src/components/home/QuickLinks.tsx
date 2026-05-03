import {
    ExternalLink, LayoutGrid, BookOpen, GraduationCap, Trophy, CalendarDays,
    Newspaper, Megaphone, Users, FileText, Monitor, Building2, HeartHandshake,
    Microscope, Globe, ClipboardList, Library, Video, MessageSquare, Award,
    Briefcase, UserCircle, FlaskConical, Wifi, ShieldCheck, Landmark,
    BookMarked, School, Star, type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { QuickLink } from '@/types';

const ICON_MAP: Array<{ keywords: string[]; Icon: LucideIcon }> = [
    { keywords: ['elearning', 'e-learning', 'lms', 'belajar', 'kuliah online', 'moodle'], Icon: Monitor },
    { keywords: ['ppdb', 'penerimaan', 'pendaftaran', 'registrasi', 'daftar'], Icon: ClipboardList },
    { keywords: ['prestasi', 'achievement', 'award', 'juara', 'penghargaan'], Icon: Trophy },
    { keywords: ['event', 'agenda', 'kegiatan', 'jadwal', 'acara', 'kalender'], Icon: CalendarDays },
    { keywords: ['berita', 'news', 'informasi', 'artikel', 'blog'], Icon: Newspaper },
    { keywords: ['pengumuman', 'announcement', 'pemberitahuan'], Icon: Megaphone },
    { keywords: ['perpustakaan', 'library', 'pustaka', 'repository'], Icon: Library },
    { keywords: ['jurnal', 'journal', 'publikasi', 'ejournal', 'e-journal'], Icon: BookMarked },
    { keywords: ['mahasiswa', 'student', 'siakad', 'akademik'], Icon: GraduationCap },
    { keywords: ['dosen', 'sidosen', 'lecturer', 'staff', 'pegawai'], Icon: Users },
    { keywords: ['alumni', 'lulusan', 'graduate'], Icon: UserCircle },
    { keywords: ['penelitian', 'research', 'riset', 'laboratorium', 'lab'], Icon: Microscope },
    { keywords: ['pengabdian', 'masyarakat', 'komunitas'], Icon: HeartHandshake },
    { keywords: ['profil', 'tentang', 'about', 'sejarah', 'visi', 'misi'], Icon: Building2 },
    { keywords: ['beasiswa', 'scholarship', 'dana', 'bantuan'], Icon: Award },
    { keywords: ['karir', 'kerja', 'lowongan', 'career', 'job'], Icon: Briefcase },
    { keywords: ['fasilitas', 'sarana', 'prasarana', 'gedung'], Icon: School },
    { keywords: ['web', 'portal', 'website', 'sistem', 'si', 'siama'], Icon: Globe },
    { keywords: ['file', 'dokumen', 'document', 'download', 'unduh', 'formulir'], Icon: FileText },
    { keywords: ['video', 'youtube', 'streaming', 'media'], Icon: Video },
    { keywords: ['kontak', 'contact', 'hubungi', 'komunikasi', 'pesan'], Icon: MessageSquare },
    { keywords: ['wifi', 'jaringan', 'internet', 'network'], Icon: Wifi },
    { keywords: ['akreditasi', 'sertifikasi', 'izin', 'legalitas'], Icon: ShieldCheck },
    { keywords: ['hukum', 'kebijakan', 'regulasi', 'peraturan'], Icon: Landmark },
    { keywords: ['program', 'prodi', 'jurusan', 'fakultas', 'studi'], Icon: BookOpen },
    { keywords: ['riset', 'iptek', 'sains', 'science', 'teknologi'], Icon: FlaskConical },
    { keywords: ['testimoni', 'ulasan', 'review'], Icon: Star },
];

function getAutoIcon(title: string): LucideIcon {
    const lower = title.toLowerCase();
    for (const { keywords, Icon } of ICON_MAP) {
        if (keywords.some((kw) => lower.includes(kw))) return Icon;
    }
    return ExternalLink;
}

interface QuickLinksSectionProps {
    quickLinks: QuickLink[];
    hasSlider?: boolean;
    scrollSpeed?: number;
    locale?: string;
}

const VISIBLE_COUNT = 8;

export default function QuickLinks({
    quickLinks,
    hasSlider = true,
    locale = 'id',
}: QuickLinksSectionProps) {
    const [showAll, setShowAll] = useState(false);

    if (!quickLinks || quickLinks.length === 0) return null;

    const visibleLinks = showAll ? quickLinks : quickLinks.slice(0, VISIBLE_COUNT);
    const hasMore = quickLinks.length > VISIBLE_COUNT;

    const sectionTitle = locale === 'en' ? 'Featured Services' : locale === 'ar' ? 'الخدمات المميزة' : 'Layanan Unggulan';
    const moreLabel = locale === 'en' ? 'More' : locale === 'ar' ? 'المزيد' : 'Lainnya';
    const lessLabel = locale === 'en' ? 'Less' : locale === 'ar' ? 'أقل' : 'Lebih Sedikit';

    return (
        <section
            className={`relative z-10 px-4 pb-8 ${hasSlider ? '-mt-10 md:-mt-14' : 'pt-8'}`}
        >
            <div className="mx-auto max-w-6xl">
                <div className="rounded-2xl bg-white px-5 py-5 shadow-xl dark:bg-gray-800 dark:shadow-gray-900/40">
                    {/* Header */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-800 sm:text-base dark:text-white">
                            {sectionTitle}
                        </h2>
                        {hasMore && (
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="flex items-center gap-1.5 rounded-lg bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
                            >
                                <LayoutGrid className="h-3.5 w-3.5" />
                                {showAll ? lessLabel : moreLabel}
                            </button>
                        )}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
                        {visibleLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 px-2 py-3 text-center transition-all hover:border-[var(--brand-primary)]/40 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-emerald-500/40 dark:hover:bg-gray-700/50"
                            >
                                {/* Icon */}
                                {(() => {
                                    const AutoIcon = getAutoIcon(link.title);
                                    return (
                                        <div
                                            className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-9 sm:w-9"
                                            style={{ backgroundColor: link.color }}
                                        >
                                            {link.logo_url ? (
                                                <img
                                                    src={link.logo_url}
                                                    alt={link.title}
                                                    className="h-4 w-4 object-contain sm:h-5 sm:w-5"
                                                />
                                            ) : (
                                                <AutoIcon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                                            )}
                                        </div>
                                    );
                                })()}
                                {/* Label */}
                                <span className="line-clamp-2 text-[10px] font-medium leading-tight text-gray-700 group-hover:text-[var(--brand-primary)] sm:text-[11px] dark:text-gray-300 dark:group-hover:text-emerald-400">
                                    {link.title}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
