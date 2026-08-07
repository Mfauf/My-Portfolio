import { motion } from 'framer-motion';

import { cn } from '@/lib/cn';
import { staggerParent, wordReveal } from '@/lib/motion';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Seconds between each word. */
  stagger?: number;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Reveals a headline word by word as it scrolls in — the same trick the
 * reference sites use for their big statements.
 *
 * Words are wrapped in an overflow-hidden mask so they rise out of nothing
 * rather than sliding over the background. Word order is unchanged, so RTL
 * text lays out correctly on its own.
 */
export function SplitText({
  text,
  className,
  stagger = 0.055,
  delay = 0,
  as: Tag = 'h2',
}: SplitTextProps) {
  const words = text.split(' ');
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      // Remounts the whole heading when the text changes (e.g. a language
      // switch). Without this, React just patches the existing word spans in
      // place — but `viewport={{ once: true }}` had already fired and
      // disconnected its observer, so a heading that had already scrolled
      // into view stayed stuck in whatever state it was last resolved to
      // instead of being re-evaluated for the new words, sometimes leaving it
      // blank until the next scroll.
      key={text}
      className={cn('[perspective:800px]', className)}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span className="inline-block will-change-transform" variants={wordReveal} aria-hidden="true">
            {word}
            {index < words.length - 1 && ' '}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
