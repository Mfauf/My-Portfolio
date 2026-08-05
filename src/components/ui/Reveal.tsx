import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { EASE_EXPO } from '@/lib/motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Where the element travels from. */
  from?: Direction;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
  as?: 'div' | 'span' | 'li' | 'section' | 'article' | 'header' | 'footer';
}

/**
 * Scroll-triggered entrance. Framer Motion already honours
 * `prefers-reduced-motion` for transform/opacity animations, so no extra
 * guard is needed here.
 */
export function Reveal({
  children,
  className,
  from = 'up',
  delay = 0,
  duration = 0.7,
  amount = 0.25,
  as = 'div',
}: RevealProps) {
  const Component = motion[as];
  const offset = offsets[from];

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_EXPO }}
    >
      {children}
    </Component>
  );
}
