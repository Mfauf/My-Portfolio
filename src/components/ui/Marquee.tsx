import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  /** Pause the belt while the pointer is over it. */
  pauseOnHover?: boolean;
  /** Set when the belt is purely decorative. */
  'aria-hidden'?: boolean | 'true' | 'false';
}

/**
 * Infinite horizontal belt.
 *
 * The children are rendered twice and the track slides exactly -50%, which
 * makes the loop seamless without measuring anything. Direction is fixed in
 * CSS (not logical properties) so the belt keeps moving the same way in RTL.
 */
export function Marquee({
  children,
  speed = 38,
  reverse = false,
  className,
  pauseOnHover = true,
  'aria-hidden': ariaHidden,
}: MarqueeProps) {
  return (
    <div
      dir="ltr"
      aria-hidden={ariaHidden}
      className={cn(
        'group relative flex overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            'flex shrink-0 items-center gap-4 pe-4 will-change-transform',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
          style={{
            animation: `marquee-track ${speed}s linear infinite`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        >
          {children}
        </div>
      ))}

      <style>{`
        @keyframes marquee-track {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
