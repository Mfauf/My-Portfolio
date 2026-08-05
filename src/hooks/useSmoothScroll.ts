import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Momentum scrolling for the whole page.
 *
 * Lenis is skipped entirely when the visitor has asked for reduced motion, so
 * they get plain native scrolling. The instance is published on `window` so
 * anchor links can hand off to it (see `scrollToSection`).
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: fast to react, calm to settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      wheelMultiplier: 0.95,
    });

    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}

/** Scrolls to a section id, going through Lenis when it is running. */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  if (window.__lenis) {
    // Lenis reads `scroll-padding-top` off <html> itself (see index.css) and
    // already subtracts it when landing on a target — passing our own
    // `offset` here on top of that double-counts the header clearance and
    // overshoots past it.
    window.__lenis.scrollTo(target, { duration: 1.2 });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
