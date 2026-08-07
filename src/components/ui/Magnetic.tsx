import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { useIsTouch, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** How far the element is allowed to travel toward the cursor, in px. */
  strength?: number;
}

/**
 * Nudges its child toward the cursor while hovered, then springs back.
 * Disabled on touch devices and when reduced motion is requested.
 */
export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const disabled = isTouch || reducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    // Offset from the element's centre, normalised to -1…1, then scaled.
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2 * strength);
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2 * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn('inline-flex', className)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={disabled ? undefined : { x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
