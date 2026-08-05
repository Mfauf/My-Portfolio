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
