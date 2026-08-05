import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { useIsTouch, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum rotation on each axis, in degrees. */
  max?: number;
}

/** Subtle 3D tilt toward the cursor. Flat on touch and with reduced motion. */
export function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const disabled = useIsTouch() || usePrefersReducedMotion();

  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 18 });
  const transform = useMotionTemplate`perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX.set(-py * max * 2);
    rotateY.set(px * max * 2);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={disabled ? undefined : { transform, transformStyle: 'preserve-3d' }}
      className={cn('will-change-transform', className)}
    >
      {children}
    </motion.div>
  );
}
