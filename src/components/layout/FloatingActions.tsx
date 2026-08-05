import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

import { profile } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { useI18n } from '@/providers/I18nProvider';
import { Icon } from '@/components/ui/Icon';

/** WhatsApp shortcut plus a back-to-top button that appears once you scroll. */
export function FloatingActions() {
  const { t } = useI18n();
  const [showTop, setShowTop] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (value) => setShowTop(value > 800));

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed end-4 bottom-4 z-70 flex flex-col items-center gap-3 sm:end-6 sm:bottom-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={toTop}
            aria-label={t('controls.backToTop')}
            title={t('controls.backToTop')}
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 12 }}
            transition={{ duration: 0.35, ease: EASE_EXPO }}
            className="glass grid size-12 place-items-center rounded-full text-gold shadow-lg transition-colors hover:border-gold/45 hover:bg-gold/10"
          >
            <Icon name="arrow-up" className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${profile.contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('contact.whatsappCta')}
        title={t('contact.whatsappCta')}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative grid size-14 place-items-center rounded-full text-white shadow-[0_12px_32px_-12px_rgb(37_211_102/0.8)]"
        style={{ backgroundColor: '#25D366' }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping-ring"
        />
        <Icon name="whatsapp" className="relative size-7" />
      </motion.a>
    </div>
  );
}
