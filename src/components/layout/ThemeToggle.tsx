import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/cn';
import { useI18n } from '@/providers/I18nProvider';
import { useTheme } from '@/providers/ThemeProvider';
import type { ThemeChoice } from '@/lib/preferences';
import { Icon } from '@/components/ui/Icon';

const ORDER: ThemeChoice[] = ['system', 'light', 'dark'];
const ICONS: Record<ThemeChoice, string> = { system: 'monitor', light: 'sun', dark: 'moon' };

/**
 * Cycles system → light → dark. Starting on "system" means the site follows
 * the OS by default, which is what most visitors expect.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { choice, setChoice } = useTheme();
  const { t } = useI18n();

  const next = ORDER[(ORDER.indexOf(choice) + 1) % ORDER.length];
  const labels: Record<ThemeChoice, string> = {
    system: t('controls.themeSystem'),
    light: t('controls.themeLight'),
    dark: t('controls.themeDark'),
  };

  return (
    <button
      type="button"
      onClick={() => setChoice(next)}
      title={`${t('controls.theme')}: ${labels[choice]}`}
      aria-label={`${t('controls.toggleTheme')} — ${labels[choice]}`}
      className={cn(
        'relative grid size-10 place-items-center overflow-hidden rounded-full border border-line',
        'bg-surface-2/70 text-muted backdrop-blur-md transition-colors duration-300',
        'hover:border-gold/45 hover:text-gold',
        className,
      )}
    >
      {/* No `mode="wait"`: that fully unmounts the outgoing icon before the
          incoming one mounts, leaving the button visibly blank for a beat
          mid-transition. Letting them overlap keeps an icon on screen throughout. */}
      <AnimatePresence initial={false}>
        <motion.span
          key={choice}
          initial={{ y: 14, opacity: 0, rotate: -35 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 35 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 grid place-items-center"
        >
          <Icon name={ICONS[choice]} className="size-[1.05rem]" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
