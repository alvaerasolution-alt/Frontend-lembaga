import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Slider } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface HeroSliderProps {
    sliders: Slider[];
}

function getPositionClasses(position: string): string {
    switch (position) {
        case 'center':
            return 'items-center justify-center text-center';
        case 'center-left':
            return 'items-center justify-start text-left';
        case 'center-right':
            return 'items-center justify-end text-right';
        case 'bottom-center':
            return 'items-end justify-center text-center';
        case 'bottom-right':
            return 'items-end justify-end text-right';
        case 'bottom-left':
        default:
            return 'items-end justify-start text-left';
    }
}

function getContentPadding(position: string): string {
    switch (position) {
        case 'center':
            return 'px-8 py-8';
        case 'bottom-center':
        case 'bottom-right':
        case 'bottom-left':
        default:
            return 'px-4 pb-24 md:pb-32 lg:pb-36';
    }
}

function getInnerAlignmentClasses(position: string): string {
    switch (position) {
        case 'center':
        case 'bottom-center':
            return 'mx-auto flex flex-col items-center text-center';
        case 'center-right':
        case 'bottom-right':
            return 'ml-auto flex flex-col items-end text-right';
        case 'center-left':
        case 'bottom-left':
        default:
            return 'mr-auto flex flex-col items-start text-left';
    }
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
    const { lang } = useLanguage();
    const [current, setCurrent] = useState(0);

    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % sliders.length);
    }, [sliders.length]);

    const prev = useCallback(() => {
        setCurrent((prev) => (prev - 1 + sliders.length) % sliders.length);
    }, [sliders.length]);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    if (sliders.length === 0) return null;

    const slide = sliders[current];
    const textPosition = slide.text_position ?? 'bottom-left';
    const textColor = slide.text_color ?? '#ffffff';

    return (
        <section className="relative w-full overflow-hidden bg-gray-900 aspect-square sm:aspect-video lg:aspect-[24/10]">
            {/* Slides */}
            {sliders.map((s, index) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                        index === current ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={s.image_url || s.image}
                        alt={s.title}
                        className="h-full w-full object-cover object-top"
                    />
                    {/* Overlay — gradient adapts to position */}
                    {textPosition === 'center' ? (
                        <div className="absolute inset-0 bg-black/30" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    )}
                </div>
            ))}

            {/* Content */}
            <div
                className={`absolute inset-0 flex ${getPositionClasses(textPosition)}`}
            >
                <div
                    className={`mx-auto w-full max-w-7xl ${getContentPadding(textPosition)}`}
                >
                    <div className={`max-w-2xl ${getInnerAlignmentClasses(textPosition)}`} style={{ color: textColor }}>
                        {slide.badge && (
                            <span className="mb-3 inline-block rounded-full bg-orange-600 px-4 py-1 text-sm font-semibold text-white">
                                {slide.badge}
                            </span>
                        )}
                        <h2
                            className="mb-2 w-full text-2xl font-bold drop-shadow-md md:text-4xl lg:text-5xl"
                            style={{ color: textColor }}
                        >
                            {slide.title}
                        </h2>
                        {slide.description && (
                            <p
                                className="w-full text-sm drop-shadow md:text-base"
                                style={{ color: textColor, opacity: 0.9 }}
                            >
                                {slide.description}
                            </p>
                        )}
                        {slide.link && (
                            <a
                                href={slide.link}
                                className="mt-4 inline-block rounded-lg bg-[var(--brand-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-secondary)]"
                            >
                                {lang === 'ar'
                                    ? 'المزيد'
                                    : lang === 'en'
                                      ? 'Read More'
                                      : 'Selengkapnya'}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation arrows */}
            {sliders.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {sliders.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrent(index)}
                                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                                    index === current
                                        ? 'bg-white'
                                        : 'bg-white/40'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
