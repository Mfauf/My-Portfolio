import { useEffect, useRef } from 'react';

import { cn } from '@/lib/cn';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { useTheme } from '@/providers/ThemeProvider';

interface Particle {
  /** Resting position — where the letterform actually is. */
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  colour: string;
  /** Phase offset so particles don't twinkle in lockstep. */
  phase: number;
  twinkleSpeed: number;
  /** A small subset are drawn as glinting stars instead of dots. */
  sparkle: boolean;
}

interface NameParticlesProps {
  /** The word to spell out. */
  text: string;
  /** Font stack used to render the sampled letterforms. */
  fontFamily?: string;
  /** Accessible description of the canvas. */
  label: string;
  className?: string;
}

/**
 * Gold ramps the particles are tinted from.
 *
 * The panel this used to sit in was always dark, so one ramp worked for both
 * themes. Now that the canvas sits directly on the page, the pale end of that
 * ramp would all but disappear against the light theme's ivory background —
 * so light mode gets a deeper, more saturated set instead.
 */
const GOLD_RAMP_DARK = ['#f6e8c4', '#efd89d', '#e6c572', '#d9ae4a', '#c99a32', '#a87c25'];
const GOLD_RAMP_LIGHT = ['#a87c25', '#8f6a1e', '#c99a32', '#7a5817', '#d9ae4a', '#8f6a1e'];

const POINTER_RADIUS = 120;
const POINTER_STRENGTH = 0.55;
const SPRING = 0.045;
const FRICTION = 0.86;
const MAX_PARTICLES = 7000;

/**
 * Renders a name as a field of gold particles that scatter away from the
 * pointer and spring back into the letterforms — the footer's signature moment.
 *
 * The word is rasterised once into an offscreen canvas, then sampled on a grid;
 * every opaque pixel becomes a particle with a home position. From there it's
 * a simple spring simulation, which is cheap enough to run at 60fps on a phone.
 */
export function NameParticles({
  text,
  fontFamily = "'Sora', system-ui, sans-serif",
  label,
  className,
}: NameParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const goldRamp = theme === 'light' ? GOLD_RAMP_LIGHT : GOLD_RAMP_DARK;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let disposed = false;
    /** The loop only runs while the canvas is actually on screen. */
    let running = false;

    // Pointer lives in CSS pixels; parked far away until the cursor arrives.
    const pointer = { x: -9999, y: -9999, active: false };
    let burst = 0;

    /** Rasterise the word, then turn its opaque pixels into particles. */
    function build() {
      const rect = container!.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // --- Offscreen pass: draw the text as large as it will fit -----------
      const sampler = document.createElement('canvas');
      sampler.width = width;
      sampler.height = height;
      const samplerContext = sampler.getContext('2d', { willReadFrequently: true });
      if (!samplerContext) return;

      // Binary-ish fit: start from the height budget, shrink until it fits wide.
      let fontSize = Math.floor(height * 0.62);
      samplerContext.textAlign = 'center';
      samplerContext.textBaseline = 'middle';

      for (let attempt = 0; attempt < 40; attempt += 1) {
        samplerContext.font = `800 ${fontSize}px ${fontFamily}`;
        const measured = samplerContext.measureText(text).width;
        if (measured <= width * 0.88 || fontSize <= 12) break;
        fontSize = Math.floor(fontSize * 0.94);
      }

      samplerContext.clearRect(0, 0, width, height);
      samplerContext.fillStyle = '#fff';
      samplerContext.fillText(text, width / 2, height / 2);

      const { data } = samplerContext.getImageData(0, 0, width, height);

      // --- Sample on a grid ------------------------------------------------
      // Coarser steps on small canvases keep the particle count sane.
      let step = width < 420 ? 3 : width < 760 ? 4 : 4;
      let sampled: Particle[] = [];

      const collect = (gridStep: number) => {
        const out: Particle[] = [];
        for (let y = 0; y < height; y += gridStep) {
          for (let x = 0; x < width; x += gridStep) {
            // Alpha channel of this pixel — anything solid becomes a particle.
            if (data[(y * width + x) * 4 + 3] > 140) {
              const depth = Math.random();
              out.push({
                homeX: x,
                homeY: y,
                // Start scattered so the word assembles itself on first paint.
                x: x + (Math.random() - 0.5) * width * 0.8,
                y: y + (Math.random() - 0.5) * height * 1.6,
                vx: 0,
                vy: 0,
                size: 0.9 + depth * 1.5,
                colour: goldRamp[Math.floor(Math.random() * goldRamp.length)],
                phase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.7 + Math.random() * 2.2,
                sparkle: Math.random() < 0.018,
              });
            }
          }
        }
        return out;
      };

      sampled = collect(step);
      // Guard against pathological densities on very wide screens.
      while (sampled.length > MAX_PARTICLES && step < 10) {
        step += 1;
        sampled = collect(step);
      }

      particles = sampled;
    }

    function draw(time: number) {
      if (disposed) return;

      context!.clearRect(0, 0, width, height);
      const seconds = time / 1000;

      for (const particle of particles) {
        if (!reducedMotion) {
          // --- Pointer repulsion -------------------------------------------
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distanceSq = dx * dx + dy * dy;

          if (pointer.active && distanceSq < POINTER_RADIUS * POINTER_RADIUS) {
            const distance = Math.sqrt(distanceSq) || 0.001;
            const force = ((POINTER_RADIUS - distance) / POINTER_RADIUS) * POINTER_STRENGTH;
            particle.vx += (dx / distance) * force * 14;
            particle.vy += (dy / distance) * force * 14;
          }

          // --- Click burst ---------------------------------------------------
          if (burst > 0.01) {
            const bx = particle.x - width / 2;
            const by = particle.y - height / 2;
            const bd = Math.hypot(bx, by) || 0.001;
            particle.vx += (bx / bd) * burst * 2.2;
            particle.vy += (by / bd) * burst * 2.2;
          }

          // --- Spring home + damping ----------------------------------------
          particle.vx += (particle.homeX - particle.x) * SPRING;
          particle.vy += (particle.homeY - particle.y) * SPRING;
          particle.vx *= FRICTION;
          particle.vy *= FRICTION;
          particle.x += particle.vx;
          particle.y += particle.vy;
        } else {
          particle.x = particle.homeX;
          particle.y = particle.homeY;
        }

        // --- Paint -----------------------------------------------------------
        const twinkle = reducedMotion
          ? 0.85
          : 0.55 + 0.45 * Math.sin(seconds * particle.twinkleSpeed + particle.phase);

        context!.globalAlpha = Math.max(0.12, twinkle);
        context!.fillStyle = particle.colour;

        if (particle.sparkle) {
          // Four-point glint: a bright core with a soft cross.
          const reach = particle.size * (2.6 + twinkle * 2.4);
          context!.globalAlpha = Math.max(0.2, twinkle) * 0.9;
          context!.fillRect(particle.x - reach, particle.y - 0.4, reach * 2, 0.8);
          context!.fillRect(particle.x - 0.4, particle.y - reach, 0.8, reach * 2);
          context!.globalAlpha = 1;
          context!.beginPath();
          context!.arc(particle.x, particle.y, particle.size * 0.9, 0, Math.PI * 2);
          context!.fill();
        } else {
          context!.fillRect(particle.x, particle.y, particle.size, particle.size);
        }
      }

      context!.globalAlpha = 1;
      burst *= 0.9;

      if (running) frame = requestAnimationFrame(draw);
    }

    // --- Pointer wiring -----------------------------------------------------
    const toLocal = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerMove = (event: PointerEvent) => toLocal(event);
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onPointerDown = (event: PointerEvent) => {
      toLocal(event);
      burst = 6;
    };

    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('pointercancel', onPointerLeave, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      build();
      // Repaint immediately so a resize never leaves an empty canvas behind,
      // even if the loop is currently parked.
      if (!running) draw(performance.now());
    });
    resizeObserver.observe(container);

    /** Starts/stops the simulation as the footer enters and leaves the screen. */
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (disposed) return;

        if (entry.isIntersecting && !running) {
          running = true;
          frame = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: '200px' },
    );
    visibilityObserver.observe(container);

    // Wait for the webfont so the sampled shapes are the real letterforms and
    // not a fallback that reflows a moment later.
    let started = false;
    let fallbackTimer = 0;
    const start = () => {
      if (started || disposed) return;
      started = true;
      build();
      // One synchronous frame so the word exists even before rAF ticks
      // (background tabs and throttled renderers never fire it).
      draw(performance.now());
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(start).catch(start);
      // Don't wait forever if font loading stalls.
      fallbackTimer = window.setTimeout(start, 1200);
    } else {
      start();
    }

    return () => {
      disposed = true;
      running = false;
      window.clearTimeout(fallbackTimer);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointercancel', onPointerLeave);
    };
  }, [text, fontFamily, reducedMotion, theme]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={label}
      className={cn('relative isolate aspect-[1054/420] w-full', className)}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 touch-none" />
    </div>
  );
}
