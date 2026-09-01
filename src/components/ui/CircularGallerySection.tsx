'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CircularGallery from '@/components/ui/CircularGallery.jsx';

export type CircularGalleryItem = {
  image: string;
  text: string;
  alt?: string;
};

type Props = {
  items: CircularGalleryItem[];
  phone?: boolean;
  height?: number;
};

function readReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function CircularGallerySection({ items, phone = false, height }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lightboxIndexRef = useRef(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const galleryItems = useMemo(
    () => items.map((item) => ({ image: item.image, text: '' })),
    [items],
  );

  useEffect(() => {
    setReduceMotion(readReducedMotion());
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      setReduceMotion(motionQuery.matches);
    };
    motionQuery.addEventListener('change', onMotionChange);
    return () => motionQuery.removeEventListener('change', onMotionChange);
  }, []);

  const closeLightbox = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    dialog.close();
    document.body.classList.remove('carousel-lightbox-open');
  }, []);

  const showLightboxSlide = useCallback(
    (next: number) => {
      lightboxIndexRef.current = (next + items.length) % items.length;
      const counter = dialogRef.current?.querySelector('[data-lightbox-counter]');
      const hero = dialogRef.current?.querySelector<HTMLImageElement>('[data-lightbox-hero]');
      const active = items[lightboxIndexRef.current];
      if (counter) counter.textContent = `${lightboxIndexRef.current + 1} / ${items.length}`;
      if (hero && active) {
        hero.src = active.image;
        hero.alt = active.alt ?? '';
      }
    },
    [items],
  );

  const openLightbox = useCallback(
    (index: number) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      lightboxIndexRef.current = index;
      showLightboxSlide(index);
      dialog.showModal();
      document.body.classList.add('carousel-lightbox-open');
    },
    [showLightboxSlide],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const onCancel = (event: Event) => {
      event.preventDefault();
      closeLightbox();
    };

    const onDialogClick = (event: MouseEvent) => {
      if (event.target === dialog) closeLightbox();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!dialog.open) return;
      if (event.key === 'ArrowLeft') showLightboxSlide(lightboxIndexRef.current - 1);
      if (event.key === 'ArrowRight') showLightboxSlide(lightboxIndexRef.current + 1);
    };

    dialog.addEventListener('cancel', onCancel);
    dialog.addEventListener('click', onDialogClick);
    dialog.addEventListener('keydown', onKeyDown);

    return () => {
      dialog.removeEventListener('cancel', onCancel);
      dialog.removeEventListener('click', onDialogClick);
      dialog.removeEventListener('keydown', onKeyDown);
    };
  }, [closeLightbox, showLightboxSlide]);

  const galleryHeight = height ?? (phone ? 520 : 560);
  const initial = items[0];

  return (
    <>
      <div style={{ height: `${galleryHeight}px`, position: 'relative' }}>
        <CircularGallery
          items={galleryItems}
          bend={phone ? 2 : 3}
          borderRadius={phone ? 0.06 : 0.05}
          scrollEase={reduceMotion ? 0.12 : 0.015}
          scrollSpeed={reduceMotion ? 1.2 : 1.5}
          autoScrollSpeed={reduceMotion ? 0 : 0.018}
          showLabels={false}
          onItemClick={openLightbox}
        />
      </div>

      <dialog ref={dialogRef} className="carousel-lightbox" aria-label="Captura en pantalla completa">
        <div className="carousel-lightbox-panel">
          <div className="carousel-lightbox-toolbar">
            <p className="carousel-lightbox-meta">
              <span data-lightbox-counter>
                1 / {items.length}
              </span>
            </p>
            <button
              type="button"
              className="carousel-lightbox-close inline-flex h-9 w-9 items-center justify-center rounded-full bg-sand text-ink"
              aria-label="Cerrar"
              onClick={closeLightbox}
            >
              ×
            </button>
          </div>

          <div className="carousel-lightbox-body">
            <figure className="carousel-lightbox-hero">
              <img
                data-lightbox-hero
                src={initial?.image ?? ''}
                alt={initial?.alt ?? ''}
                loading="eager"
              />
            </figure>
          </div>

          {items.length > 1 && (
            <div className="carousel-lightbox-nav mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                className="btn-accent carousel-lightbox-prev inline-flex h-9 w-9 items-center justify-center rounded-full"
                aria-label="Anterior"
                onClick={() => showLightboxSlide(lightboxIndexRef.current - 1)}
              >
                ←
              </button>
              <button
                type="button"
                className="btn-accent carousel-lightbox-next inline-flex h-9 w-9 items-center justify-center rounded-full"
                aria-label="Siguiente"
                onClick={() => showLightboxSlide(lightboxIndexRef.current + 1)}
              >
                →
              </button>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
