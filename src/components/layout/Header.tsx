import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/lib/cn';
import { profile } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { SECTIONS, SECTION_IDS } from '@/lib/sections';
import { scrollToSection } from '@/hooks/useSmoothScroll';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useI18n } from '@/providers/I18nProvider';
import { Icon } from '@/components/ui/Icon';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { t, pick } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection([...SECTION_IDS]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 24));

  const go = (id: string) => {
    setMenuOpen(false);
    // Let the sheet finish closing before the scroll starts.
    window.setTimeout(() => scrollToSection(id), menuOpen ? 260 : 0);
  };

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-200 focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:font-semibold focus:text-on-gold"
      >
        {t('nav.skipToContent')}
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-80 transition-[padding] duration-500 ease-[var(--ease-expo)]',
          scrolled ? 'py-2.5' : 'py-4',
        )}
      >
        <div className="container-page">
          <nav
            className={cn(
              'flex h-[var(--header-height)] items-center justify-between gap-4 rounded-full px-3 sm:px-4',
              'transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-[var(--ease-expo)]',
              scrolled
                ? 'glass border-line-strong shadow-[0_18px_50px_-30px_rgb(var(--shadow-color)/0.9)]'
                : 'border border-transparent bg-transparent',
            )}
            aria-label={t('nav.menu')}
          >
            {/* Brand */}
            <button
              type="button"
              onClick={() => go('home')}
              className="group flex shrink-0 items-center gap-2.5 rounded-full ps-1 pe-3 py-1 transition-colors"
            >
              <img
                src={profile.logo}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-full object-contain transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105"
              />
              <span className="hidden text-sm font-semibold tracking-tight text-ink-strong sm:block">
                {pick(profile.name)}
              </span>
            </button>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-1 lg:flex">
              {SECTIONS.map((section) => {
                const isActive = active === section.id;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => go(section.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300',
                        isActive ? 'text-gold' : 'text-muted hover:text-ink-strong',
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full border border-gold/30 bg-gold/10"
                          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        />
                      )}
                      <span className="relative">{t(section.labelKey)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Controls */}
            <div className="flex shrink-0 items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                className="grid size-10 place-items-center rounded-full border border-line bg-surface-2/70 text-ink backdrop-blur-md transition-colors hover:border-gold/45 hover:text-gold lg:hidden"
              >
                <Icon name={menuOpen ? 'close' : 'menu'} className="size-[1.15rem]" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-70 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 bg-navy-950/70 backdrop-blur-xl"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              className="glass absolute inset-x-3 top-[calc(var(--header-height)+1.5rem)] rounded-[2rem] bg-surface/92 p-3 shadow-2xl"
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
            >
              <ul className="flex flex-col">
                {SECTIONS.map((section, index) => (
                  <motion.li
                    key={section.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04, duration: 0.4, ease: EASE_EXPO }}
                  >
                    <button
                      type="button"
                      onClick={() => go(section.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-start text-base font-medium transition-colors',
                        active === section.id
                          ? 'bg-gold/10 text-gold'
                          : 'text-ink hover:bg-surface-2',
                      )}
                    >
                      {t(section.labelKey)}
                      <Icon
                        name="arrow-up-right"
                        className="size-4 opacity-45 rtl:-scale-x-100"
                      />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
