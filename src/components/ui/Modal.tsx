import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { EASE_EXPO } from '@/lib/motion';
import { Icon } from './Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  closeLabel: string;
  className?: string;
}

/**
 * Accessible dialog: locks the page behind it, closes on Escape or backdrop
 * click, moves focus in on open and traps Tab inside while it is open.
 */
export function Modal({ open, onClose, children, title, closeLabel, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // Stop Lenis (and the page) from scrolling behind the dialog.
    window.__lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      window.__lenis?.start();
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={cn(
              'glass relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-card)]',
              'bg-surface/95 p-6 shadow-2xl outline-none sm:p-8',
              className,
            )}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.42, ease: EASE_EXPO }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute end-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-line bg-surface-2/80 text-muted transition-colors hover:border-gold/40 hover:text-gold"
            >
              <Icon name="close" className="size-5" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
