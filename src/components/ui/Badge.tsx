import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'gold' | 'live';

const tones: Record<Tone, string> = {
  neutral: 'border-line bg-surface-2/60 text-muted',
  gold: 'border-gold/35 bg-gold/10 text-gold',
  live: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** Renders a softly pulsing dot — used for the "available for work" pill. */
  pulse?: boolean;
}

export function Badge({ children, tone = 'neutral', className, pulse = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide',
        'backdrop-blur-sm transition-colors duration-300',
        tones[tone],
        className,
      )}
    >
      {pulse && (
        <span className="relative flex size-2 shrink-0">
          <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-70" />
          <span className="relative size-2 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
