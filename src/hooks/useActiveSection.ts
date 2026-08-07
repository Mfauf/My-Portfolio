import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view so the nav can highlight it.
 *
 * The top-margin trick makes a section "active" once it crosses roughly the
 * upper third of the viewport, which matches where the eye lands when reading.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Adjacent sections share a boundary, so right as one ends and the
        // next begins, both can briefly satisfy "isIntersecting" at once —
        // the outgoing section only by the sliver of itself still left in
        // the band. Prefer whichever one started most recently (the largest
        // `top`, i.e. lowest in the document): that's reliably the section
        // the reader has actually scrolled into, not the one they're leaving.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
