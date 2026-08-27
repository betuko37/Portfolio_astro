import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  initCarousels(reduce);
  initProgress();
  if (reduce) return;

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

  gsap.from('[data-hero] [data-hero-item]', {
    y: 28,
    autoAlpha: 0,
    duration: 0.9,
    stagger: 0.08,
    delay: 0.15,
    ease: 'power3.out',
  });

  gsap.from('[data-hero-icon]', {
    y: 36,
    rotate: 6,
    autoAlpha: 0,
    duration: 0.85,
    stagger: 0.07,
    delay: 0.35,
    ease: 'back.out(1.5)',
  });

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
    initMagnetic();
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
      const x = (event.clientX / window.innerWidth - 0.5) * 40;
      const y = (event.clientY / window.innerHeight - 0.5) * 40;
      gsap.to(a, { x, y, duration: 1.6, ease: 'power2.out' });
      gsap.to(b, { x: -x * 0.7, y: -y * 0.7, duration: 2, ease: 'power2.out' });
    },
    { passive: true },
  );
}

function initCarousels(reduce: boolean) {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
    const dots = Array.from(root.querySelectorAll<HTMLElement>('[data-dot]'));
    if (slides.length < 2) return;

    const variant = root.dataset.variant ?? 'desktop';
    const coverflow =
      variant === 'desktop' && window.matchMedia('(min-width: 768px)').matches;
    let index = 0;
    let busy = false;
    let startX = 0;

    const paintDots = (active: number) => {
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === active);
        gsap.to(dot, {
          scale: i === active ? 1.12 : 1,
          opacity: i === active ? 1 : 0.55,
          duration: 0.25,
        });
      });
    };

    const placeCoverflow = (active: number, immediate = false) => {
      slides.forEach((slide, i) => {
        let diff = i - active;
        const half = Math.floor(slides.length / 2);
        if (diff > half) diff -= slides.length;
        if (diff < -half) diff += slides.length;

        const far = Math.abs(diff) > 2;
        const vars = {
          autoAlpha: far ? 0 : diff === 0 ? 1 : 0.42,
          xPercent: diff * 42,
          scale: diff === 0 ? 1 : 0.78,
          rotateY: diff * -18,
          zIndex: 20 - Math.abs(diff),
          duration: immediate ? 0 : 0.7,
          ease: 'power3.out',
        };

        if (immediate) gsap.set(slide, vars);
        else gsap.to(slide, vars);
      });
    };

    if (coverflow) {
      placeCoverflow(0, true);
    } else {
      gsap.set(slides, { autoAlpha: 0, xPercent: 12, scale: 0.96 });
      gsap.set(slides[0], { autoAlpha: 1, xPercent: 0, scale: 1 });
    }

    const go = (next: number) => {
      const target = (next + slides.length) % slides.length;
      if (busy || target === index) return;
      busy = true;

      if (reduce) {
        if (coverflow) placeCoverflow(target, true);
        else {
          gsap.set(slides[index], { autoAlpha: 0 });
          gsap.set(slides[target], { autoAlpha: 1, xPercent: 0, scale: 1 });
        }
        index = target;
        paintDots(index);
        busy = false;
        return;
      }

      if (coverflow) {
        placeCoverflow(target);
        index = target;
        paintDots(index);
        window.setTimeout(() => {
          busy = false;
        }, 420);
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

    root.querySelector('.carousel-next')?.addEventListener('click', () => go(index + 1));
    root.querySelector('.carousel-prev')?.addEventListener('click', () => go(index - 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));

    root.addEventListener('pointerdown', (event) => {
      startX = event.clientX;
    });
    root.addEventListener('pointerup', (event) => {
      const dx = event.clientX - startX;
      if (dx > 48) go(index - 1);
      if (dx < -48) go(index + 1);
    });

    let timer = window.setInterval(() => go(index + 1), 4200);
    const pause = () => window.clearInterval(timer);
    const resume = () => {
      pause();
      timer = window.setInterval(() => go(index + 1), 4200);
    };

    root.addEventListener('pointerenter', pause);
    root.addEventListener('pointerleave', resume);
    root.addEventListener('pointerdown', pause);
    root.addEventListener('pointerup', resume);
  });
}
