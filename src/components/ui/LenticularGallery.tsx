'use client';

import { useCallback, useEffect, useState } from 'react';
import LenticularCarousel, {
  type LenticularCarouselItem,
  type LenticularCarouselProps,
} from '@/components/ui/lenticular-carousel';

type Props = Omit<LenticularCarouselProps, 'onItemClick'> & {
  images: LenticularCarouselItem[];
};

export default function LenticularGallery({
  images,
  className,
  initialIndex,
  ...rest
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(initialIndex ?? 0);
  const [scrollY, setScrollY] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setScrollY(window.scrollY);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const showLightboxSlide = useCallback(
    (next: number) => {
      setLightboxIndex((next + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    document.body.classList.add('carousel-lightbox-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.classList.remove('carousel-lightbox-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, [lightboxOpen, scrollY]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showLightboxSlide(lightboxIndex - 1);
      if (event.key === 'ArrowRight') showLightboxSlide(lightboxIndex + 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeLightbox, lightboxIndex, lightboxOpen, showLightboxSlide]);

  const active = images[lightboxIndex];

  return (
    <>
      <LenticularCarousel
        items={images}
        initialIndex={initialIndex}
        className={className}
        onItemClick={(index) => openLightbox(index)}
        {...rest}
      />

      {lightboxOpen && active && (
        <div
          className="carousel-lightbox fixed inset-0 z-[120] flex items-center justify-center bg-[color-mix(in_oklab,var(--color-night)_72%,transparent)] p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Captura en pantalla completa"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
        >
          <div className="carousel-lightbox-panel w-full max-w-[min(96vw,88rem)] rounded-[1.25rem] bg-paper p-4 shadow-2xl md:p-6">
            <div className="carousel-lightbox-toolbar mb-4 flex items-start justify-between gap-3">
              <p className="carousel-lightbox-meta min-w-0 text-sm text-muted">
                <span className="font-medium tabular-nums text-ink">
                  {lightboxIndex + 1} / {images.length}
                </span>
                {active.label ? (
                  <span className="carousel-lightbox-caption mt-1 block text-xs">{active.label}</span>
                ) : null}
              </p>
              <button
                type="button"
                className="carousel-lightbox-close inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-ink"
                aria-label="Cerrar"
                onClick={closeLightbox}
              >
                ×
              </button>
            </div>
            <div className="carousel-lightbox-body flex justify-center">
              <figure className="carousel-lightbox-hero">
                <img
                  src={active.image}
                  alt={active.alt ?? active.label ?? ''}
                  className="block max-h-[82vh] w-auto max-w-full rounded-[1rem] object-contain"
                />
              </figure>
            </div>
            {images.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="btn-accent inline-flex h-9 w-9 items-center justify-center rounded-full"
                  aria-label="Anterior"
                  onClick={() => showLightboxSlide(lightboxIndex - 1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="btn-accent inline-flex h-9 w-9 items-center justify-center rounded-full"
                  aria-label="Siguiente"
                  onClick={() => showLightboxSlide(lightboxIndex + 1)}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
