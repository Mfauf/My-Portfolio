import type { Transition, Variants } from 'framer-motion';

/**
 * Shared motion language.
 *
 * One easing curve and a small set of variants keep every section feeling
 * like part of the same site rather than a collection of separate effects.
 */

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_QUINT = [0.22, 1, 0.36, 1] as const;

export const springSoft: Transition = { type: 'spring', stiffness: 140, damping: 20, mass: 0.8 };
export const springSnappy: Transition = { type: 'spring', stiffness: 320, damping: 28, mass: 0.6 };

/** Default "appears as you scroll" motion: rise and fade. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_EXPO } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: EASE_EXPO } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE_EXPO } },
};

/** Parent that releases its children one after another. */
export function staggerParent(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/** Per-word variants used by <SplitText>. */
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: '0.6em', rotateX: -55 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.85, ease: EASE_EXPO },
  },
};

/** Viewport config shared by every scroll-triggered block. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
