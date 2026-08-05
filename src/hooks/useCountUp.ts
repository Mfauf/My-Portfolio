import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

import { usePrefersReducedMotion } from './useMediaQuery';

interface Options {
  duration?: number;
  decimals?: number;
}

/**
 * Counts from zero to `target` the first time the element scrolls into view.
 * Returns a ref to attach and the current value.
 */
export function useCountUp<T extends HTMLElement>(target: number, { duration = 1800, decimals = 0 }: Options = {}) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reducedMotion) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const factor = 10 ** decimals;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // Ease-out cubic keeps the last digits from crawling.
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased * factor) / factor);

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration, decimals, reducedMotion]);

  return { ref, value };
}
