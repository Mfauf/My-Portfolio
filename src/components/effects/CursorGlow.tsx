import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

import { useIsTouch, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * A soft gold halo that trails the cursor across the page.
 *
 * Pure decoration, so it is skipped entirely on touch devices and when the
 * visitor prefers reduced motion.
 */
export function CursorGlow() {
  const disabled = useIsTouch() || usePrefersReducedMotion();

  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const smoothX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const smoothY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (disabled) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [disabled, x, y]);

  if (disabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed -z-5 size-[26rem] rounded-full opacity-60 blur-[90px]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        background:
          'radial-gradient(circle, color-mix(in oklab, var(--accent) 18%, transparent), transparent 66%)',
      }}
    />
  );
}
