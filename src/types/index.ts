// ── API Envelope Types ──────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
}

export interface ApiPaginatedResponse<T> {
    success: true;
    data: T[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface PaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

// ── Institution ─────────────────────────────────────────────────────

export interface Institution {
    id: number;
    name: string;
    subdomain: string;
    logo: string | null;
    logo_url?: string;
    theme_color: string;
    enabled_features: string[];
    is_active: boolean;
}

// ── Slider ──────────────────────────────────────────────────────────

export interface Slider {
    id: number;
    title: string;
    description: string | null;
    image: string;
    image_url?: string;
    link: string | null;
    badge: string | null;
    text_position?: string;
    text_color?: string;
    order: number;
    is_active: boolean;
}

// ── Quick Link ──────────────────────────────────────────────────────

export interface QuickLink {
    id: number;
    title: string;
    description: string | null;
    icon: string | null;
    logo_url?: string | null;
    color: string;
    url: string;
    order: number;
    is_active: boolean;
}

// ── Category ────────────────────────────────────────────────────────

export interface Category {
    id: number;
    name_id: string;
    name_en: string;
    slug: string;
    type?: string;
}

// ── Author ──────────────────────────────────────────────────────────

export interface Author {
    id: number;
    name: string;
}

// ── Tag ─────────────────────────────────────────────────────────────

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

// ── News ────────────────────────────────────────────────────────────

export interface News {
    id: number;
    title_id: string;
    title_en: string;
    title_ar: string;
    slug: string;
    excerpt_id: string;
    excerpt_en: string;
    excerpt_ar: string;
    body_id: string;
    body_en: string;
    body_ar: string;
    image_path: string;
    image_url?: string;
    photo_url?: string;
    published_at: string;
    views: number;
    is_featured: boolean;
    category?: Category;
    author?: Author;
    tags?: Tag[];
    created_at: string;
    updated_at: string;
}

export interface SeoMeta {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    og_image: string;
    og_image_url?: string;
}

// ── Event ───────────────────────────────────────────────────────────

export interface Event {
    id: number;
    title_id: string;
    title_en: string;
    title_ar: string;
    slug: string;
    description_id: string;
    description_en: string;
    description_ar: string;
    image: string;
    image_url?: string;
    date_start: string;
    date_end: string;
    time_start: string;
    location: string;
    registration_url: string;
    status: string;
    created_at: string;
    updated_at: string;
}

// ── Announcement ─────────────────────────────────────────────────────

export interface Announcement {
    id: number;
    slug: string;
    title_id: string;
    title_en: string | null;
    title_ar: string | null;
    content_id: string | null;
    content_en: string | null;
    content_ar: string | null;
    image_path: string | null;
    image_url?: string | null;
    file_path: string | null;
    file_url?: string | null;
    original_file_name: string | null;
    is_active: boolean;
    is_featured: boolean;
    published_at: string;
}

// ── Page ────────────────────────────────────────────────────────────

export interface PageSection {
    id: number;
    type: string;
    data: Record<string, unknown>;
    order: number;
    is_active: boolean;
    dynamic_data?: unknown[] | Record<string, unknown[]>;
}

export interface Page {
    id: number;
    slug: string;
    title_id: string;
    title_en: string;
    title_ar: string;
    content_id: string;
    content_en: string;
    content_ar: string;
    featured_image: string;
    featured_image_url?: string;
    layout_type: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    is_default: boolean;
    route_name: string;
    status: string;
    order: number;
    sections?: PageSection[];
    created_at: string;
    updated_at: string;
}

// ── Career ──────────────────────────────────────────────────────────

export interface Career {
    id: number;
    title_id: string;
    title_en: string;
    title_ar: string;
    description_id: string;
    description_en: string;
    description_ar: string;
    requirements_id: string;
    requirements_en: string;
    requirements_ar: string;
    image: string;
    image_url?: string | null;
    deadline: string;
    registration_url: string;
    status: string;
    published_at: string;
    created_at: string;
    updated_at: string;
}

// ── FAQ ─────────────────────────────────────────────────────────────

export interface Faq {
    id: number;
    question_id: string;
    question_en: string;
    question_ar: string;
    answer_id: string;
    answer_en: string;
    answer_ar: string;
    order: number;
}

// ── Faculty ─────────────────────────────────────────────────────────

export interface Faculty {
    id: number;
    name_id: string;
    name_en: string;
    name_ar: string;
    slug: string;
    description_id: string;
    description_en: string;
    description_ar: string;
    vision_id?: string;
    vision_en?: string;
    vision_ar?: string;
    mission_id?: string;
    mission_en?: string;
    mission_ar?: string;
    dean_name: string;
    image: string;
    order: number;
    is_active: boolean;
    study_programs_count?: number;
    study_programs?: StudyProgram[];
    created_at: string;
    updated_at: string;
}

export interface StudyProgram {
    id: number;
    name_id: string;
    name_en: string;
    name_ar: string;
    slug: string;
    degree_level: string;
    accreditation: string;
    description_id: string;
    description_en: string;
    description_ar: string;
    vision_id: string;
    vision_en: string;
    vision_ar: string;
    mission_id: string;
    mission_en: string;
    mission_ar: string;
    image?: string;
    is_active: boolean;
    dosen_profiles_count?: number;
    dosen_profiles?: DosenProfile[];
    faculty?: Faculty;
}

export interface DosenProfile {
    id: number;
    name: string;
    full_name: string;
    nidn: string | null;
    title_prefix: string | null;
    title_suffix: string | null;
    email: string | null;
    phone: string | null;
    photo: string | null;
    photo_url?: string | null;
    bio_id: string | null;
    bio_en: string | null;
    bio_ar: string | null;
    expertise_id: string | null;
    expertise_en: string | null;
    expertise_ar: string | null;
    publications: unknown;
    scholar_url: string | null;
    sinta_id: string | null;
    orcid_id: string | null;
    scopus_id: string | null;
    is_active: boolean;
    // Additional profile fields
    nuptk: string | null;
    niy: string | null;
    homebase: string | null;
    jabatan_fungsional: string | null;
    mata_kuliah: string[] | null;
    bahan_ajar: { judul: string; nama_jenis: string; nama_penerbit: string; tanggal_terbit: string }[] | null;
    penelitian: { judul: string; tahun_pelaksanaan: string }[] | null;
    pengabdian: { judul: string; tahun_pelaksanaan: string }[] | null;
    publikasi: { judul: string; tautan: string; tanggal: string }[] | null;
    hki: { judul: string; tahun: string }[] | null;
    referensi: { sertifikat: string; tautan: string; tanggal: string }[] | null;
    jabatan?: {
        id: number;
        nama_jabatan: string;
        urutan: number;
        is_active: boolean;
    } | null;
    study_program?: StudyProgram | null;
}

// ── Achievement ─────────────────────────────────────────────────────

export interface Achievement {
    id: number;
    title_id: string;
    title_en: string;
    title_ar: string;
    description_id: string;
    description_en: string;
    description_ar: string;
    student_name: string;
    event_name: string | null;
    ranking: string | null;
    category: string | null;
    year: number;
    image: string | null;
    image_url?: string;
    is_active: boolean;
    created_at: string;
}

// ── Testimonial ─────────────────────────────────────────────────────

export interface Testimonial {
    id: number;
    name: string;
    role: string | null;
    photo: string | null;
    photo_url?: string;
    content: string;
    order: number;
    is_active: boolean;
}

// ── Partner ─────────────────────────────────────────────────────────

export interface Partner {
    id: number;
    name: string;
    logo: string | null;
    logo_url?: string;
    category: string | null;
    website: string | null;
    order: number;
    is_active: boolean;
}

// ── Popup Banner ────────────────────────────────────────────────────

export interface PopupBanner {
    id: number;
    title: string | null;
    content: string | null;
    image: string | null;
    image_url?: string;
    image_mode?: 'portrait' | 'landscape';
    cta_label: string | null;
    cta_url: string | null;
    start_at: string | null;
    end_at: string | null;
    close_mode: 'session' | '1_day' | '7_days' | 'until_updated';
    popup_size?: 'sm' | 'md' | 'lg';
    order: number;
    is_active: boolean;
    updated_at?: string;
}

// ── Menu ────────────────────────────────────────────────────────────

export interface MenuItem {
    id: number;
    label_id: string;
    label_en: string;
    label_ar: string;
    url: string;
    icon: string;
    target: string;
    parent_id: number | null;
    order: number;
    is_active: boolean;
    children: MenuItem[];
    all_children?: MenuItem[];
}

// ── Site Settings ───────────────────────────────────────────────────

export interface SiteSettings {
    site_name?: string;
    site_tagline?: string;
    site_description?: string;
    logo?: string;
    logo_url?: string;
    logo_dark?: string;
    logo_footer?: string;
    logo_footer_url?: string;
    favicon?: string;
    favicon_url?: string;
    address?: string;
    phone?: string;
    email?: string;
    fax?: string;
    google_maps_embed?: string;
    google_analytics_id?: string;
    facebook_url?: string;
    instagram_url?: string;
    youtube_url?: string;
    twitter_url?: string;
    tiktok_url?: string;
    linkedin_url?: string;
    whatsapp_number?: string;
    whatsapp_message?: string;
    pmb_url?: string;
    footer_text?: string;
    copyright_text?: string;
    siakad_url?: string;
    sidosen_url?: string;
    siama_url?: string;
    elearning_url?: string;
    repository_url?: string;
    ejournal_url?: string;
    lms_url?: string;
    portal_url?: string;
    navbar_max_items?: string;
    popup_enabled?: string;
    popup_title_id?: string;
    popup_title_en?: string;
    popup_title_ar?: string;
    popup_content_id?: string;
    popup_content_en?: string;
    popup_content_ar?: string;
    popup_image?: string;
    popup_cta_label_id?: string;
    popup_cta_label_en?: string;
    popup_cta_label_ar?: string;
    popup_cta_url?: string;
    popup_start_at?: string;
    popup_end_at?: string;
    popup_close_mode?: string;
    popup_version?: string;
    theme_primary?: string;
    theme_secondary?: string;
    theme_accent?: string;
    [key: string]: string | undefined;
}

// ── Home Aggregate ──────────────────────────────────────────────────

export interface HomeData {
    institution: Institution;
    sliders: Slider[];
    quick_links: QuickLink[];
    news: News[];
    events: Event[];
    partners: Partner[];
    testimonials: Testimonial[];
    announcements: Announcement[];
    lecturer_columns: News[];
    career_posts: Career[];
    popup_banners?: PopupBanner[];
}

// ── Search ──────────────────────────────────────────────────────────

export interface SearchResultItem {
    id: number;
    slug?: string;
    title: string;
    excerpt: string;
    type: 'news' | 'page' | 'event';
    // News-specific
    image_url?: string | null;
    views?: number;
    published_at?: string;
    category?: { name: string; slug: string } | null;
    // Event-specific
    date_start?: string;
    date_end?: string | null;
    time_start?: string | null;
    location?: string | null;
    status?: string;
}

export interface PaginatedSearchResult {
    data: SearchResultItem[];
    total: number;
    last_page?: number;
}

export interface SearchResults {
    query: string;
    type: string;
    results: {
        news: PaginatedSearchResult;
        pages: PaginatedSearchResult;
        events: PaginatedSearchResult;
    };
}

// ── Achievement Filters ─────────────────────────────────────────────

export interface AchievementFilters {
    years: number[];
    categories: string[];
    applied: {
        year: string;
        category: string;
    };
}

// ── Language Type ───────────────────────────────────────────────────

export type Language = 'id' | 'en' | 'ar';
