import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';
import { SplitText } from './SplitText';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Adds the faint blueprint grid behind the section. */
  grid?: boolean;
}

/** Standard vertical rhythm + scroll anchor for every top-level section. */
export function Section({ id, children, className, grid = false }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('relative scroll-mt-24 py-20 sm:py-28 lg:py-36', className)}
    >
      {grid && (
        <div
          aria-hidden="true"
          className="grid-backdrop pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        />
      )}
      <div className="container-page relative">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  className?: string;
}

/** Eyebrow → headline → supporting line, used at the top of each section. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        centered ? 'items-center text-center' : 'items-start text-start',
        className,
      )}
    >
      <Reveal from="none">
        <span className="eyebrow">
          <span aria-hidden="true" className="h-px w-6 bg-gold/60" />
          {eyebrow}
        </span>
      </Reveal>

      <SplitText
        as="h2"
        text={title}
        className={cn(
          'max-w-3xl text-3xl font-bold leading-[1.12] text-ink-strong sm:text-4xl lg:text-5xl',
          centered && 'mx-auto',
        )}
      />

      {subtitle && (
        <Reveal from="up" delay={0.12}>
          <p className={cn('max-w-2xl text-base leading-relaxed text-muted sm:text-lg', centered && 'mx-auto')}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
