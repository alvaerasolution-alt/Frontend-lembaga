import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Award,
    BookOpen,
    ExternalLink,
    GraduationCap,
    BookText,
    Microscope,
    HeartHandshake,
    FileText,
    Copyright,
} from 'lucide-react';
import { fetchDosenDetail } from '@/api/dosen';
import { useLanguage } from '@/context/LanguageContext';
import { Loading } from '@/components/ui/Loading';
import { ErrorState } from '@/components/ui/ErrorState';

type TabType = 'mata_kuliah' | 'bahan_ajar' | 'penelitian' | 'pengabdian' | 'publikasi' | 'hki' | 'referensi';

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'mata_kuliah', label: 'Mata Kuliah', icon: <GraduationCap className="h-4 w-4" /> },
    { key: 'bahan_ajar', label: 'Bahan Ajar', icon: <BookText className="h-4 w-4" /> },
    { key: 'penelitian', label: 'Penelitian', icon: <Microscope className="h-4 w-4" /> },
    { key: 'pengabdian', label: 'Pengabdian', icon: <HeartHandshake className="h-4 w-4" /> },
    { key: 'publikasi', label: 'Publikasi', icon: <FileText className="h-4 w-4" /> },
    { key: 'hki', label: 'HKI', icon: <Copyright className="h-4 w-4" /> },
    { key: 'referensi', label: 'Referensi', icon: <Award className="h-4 w-4" /> },
];

export default function DosenDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { lang, withLocale } = useLanguage();
    const [activeTab, setActiveTab] = useState<TabType>('mata_kuliah');

    const {
        data: dosen,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['dosen-detail', id],
        queryFn: () => fetchDosenDetail(Number(id)),
        enabled: !!id,
    });

    if (isLoading) return <Loading />;
    if (error || !dosen) return <ErrorState onRetry={() => refetch()} />;

    const bio =
        lang === 'en'
            ? dosen.bio_en
            : lang === 'ar'
              ? dosen.bio_ar
              : dosen.bio_id;
    const expertise =
        lang === 'en'
            ? dosen.expertise_en
            : lang === 'ar'
              ? dosen.expertise_ar
              : dosen.expertise_id;
    const studyProgramName = dosen.study_program
        ? lang === 'en'
            ? dosen.study_program.name_en || dosen.study_program.name_id
            : dosen.study_program.name_id
        : null;

    const hasAcademicData =
        dosen.mata_kuliah?.length ||
        dosen.bahan_ajar?.length ||
        dosen.penelitian?.length ||
        dosen.pengabdian?.length ||
        dosen.publikasi?.length ||
        dosen.hki?.length ||
        dosen.referensi?.length;

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] py-8 md:py-16">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex flex-col items-center gap-5 md:flex-row md:items-start md:gap-6">
                        {/* Photo */}
                        <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border-4 border-white/30 shadow-lg sm:h-32 sm:w-32 md:h-40 md:w-40">
                            {dosen.photo ? (
                                <img
                                    src={dosen.photo_url ?? dosen.photo}
                                    alt={dosen.full_name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-white/20">
                                    <User className="h-16 w-16 text-white/60" />
                                </div>
                            )}
                        </div>
                        {/* Info */}
                        <div className="min-w-0 w-full text-center md:text-left">
                            <h1 className="text-xl font-bold text-white sm:text-2xl md:text-3xl break-words">
                                {dosen.full_name}
                            </h1>
                            {dosen.nidn && (
                                <p className="mt-1 text-sm text-white/80">
                                    NIDN: {dosen.nidn}
                                </p>
                            )}
                            {studyProgramName && (
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-white/90 md:justify-start">
                                    <BookOpen className="h-4 w-4" />
                                    {studyProgramName}
                                </p>
                            )}
                            {/* Contact links */}
                            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                                {dosen.email && (
                                    <a
                                        href={`mailto:${dosen.email}`}
                                        className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/30 sm:text-sm"
                                    >
                                        <Mail className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                        <span className="truncate">{dosen.email}</span>
                                    </a>
                                )}
                                {dosen.phone && (
                                    <a
                                        href={`tel:${dosen.phone}`}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/30 sm:text-sm"
                                    >
                                        <Phone className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                        {dosen.phone}
                                    </a>
                                )}
                                {dosen.scholar_url && (
                                    <a
                                        href={dosen.scholar_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/30 sm:text-sm"
                                    >
                                        <Award className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                        Google Scholar
                                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-8 md:py-12">
                <div className="mx-auto max-w-7xl px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Link
                            to={withLocale('/dosen')}
                            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-[var(--brand-primary)] dark:text-gray-400 dark:hover:text-[var(--brand-primary)]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {lang === 'id'
                                ? 'Kembali ke Daftar Dosen'
                                : lang === 'en'
                                  ? 'Back to Lecturers'
                                  : 'العودة إلى المحاضرين'}
                        </Link>
                    </div>

                    <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 md:space-y-8 lg:col-span-2">
                            {/* Bio */}
                            {bio && (
                                <section>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {lang === 'id'
                                            ? 'Biografi'
                                            : lang === 'en'
                                              ? 'Biography'
                                              : 'السيرة الذاتية'}
                                    </h2>
                                    <div
                                        className="prose max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                        dangerouslySetInnerHTML={{ __html: bio }}
                                    />
                                </section>
                            )}

                            {/* Expertise */}
                            {expertise && (
                                <section>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {lang === 'id'
                                            ? 'Bidang Keahlian'
                                            : lang === 'en'
                                              ? 'Area of Expertise'
                                              : 'مجال الخبرة'}
                                    </h2>
                                    <div
                                        className="prose max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                        dangerouslySetInnerHTML={{ __html: expertise }}
                                    />
                                </section>
                            )}

                            {/* Publications (rich text) */}
                            {!!dosen.publications && (
                                <section>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {lang === 'id' ? 'Publikasi (Lainnya)' : lang === 'en' ? 'Other Publications' : 'المنشورات'}
                                    </h2>
                                    <div
                                        className="prose max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert prose-headings:text-gray-900 prose-a:text-[var(--brand-primary)]"
                                        dangerouslySetInnerHTML={{
                                            __html: typeof dosen.publications === 'string' ? dosen.publications : '',
                                        }}
                                    />
                                </section>
                            )}

                            {/* Akademik & Penelitian - Tabbed Tables */}
                            {!!hasAcademicData && (
                                <section>
                                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                                        {lang === 'id' ? 'Akademik & Penelitian' : lang === 'en' ? 'Academic & Research' : 'الأكاديمية والبحث'}
                                    </h2>

                                    {/* Tab Navigation */}
                                    <div className="mb-4 border-b">
                                        <div className="flex flex-wrap gap-1">
                                            {tabs.map((tab) => {
                                                const field = dosen[tab.key as keyof typeof dosen];
                                                const count = Array.isArray(field) ? field.length : 0;
                                                return (
                                                    <button
                                                        key={tab.key}
                                                        onClick={() => setActiveTab(tab.key)}
                                                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-[2px] ${
                                                            activeTab === tab.key
                                                                ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                                        }`}
                                                    >
                                                        {tab.icon}
                                                        {tab.label}
                                                        {count > 0 && (
                                                            <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                                {count}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Tab Content */}
                                    <div className="overflow-hidden rounded-lg border">
                                        {/* Mata Kuliah */}
                                        {activeTab === 'mata_kuliah' && (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-16">No</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">{lang === 'id' ? 'Nama Mata Kuliah' : 'Course Name'}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {dosen.mata_kuliah && dosen.mata_kuliah.length > 0 ? (
                                                        dosen.mata_kuliah.map((item, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={2} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Belum ada data mata kuliah' : 'No courses available'}</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}

                                        {/* Bahan Ajar */}
                                        {activeTab === 'bahan_ajar' && (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Judul</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Nama Jenis</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Nama Penerbit</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Tanggal Terbit</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {dosen.bahan_ajar && dosen.bahan_ajar.length > 0 ? (
                                                        dosen.bahan_ajar.map((item, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.judul}</td>
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.nama_jenis}</td>
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.nama_penerbit}</td>
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.tanggal_terbit}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Belum ada data bahan ajar' : 'No teaching materials available'}</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}

                                        {/* Penelitian */}
                                        {activeTab === 'penelitian' && (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Judul</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-40">Tahun Pelaksanaan</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {dosen.penelitian && dosen.penelitian.length > 0 ? (
                                                        dosen.penelitian.map((item, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.judul}</td>
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.tahun_pelaksanaan}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Belum ada data penelitian' : 'No research available'}</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}

                                        {/* Pengabdian */}
                                        {activeTab === 'pengabdian' && (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Judul</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-40">Tahun Pelaksanaan</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {dosen.pengabdian && dosen.pengabdian.length > 0 ? (
                                                        dosen.pengabdian.map((item, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.judul}</td>
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.tahun_pelaksanaan}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Belum ada data pengabdian' : 'No community service available'}</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}

                                        {/* Publikasi */}
                                        {activeTab === 'publikasi' && (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Judul</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-48">Tautan</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-32">Tanggal</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {dosen.publikasi && dosen.publikasi.length > 0 ? (
                                                        dosen.publikasi.map((item, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.judul}</td>
                                                                <td className="px-4 py-3">
                                                                    {item.tautan ? (
                                                                        <a href={item.tautan} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-primary)] hover:underline break-all">{item.tautan}</a>
                                                                    ) : '-'}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.tanggal}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Belum ada data publikasi' : 'No publications available'}</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}

                                        {/* HKI */}
                                        {activeTab === 'hki' && (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Judul</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-32">Tahun</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {dosen.hki && dosen.hki.length > 0 ? (
                                                        dosen.hki.map((item, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.judul}</td>
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.tahun}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Belum ada data HKI' : 'No IPR available'}</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}

                                        {/* Referensi */}
                                        {activeTab === 'referensi' && (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 dark:bg-gray-800">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-12">No</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">{lang === 'id' ? 'Penghargaan/Sertifikasi/Rekognisi' : 'Award/Certification/Recognition'}</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-48">Tautan</th>
                                                        <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 w-32">Tanggal/Tahun</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {dosen.referensi && dosen.referensi.length > 0 ? (
                                                        dosen.referensi.map((item, index) => (
                                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{index + 1}</td>
                                                                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.sertifikat}</td>
                                                                <td className="px-4 py-3">
                                                                    {item.tautan ? (
                                                                        <a href={item.tautan} target="_blank" rel="noopener noreferrer" className="text-[var(--brand-primary)] hover:underline break-all">{item.tautan}</a>
                                                                    ) : '-'}
                                                                </td>
                                                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.tanggal}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">{lang === 'id' ? 'Belum ada data penghargaan/sertifikasi' : 'No awards/certifications available'}</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800">
                                <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                    {lang === 'id' ? 'Informasi' : lang === 'en' ? 'Information' : 'معلومات'}
                                </h3>
                                <dl className="space-y-3 text-sm">
                                    {dosen.nidn && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">NIDN</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{dosen.nidn}</dd>
                                        </div>
                                    )}
                                    {dosen.nuptk && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">NUPTK</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{dosen.nuptk}</dd>
                                        </div>
                                    )}
                                    {dosen.niy && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">NIY</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{dosen.niy}</dd>
                                        </div>
                                    )}
                                    {dosen.jabatan_fungsional && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">
                                                {lang === 'id' ? 'Jabatan Fungsional' : 'Functional Position'}
                                            </dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{dosen.jabatan_fungsional}</dd>
                                        </div>
                                    )}
                                    {dosen.homebase && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">Homebase</dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{dosen.homebase}</dd>
                                        </div>
                                    )}
                                    {studyProgramName && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">
                                                {lang === 'id' ? 'Program Studi' : 'Study Program'}
                                            </dt>
                                            <dd className="text-gray-900 dark:text-gray-100">{studyProgramName}</dd>
                                        </div>
                                    )}
                                    {dosen.email && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">Email</dt>
                                            <dd>
                                                <a href={`mailto:${dosen.email}`} className="text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]">
                                                    {dosen.email}
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {dosen.phone && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">
                                                {lang === 'id' ? 'Telepon' : 'Phone'}
                                            </dt>
                                            <dd>
                                                <a href={`tel:${dosen.phone}`} className="text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]">
                                                    {dosen.phone}
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {dosen.scholar_url && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">Google Scholar</dt>
                                            <dd>
                                                <a
                                                    href={dosen.scholar_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]"
                                                >
                                                    {lang === 'id' ? 'Lihat Profil' : 'View Profile'}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {dosen.sinta_id && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">ID Sinta</dt>
                                            <dd>
                                                <a
                                                    href={`https://sinta.kemdikbud.go.id/authors/profile/${dosen.sinta_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]"
                                                >
                                                    {dosen.sinta_id}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {dosen.orcid_id && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">ORCID</dt>
                                            <dd>
                                                <a
                                                    href={`https://orcid.org/${dosen.orcid_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]"
                                                >
                                                    {dosen.orcid_id}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {dosen.scopus_id && (
                                        <div>
                                            <dt className="font-medium text-gray-600 dark:text-gray-400">Scopus</dt>
                                            <dd>
                                                <a
                                                    href={`https://www.scopus.com/authid/detail.uri?authorId=${dosen.scopus_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline dark:text-[var(--brand-primary)]"
                                                >
                                                    {dosen.scopus_id}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
