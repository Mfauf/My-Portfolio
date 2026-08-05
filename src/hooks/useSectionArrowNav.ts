import { useEffect } from 'react';

import { SECTION_IDS } from '@/lib/sections';
import { scrollToSection } from './useSmoothScroll';

/** Elements that legitimately consume arrow keys for their own purposes. */
const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * The section whose top has most recently crossed the reading line.
 *
 * This needs to sit comfortably below wherever `scrollToSection` actually
 * lands a section's top edge — otherwise the section you just arrow-key'd
 * to doesn't register as "current" yet, and the next press just re-targets
 * the same section instead of advancing. A generous mid-viewport line keeps
 * consecutive presses reliably moving one section at a time.
 */
function currentSectionIndex(): number {
  const readingLine = window.innerHeight * 0.5;
  let index = 0;

  for (let i = 0; i < SECTION_IDS.length; i += 1) {
    const element = document.getElementById(SECTION_IDS[i]);
    if (element && element.getBoundingClientRect().top <= readingLine) index = i;
  }

  return index;
}

/**
 * Lets ArrowLeft/ArrowRight jump between top-level sections — a shortcut for
 * visitors who'd rather page through the site than scroll it.
 *
 * Direction follows reading order: in LTR that's Right = next, in RTL (where
 * text flows right-to-left) the keys swap so "forward" still feels forward.
 * Disabled while typing in a form field, and never overrides a browser/OS
 * shortcut chord (Cmd/Ctrl/Alt+Arrow).
 */
export function useSectionArrowNav(isRTL: boolean): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target && (EDITABLE_TAGS.has(target.tagName) || target.isContentEditable)) return;
      if (document.querySelector('[role="dialog"]')) return;

      const goingForward = isRTL ? event.key === 'ArrowLeft' : event.key === 'ArrowRight';
      const index = currentSectionIndex();
      const nextIndex = goingForward
        ? Math.min(index + 1, SECTION_IDS.length - 1)
        : Math.max(index - 1, 0);

      if (nextIndex !== index) {
        event.preventDefault();
        scrollToSection(SECTION_IDS[nextIndex]);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isRTL]);
}
