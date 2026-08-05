import { motion, useScroll, useSpring } from 'framer-motion';

/** Gold hairline across the top of the viewport showing reading progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-90 h-[2px] origin-left bg-linear-to-r from-gold-400 via-gold to-gold-200 rtl:origin-right"
      style={{ scaleX }}
    />
  );
}
