import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@lib/reduced-motion';

gsap.registerPlugin(ScrollTrigger);

function settleMotionTargets() {
  gsap.set('.split-inner', { autoAlpha: 1, y: 0, x: 0, scale: 1, clearProps: 'transform' });
  gsap.set('[data-hero] [data-hero-item], [data-hero-icon]', {
    autoAlpha: 1,
    y: 0,
    x: 0,
    rotate: 0,
    clearProps: 'transform',
  });
  gsap.set('[data-reveal], [data-card], [data-float]', {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    clearProps: 'transform',
  });
  ScrollTrigger.refresh();
}

export function initMotion() {
  document.documentElement.classList.remove('motion-fallback');

  const reduce = prefersReducedMotion();
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  initCarousels(reduce);
  initRails(reduce);
  initCaseBlurbs(reduce);
  initProgress();

  if (canHover) {
    initMagnetic();
  }

  if (reduce) {
    settleMotionTargets();
    return;
  }

  const words = gsap.utils.toArray<HTMLElement>('.split-inner');
  if (words.length) {
    gsap.from(words, {
      yPercent: 115,
      autoAlpha: 0,
      duration: 1.05,
      stagger: 0.045,
      ease: 'power4.out',
      delay: 0.08,
    });
  }

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    });
  });

  const cards = gsap.utils.toArray<HTMLElement>('[data-card]');
  if (cards.length) {
    gsap.from(cards, {
      y: 56,
      autoAlpha: 0,
      scale: 0.96,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards[0].closest('section') ?? cards[0],
        start: 'top 84%',
      },
    });
  }

  gsap.utils.toArray<HTMLElement>('[data-float]').forEach((el, index) => {
    gsap.to(el, {
      y: index % 2 === 0 ? -10 : 10,
      duration: 2.8 + index * 0.18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  if (canHover) {
    const cards = gsap.utils.toArray<HTMLElement>('[data-card]');
    initCardTilt(cards);
    initOrbs();
  }
}

function initProgress() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;

  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.25,
    },
  });
}

function initMagnetic() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.28;

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.35, ease: 'power2.out' });
    });

    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    });
  });
}

function initCardTilt(cards: HTMLElement[]) {
  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateX: y * -6,
        rotateY: x * 7,
        y: -6,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 900,
      });
    });

    card.addEventListener('pointerleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.55, ease: 'power3.out' });
    });
  });
}

function initOrbs() {
  const a = document.querySelector<HTMLElement>('[data-orb="a"]');
  const b = document.querySelector<HTMLElement>('[data-orb="b"]');
  if (!a || !b) return;

  window.addEventListener(
    'pointermove',
    (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 16;
      const y = (event.clientY / window.innerHeight - 0.5) * 16;
      gsap.to(a, { x, y, duration: 1.6, ease: 'power2.out' });
      gsap.to(b, { x: -x * 0.7, y: -y * 0.7, duration: 2, ease: 'power2.out' });
    },
    { passive: true },
  );
}

function placeCoverflowSlides(
  slides: HTMLElement[],
  active: number,
  immediate: boolean,
  spread: number,
) {
  slides.forEach((slide, i) => {
    let diff = i - active;
    const half = Math.floor(slides.length / 2);
    if (diff > half) diff -= slides.length;
    if (diff < -half) diff += slides.length;

    const abs = Math.abs(diff);
    const far = abs > 1;
    const isActive = diff === 0;

    slide.classList.toggle('is-active', isActive);
    slide.classList.toggle('is-adjacent', abs === 1);
    slide.toggleAttribute('data-active', isActive);

    const vars = {
      autoAlpha: far ? 0 : 1,
      left: '50%',
      xPercent: -50 + diff * spread,
      scale: isActive ? 1 : 0.72,
      rotateY: 0,
      z: 0,
      zIndex: isActive ? 30 : Math.max(1, 20 - abs * 6),
      filter: isActive ? 'none' : 'brightness(0.92)',
      transformOrigin: '50% 50%',
      duration: immediate ? 0 : 0.65,
      ease: 'power3.out',
    };

    if (immediate) gsap.set(slide, vars);
    else gsap.to(slide, vars);
  });
}

type CarouselBindOptions = {
  reduce: boolean;
  spread: number;
  dots?: HTMLElement[];
  prevBtns?: Element[];
  nextBtns?: Element[];
  onChange?: (index: number) => void;
  autoplay?: boolean;
};

function bindCoverflowCarousel(
  slides: HTMLElement[],
  options: CarouselBindOptions,
): { go: (next: number, immediate?: boolean) => void; getIndex: () => number } {
  let index = 0;
  let busy = false;

  const paintDots = (active: number) => {
    options.dots?.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === active);
      gsap.to(dot, {
        scale: i === active ? 1.12 : 1,
        opacity: i === active ? 1 : 0.55,
        duration: 0.25,
      });
    });
  };

  const go = (next: number, immediate = false) => {
    if (slides.length <= 1) {
      index = 0;
      placeCoverflowSlides(slides, 0, true, options.spread);
      options.onChange?.(0);
      return;
    }

    const target = (next + slides.length) % slides.length;
    if (!immediate && (busy || target === index)) return;

    if (immediate || options.reduce) {
      placeCoverflowSlides(slides, target, true, options.spread);
      busy = false;
    } else {
      busy = true;
      placeCoverflowSlides(slides, target, false, options.spread);
      window.setTimeout(() => {
        busy = false;
      }, 420);
    }

    index = target;
    paintDots(index);
    options.onChange?.(index);
  };

  placeCoverflowSlides(slides, 0, true, options.spread);
  paintDots(0);

  options.prevBtns?.forEach((btn) => btn.addEventListener('click', () => go(index - 1)));
  options.nextBtns?.forEach((btn) => btn.addEventListener('click', () => go(index + 1)));
  options.dots?.forEach((dot, i) => dot.addEventListener('click', () => go(i, true)));

  return { go, getIndex: () => index };
}

function setActiveSlide(slides: HTMLElement[], active: number) {
  slides.forEach((slide, i) => {
    const isActive = i === active;
    slide.classList.toggle('is-active', isActive);
    slide.toggleAttribute('data-active', isActive);
  });
}

function bindFadeCarousel(
  slides: HTMLElement[],
  options: CarouselBindOptions,
): { go: (next: number, immediate?: boolean) => void; getIndex: () => number } {
  let index = 0;
  let busy = false;

  const paintDots = (active: number) => {
    setActiveSlide(slides, active);
    options.dots?.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === active);
      gsap.to(dot, {
        scale: i === active ? 1.12 : 1,
        opacity: i === active ? 1 : 0.55,
        duration: 0.25,
      });
    });
  };

  const go = (next: number, immediate = false) => {
    if (slides.length <= 1) return;

    const target = (next + slides.length) % slides.length;
    if (busy || target === index) return;
    busy = true;

    if (options.reduce || immediate) {
      gsap.set(slides, { autoAlpha: 0, xPercent: 0, scale: 1 });
      gsap.set(slides[target], { autoAlpha: 1, xPercent: 0, scale: 1 });
      index = target;
      paintDots(index);
      options.onChange?.(index);
      busy = false;
      return;
    }

    const outgoing = slides[index];
    const incoming = slides[target];
    const dir = target > index || (index === slides.length - 1 && target === 0) ? 1 : -1;

    gsap
      .timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          index = target;
          paintDots(index);
          options.onChange?.(index);
          busy = false;
        },
      })
      .to(outgoing, { autoAlpha: 0, xPercent: -16 * dir, scale: 0.94, duration: 0.42 }, 0)
      .fromTo(
        incoming,
        { autoAlpha: 0, xPercent: 16 * dir, scale: 0.94 },
        { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.55, ease: 'power3.out' },
        0.06,
      );
  };

  gsap.set(slides, { autoAlpha: 0, xPercent: 12, scale: 0.96 });
  gsap.set(slides[0], { autoAlpha: 1, xPercent: 0, scale: 1 });
  paintDots(0);

  options.prevBtns?.forEach((btn) => btn.addEventListener('click', () => go(index - 1)));
  options.nextBtns?.forEach((btn) => btn.addEventListener('click', () => go(index + 1)));
  options.dots?.forEach((dot, i) => dot.addEventListener('click', () => go(i, true)));

  return { go, getIndex: () => index };
}

function initCarousels(reduce: boolean) {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
    if (!slides.length) return;

    const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-dot]'));
    const thumbs = root.querySelector<HTMLElement>('[data-carousel-thumbs]');
    const counter = root.querySelector<HTMLElement>('[data-carousel-counter]');
    const variant = root.dataset.variant ?? 'desktop';
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    const useCoverflow = variant === 'desktop' && desktop;
    const dialog = root.querySelector<HTMLDialogElement>('[data-carousel-lightbox]');
    const lightboxHero = dialog?.querySelector<HTMLImageElement>('[data-lightbox-hero]');
    const lightboxCounter = dialog?.querySelector<HTMLElement>('[data-lightbox-counter]');
    const lightboxCaption = dialog?.querySelector<HTMLElement>('[data-lightbox-caption]');
    const total = slides.length;

    let lightboxIndex = 0;

    const syncChrome = (active: number) => {
      if (counter) counter.textContent = `${active + 1} / ${total}`;
      const activeDot = dots[active];
      if (!activeDot || !thumbs) return;

      const overflow = thumbs.scrollWidth > thumbs.clientWidth + 1;
      if (!overflow) return;

      const targetLeft =
        activeDot.offsetLeft - (thumbs.clientWidth - activeDot.clientWidth) / 2;
      const maxLeft = thumbs.scrollWidth - thumbs.clientWidth;
      thumbs.scrollTo({
        left: Math.max(0, Math.min(targetLeft, maxLeft)),
        behavior: reduce ? 'auto' : 'smooth',
      });
    };

    const showLightboxSlide = (index: number) => {
      lightboxIndex = (index + total) % total;
      const img = slides[lightboxIndex]?.querySelector<HTMLImageElement>('img');
      if (lightboxCounter) lightboxCounter.textContent = `${lightboxIndex + 1} / ${total}`;
      if (lightboxCaption) lightboxCaption.textContent = img?.alt ?? '';
      if (lightboxHero && img) {
        lightboxHero.src = img.currentSrc || img.src;
        lightboxHero.alt = img.alt;
      }
    };

    const carouselOptions = {
      reduce,
      spread: useCoverflow ? 100 : 0,
      dots,
      prevBtns: Array.from(root.querySelectorAll('.carousel-prev')),
      nextBtns: Array.from(root.querySelectorAll('.carousel-next')),
      onChange: syncChrome,
    };

    const mainController = useCoverflow
      ? bindCoverflowCarousel(slides, carouselOptions)
      : bindFadeCarousel(slides, carouselOptions);

    syncChrome(0);

    const openLightbox = (index: number) => {
      if (!dialog || !lightboxHero) return;
      showLightboxSlide(index);
      dialog.showModal();
      document.body.classList.add('carousel-lightbox-open');
    };

    if (dialog && lightboxHero) {
      dialog.querySelector('.carousel-lightbox-prev')?.addEventListener('click', () => {
        showLightboxSlide(lightboxIndex - 1);
      });

      dialog.querySelector('.carousel-lightbox-next')?.addEventListener('click', () => {
        showLightboxSlide(lightboxIndex + 1);
      });

      dialog.querySelector('[data-carousel-lightbox-close]')?.addEventListener('click', () => {
        dialog.close();
      });

      dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
      });

      dialog.addEventListener('close', () => {
        document.body.classList.remove('carousel-lightbox-open');
      });

      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showLightboxSlide(lightboxIndex - 1);
        if (event.key === 'ArrowRight') showLightboxSlide(lightboxIndex + 1);
      });
    }

    let startX = 0;
    let startY = 0;
    let tapSlide: HTMLElement | null = null;

    root.addEventListener('pointerdown', (event) => {
      startX = event.clientX;
      startY = event.clientY;
      tapSlide = (event.target as Element).closest<HTMLElement>('[data-slide]');
    });

    root.addEventListener('pointerup', (event) => {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const isSwipe = Math.abs(dx) >= 48 && Math.abs(dx) >= Math.abs(dy);

      if (isSwipe && slides.length > 1) {
        if (dx > 48) mainController.go(mainController.getIndex() - 1);
        if (dx < -48) mainController.go(mainController.getIndex() + 1);
        tapSlide = null;
        return;
      }

      const isTap = Math.abs(dx) < 12 && Math.abs(dy) < 12;
      if (isTap && tapSlide) {
        const slideIndex = Number(tapSlide.dataset.slideIndex ?? mainController.getIndex());
        openLightbox(Number.isFinite(slideIndex) ? slideIndex : mainController.getIndex());
      }

      tapSlide = null;
    });

    if (slides.length < 2) return;

    let timer = window.setInterval(() => {
      mainController.go(mainController.getIndex() + 1);
    }, 4200);

    const pause = () => window.clearInterval(timer);
    const resume = () => {
      pause();
      timer = window.setInterval(() => {
        mainController.go(mainController.getIndex() + 1);
      }, 4200);
    };

    root.addEventListener('pointerenter', pause);
    root.addEventListener('pointerleave', resume);
    root.addEventListener('pointerdown', pause);
    root.addEventListener('pointerup', resume);
  });
}

function initCaseBlurbs(reduce: boolean) {
  document.querySelectorAll<HTMLElement>('[data-case-blurb-deck]').forEach((deck) => {
    const dialog = deck.querySelector<HTMLDialogElement>('[data-case-blurb-modal]');
    const scrim = dialog?.querySelector<HTMLElement>('[data-case-blurb-modal-scrim]');
    const panel = dialog?.querySelector<HTMLElement>('.case-blurb-modal-panel');
    const modalTitle = dialog?.querySelector<HTMLElement>('[data-case-blurb-modal-title]');
    const modalText = dialog?.querySelector<HTMLElement>('[data-case-blurb-modal-text]');
    if (!dialog || !modalTitle || !modalText) return;

    let closing = false;

    const animateOpen = () => {
      if (!panel || !scrim || reduce) return;
      gsap.set(scrim, { opacity: 0 });
      gsap.set(panel, { yPercent: 108, opacity: 0.92 });
      gsap.to(scrim, { opacity: 1, duration: 0.34, ease: 'power2.out' });
      gsap.to(panel, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.03 });
    };

    const closeModal = () => {
      if (!dialog.open || closing) return;
      closing = true;

      const finish = () => {
        dialog.close();
        document.body.classList.remove('case-blurb-modal-open');
        if (panel) gsap.set(panel, { clearProps: 'transform,opacity' });
        if (scrim) gsap.set(scrim, { clearProps: 'opacity' });
        closing = false;
      };

      if (reduce || !panel || !scrim) {
        finish();
        return;
      }

      gsap.to(scrim, { opacity: 0, duration: 0.24, ease: 'power2.in' });
      gsap.to(panel, {
        yPercent: 108,
        opacity: 0,
        duration: 0.32,
        ease: 'power3.in',
        onComplete: finish,
      });
    };

    const openModal = (card: HTMLElement) => {
      modalTitle.textContent = card.querySelector('h3')?.textContent?.trim() ?? '';
      modalText.textContent = card.querySelector('[data-case-blurb-text]')?.textContent?.trim() ?? '';
      dialog.showModal();
      document.body.classList.add('case-blurb-modal-open');
      animateOpen();
    };

    deck.querySelectorAll<HTMLButtonElement>('[data-case-blurb-open]').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest<HTMLElement>('[data-case-blurb]');
        if (card) openModal(card);
      });
    });

    dialog.querySelector('[data-case-blurb-modal-close]')?.addEventListener('click', closeModal);
    scrim?.addEventListener('click', closeModal);

    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeModal();
    });

    dialog.addEventListener('close', () => {
      document.body.classList.remove('case-blurb-modal-open');
      closing = false;
    });
  });
}

function initRails(reduce: boolean) {
  document.querySelectorAll<HTMLElement>('[data-rail]').forEach((root) => {
    const scroller = root.querySelector<HTMLElement>('.rail');
    if (!scroller) return;

    const step = () => {
      const item = scroller.querySelector<HTMLElement>('.rail-item');
      return (item?.offsetWidth ?? 280) + 12;
    };

    const scrollStep = (delta: number) => {
      scroller.scrollBy({ left: delta, behavior: reduce ? 'auto' : 'smooth' });
    };

    root.querySelectorAll('.rail-next').forEach((button) => {
      button.addEventListener('click', () => scrollStep(step()));
    });
    root.querySelectorAll('.rail-prev').forEach((button) => {
      button.addEventListener('click', () => scrollStep(-step()));
    });
  });
}
