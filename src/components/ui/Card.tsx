import { useRef, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { useIsTouch } from '@/hooks/useMediaQuery';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds the cursor-following gold spotlight (skipped on touch devices). */
  spotlight?: boolean;
  /** 1px gradient outline. */
  gradientRing?: boolean;
}

/**
 * The site's surface primitive: frosted panel, gold hairline, and an optional
 * spotlight that tracks the pointer across the card.
 */
export function Card({ children, className, spotlight = true, gradientRing = false }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const [pointer, setPointer] = useState({ x: 50, y: 50, active: false });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    if (isTouch || !spotlight) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
      active: true,
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPointer((prev) => ({ ...prev, active: false }))}
      className={cn(
        'glass group relative overflow-hidden rounded-[var(--radius-card)] transition-[border-color,transform,box-shadow] duration-500 ease-[var(--ease-expo)]',
        'hover:border-gold/35',
        gradientRing && 'ring-gradient',
        className,
      )}
    >
      {spotlight && !isTouch && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            opacity: pointer.active ? 1 : 0,
            background: `radial-gradient(420px circle at ${pointer.x}% ${pointer.y}%, color-mix(in oklab, var(--accent) 13%, transparent), transparent 62%)`,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
