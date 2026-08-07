import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/cn';
import { useI18n } from '@/providers/I18nProvider';

/** Flips between English and Arabic, which also flips the whole layout. */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, toggleLocale, t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      title={t('controls.toggleLanguage')}
      aria-label={t('controls.toggleLanguage')}
      className={cn(
        'relative grid size-10 place-items-center overflow-hidden rounded-full border border-line',
        'bg-surface-2/70 text-gold backdrop-blur-md transition-colors duration-300',
        'hover:border-gold/45 hover:bg-gold/10',
        className,
      )}
    >
      {/* No `mode="wait"`: that fully unmounts the outgoing label before the
          incoming one mounts, leaving the button visibly blank for a beat
          mid-transition. Letting them overlap keeps a label on screen throughout. */}
      <AnimatePresence initial={false}>
        <motion.span
          key={locale}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'absolute inset-0 flex items-center justify-center text-sm font-bold',
            locale === 'en' ? 'font-arabic text-base' : 'tracking-tight',
          )}
        >
          {t('meta.switchTo')}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
