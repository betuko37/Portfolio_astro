'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { cn } from '@/lib/utils';

export type LenticularCarouselItem = {
  image: string;
  label?: string;
  alt?: string;
};

export type LenticularCarouselProps = {
  items: LenticularCarouselItem[];
  initialIndex?: number;
  cardWidth?: number;
  aspectRatio?: string;
  gap?: number;
  borderRadius?: number;
  strips?: number;
  sweep?: number;
  refraction?: number;
  ridge?: number;
  foil?: number;
  foilScale?: number;
  scrim?: number;
  tilt?: number;
  travel?: number;
  lift?: number;
  perspective?: number;
  inactiveScale?: number;
  inactiveDim?: number;
  speed?: number;
  trigger?: 'hover' | 'focus';
  showLabels?: boolean;
  labelColor?: string;
  showControls?: boolean;
  showDots?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  enableDrag?: boolean;
  enableKeyboard?: boolean;
  dpr?: number;
  paused?: boolean;
  className?: string;
  onIndexChange?: (index: number) => void;
  onItemClick?: (index: number, item: LenticularCarouselItem) => void;
};

type LoadedImage = HTMLImageElement | null;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function LenticularCard({
  item,
  width,
  height,
  borderRadius,
  strips,
  sweep,
  refraction,
  ridge,
  foil,
  foilScale,
  scrim,
  tilt,
  travel,
  lift,
  isActive,
  inactiveScale,
  inactiveDim,
  trigger,
  touchTrigger,
  showLabels,
  labelColor,
  dpr,
  paused,
  speed,
  image,
  onClick,
}: {
  item: LenticularCarouselItem;
  width: number;
  height: number;
  borderRadius: number;
  strips: number;
  sweep: number;
  refraction: number;
  ridge: number;
  foil: number;
  foilScale: number;
  scrim: number;
  tilt: number;
  travel: number;
  lift: number;
  isActive: boolean;
  inactiveScale: number;
  inactiveDim: number;
  trigger: 'hover' | 'focus';
  touchTrigger: boolean;
  showLabels: boolean;
  labelColor: string;
  dpr: number;
  paused: boolean;
  speed: number;
  image: LoadedImage;
  onClick?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const hoverRef = useRef(false);
  const timeRef = useRef(0);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    const pxW = Math.round(width * dpr);
    const pxH = Math.round(height * dpr);
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const progress = progressRef.current;
    const stripW = width / strips;

    for (let i = 0; i < strips; i += 1) {
      const u = strips <= 1 ? 0 : i / (strips - 1);
      const lagged = clamp((progress - u * sweep) / Math.max(0.08, 1 - sweep * 0.55), 0, 1);
      const turn = smoothstep(lagged);
      const back = turn > 0.5;
      const local = back ? (turn - 0.5) * 2 : turn * 2;
      const parallax = (turn - 0.5) * refraction * width * 0.35;

      ctx.save();
      ctx.beginPath();
      ctx.rect(i * stripW, 0, stripW + 0.75, height);
      ctx.clip();

      const offsetX = back ? parallax : -parallax;
      ctx.drawImage(image, offsetX, 0, width, height);

      if (back) {
        const gradient = ctx.createLinearGradient(0, height * 0.45, width, height);
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
        gradient.addColorStop(1, `rgba(10, 10, 10, ${scrim})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        if (foil > 0 && !paused) {
          const phase = (u * foilScale + timeRef.current * 0.0012 * speed) % 1;
          ctx.fillStyle = `hsla(${(phase * 360 + local * 40) % 360}, 72%, 68%, ${foil * 0.22})`;
          ctx.fillRect(i * stripW, 0, stripW + 0.75, height);
        }

        if (showLabels && item.label && i > strips * 0.18 && i < strips * 0.82) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(i * stripW, height * 0.68, stripW + 0.75, height * 0.32);
          ctx.clip();
          ctx.fillStyle = labelColor;
          ctx.font = '600 13px Poppins, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(item.label, i * stripW + stripW / 2, height - 14);
          ctx.restore();
        }
      }

      const ridgeShade = Math.sin(turn * Math.PI) * ridge;
      ctx.fillStyle = `rgba(255,255,255,${ridgeShade * 0.08})`;
      ctx.fillRect(i * stripW, 0, stripW + 0.75, height);
      ctx.fillStyle = `rgba(0,0,0,${ridgeShade * 0.12})`;
      ctx.fillRect(i * stripW + stripW * 0.72, 0, stripW * 0.28, height);
      ctx.restore();
    }
  }, [
    dpr,
    foil,
    foilScale,
    height,
    image,
    item.label,
    labelColor,
    paused,
    refraction,
    ridge,
    scrim,
    showLabels,
    speed,
    strips,
    sweep,
    width,
  ]);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      timeRef.current = now;
      const target = targetRef.current;
      const delta = (target - progressRef.current) * (0.18 * speed);
      if (Math.abs(delta) > 0.0005) {
        progressRef.current += delta;
      } else {
        progressRef.current = target;
      }
      paint();
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [paint, speed]);

  useEffect(() => {
    if (touchTrigger) {
      targetRef.current = isActive ? 1 : 0;
      return;
    }
    if (trigger === 'focus') {
      targetRef.current = isActive ? 1 : 0;
    } else if (!hoverRef.current) {
      targetRef.current = isActive ? 0.18 : 0;
    }
  }, [isActive, touchTrigger, trigger]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (touchTrigger || trigger !== 'hover' || !isActive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    targetRef.current = clamp(x / travel, 0, 1);
  };

  const handlePointerEnter = () => {
    hoverRef.current = true;
  };

  const handlePointerLeave = () => {
    hoverRef.current = false;
    targetRef.current = trigger === 'focus' && isActive ? 1 : 0;
  };

  const scale = isActive ? 1 : inactiveScale;
  const dim = isActive ? 1 : inactiveDim;
  const rotateY = isActive ? tilt * (progressRef.current - 0.5) * 0.35 : 0;
  const translateZ = isActive ? lift * progressRef.current : 0;

  return (
    <button
      type="button"
      className="lenticular-card group relative shrink-0 border-0 bg-transparent p-0 outline-none"
      style={{
        width,
        height,
        transform: `translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
        filter: dim < 1 ? `brightness(${dim})` : undefined,
        transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), filter 420ms ease',
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      aria-label={item.alt ?? item.label ?? 'Captura de pantalla'}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full shadow-[0_24px_60px_rgba(10,10,10,0.18)]"
        style={{ borderRadius }}
        aria-hidden="true"
      />
    </button>
  );
}

export default function LenticularCarousel({
  items,
  initialIndex = 2,
  cardWidth = 260,
  aspectRatio = '3 / 4',
  gap = 26,
  borderRadius = 14,
  strips = 56,
  sweep = 0.6,
  refraction = 0.32,
  ridge = 0.5,
  foil = 0.5,
  foilScale = 8,
  scrim = 0.85,
  tilt = 14,
  travel = 0.64,
  lift = 40,
  perspective = 1200,
  inactiveScale = 0.9,
  inactiveDim = 0.55,
  speed = 1,
  trigger = 'hover',
  showLabels = true,
  labelColor = '#ffffff',
  showControls = true,
  showDots = true,
  loop = false,
  autoplay = false,
  autoplayDelay = 3200,
  enableDrag = true,
  enableKeyboard = true,
  dpr = 2,
  paused = false,
  className,
  onIndexChange,
  onItemClick,
}: LenticularCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, moved: false });
  const labelId = useId();
  const touchTrigger = useMediaQuery('(hover: none), (pointer: coarse)');

  const [index, setIndex] = useState(() =>
    clamp(initialIndex, 0, Math.max(0, items.length - 1)),
  );
  const [loaded, setLoaded] = useState<LoadedImage[]>(() => items.map(() => null));

  const [ratioW, ratioH] = useMemo(() => {
    const parts = aspectRatio.split('/').map((part) => Number(part.trim()));
    if (parts.length === 2 && parts.every((part) => Number.isFinite(part) && part > 0)) {
      return parts as [number, number];
    }
    return [3, 4] as [number, number];
  }, [aspectRatio]);

  const cardHeight = Math.round((cardWidth * ratioH) / ratioW);
  const [boundedDpr, setBoundedDpr] = useState(() => clamp(dpr, 1, 2));

  useEffect(() => {
    setBoundedDpr(clamp(Math.min(dpr, window.devicePixelRatio || 1), 1, 3));
  }, [dpr]);

  useEffect(() => {
    let cancelled = false;
    setLoaded(items.map(() => null));
    items.forEach((item, itemIndex) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = item.image;
      img.onload = () => {
        if (!cancelled) {
          setLoaded((prev) => {
            const next = [...prev];
            next[itemIndex] = img;
            return next;
          });
        }
      };
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const go = useCallback(
    (next: number) => {
      if (items.length <= 1) return;
      let target = next;
      if (loop) {
        target = (next + items.length) % items.length;
      } else {
        target = clamp(next, 0, items.length - 1);
      }
      setIndex((current) => {
        if (current === target) return current;
        onIndexChange?.(target);
        return target;
      });
    },
    [items.length, loop, onIndexChange],
  );

  useEffect(() => {
    if (!autoplay || items.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      go(index + 1);
    }, autoplayDelay);
    return () => window.clearInterval(timer);
  }, [autoplay, autoplayDelay, go, index, items.length]);

  useEffect(() => {
    if (!enableKeyboard) return undefined;
    const node = rootRef.current;
    if (!node) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(index - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(index + 1);
      }
    };
    node.addEventListener('keydown', onKeyDown);
    return () => node.removeEventListener('keydown', onKeyDown);
  }, [enableKeyboard, go, index]);

  const offset = useMemo(() => {
    const slot = cardWidth + gap;
    return -(index * slot);
  }, [cardWidth, gap, index]);

  const canPrev = loop || index > 0;
  const canNext = loop || index < items.length - 1;

  if (!items.length) return null;

  return (
    <div
      ref={rootRef}
      className={cn('lenticular-carousel relative mx-auto w-full max-w-6xl outline-none', className)}
      tabIndex={enableKeyboard ? 0 : -1}
      aria-roledescription="carrusel"
      aria-labelledby={labelId}
      style={{ perspective: `${perspective}px` }}
    >
      <p id={labelId} className="sr-only">
        Carrusel de capturas, {index + 1} de {items.length}
      </p>

      <div
        className={cn(
          'relative overflow-hidden px-2 py-3 md:px-6 md:py-5',
          enableDrag && 'cursor-grab active:cursor-grabbing',
        )}
        onPointerDown={(event) => {
          if (!enableDrag || items.length <= 1) return;
          dragRef.current = { active: true, startX: event.clientX, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current.active) return;
          const delta = event.clientX - dragRef.current.startX;
          if (Math.abs(delta) > 48) {
            dragRef.current.moved = true;
            dragRef.current.startX = event.clientX;
            go(index + (delta > 0 ? -1 : 1));
          }
        }}
        onPointerUp={(event) => {
          if (!dragRef.current.active) return;
          dragRef.current.active = false;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={(event) => {
          dragRef.current.active = false;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateX(calc(50% - ${cardWidth / 2}px + ${offset}px))`,
            transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
            gap,
          }}
        >
          {items.map((item, itemIndex) => (
            <LenticularCard
              key={`${item.image}-${itemIndex}`}
              item={item}
              width={cardWidth}
              height={cardHeight}
              borderRadius={borderRadius}
              strips={strips}
              sweep={sweep}
              refraction={refraction}
              ridge={ridge}
              foil={foil}
              foilScale={foilScale}
              scrim={scrim}
              tilt={tilt}
              travel={travel}
              lift={lift}
              isActive={itemIndex === index}
              inactiveScale={inactiveScale}
              inactiveDim={inactiveDim}
              trigger={trigger}
              touchTrigger={touchTrigger}
              showLabels={showLabels}
              labelColor={labelColor}
              dpr={boundedDpr}
              paused={paused}
              speed={speed}
              image={loaded[itemIndex]}
              onClick={() => {
                if (dragRef.current.moved) return;
                if (itemIndex !== index) {
                  go(itemIndex);
                  return;
                }
                onItemClick?.(itemIndex, item);
              }}
            />
          ))}
        </div>
      </div>

      {showControls && items.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            className="btn-accent inline-flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-35"
            aria-label="Captura anterior"
            disabled={!canPrev}
            onClick={() => go(index - 1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <p className="deck-meta min-w-[4.5rem] text-center font-medium tabular-nums">
            {index + 1} / {items.length}
          </p>
          <button
            type="button"
            className="btn-accent inline-flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-35"
            aria-label="Captura siguiente"
            disabled={!canNext}
            onClick={() => go(index + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {showDots && items.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5" role="tablist" aria-label="Capturas">
          {items.map((item, itemIndex) => (
            <button
              key={`dot-${item.image}-${itemIndex}`}
              type="button"
              role="tab"
              aria-selected={itemIndex === index}
              aria-label={`Ir a captura ${itemIndex + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                itemIndex === index
                  ? 'w-8 bg-accent'
                  : 'w-3 bg-[color-mix(in_oklab,var(--color-ink)_18%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-accent)_40%,transparent)]',
              )}
              onClick={() => go(itemIndex)}
            />
          ))}
        </div>
      )}

      <p className="deck-meta mt-3 text-center text-[0.72rem] text-muted">
        {touchTrigger ? 'Toca una tarjeta para voltearla' : 'Pasa el cursor sobre la captura activa para el efecto lenticular'}
        {' · '}
        Clic para ampliar
      </p>
    </div>
  );
}
