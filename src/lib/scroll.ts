/**
 * Native smooth scrolling.
 *
 * Previously driven by Lenis (a JS reimplementation of momentum scrolling),
 * which produced a noticeably different feel from the browser's own inertia
 * and rubber-banding — enough that it read as "not normal" scrolling.
 * `scroll-behavior: smooth` on <html> (index.css) now drives the animation
 * instead, triggered by plain two-argument `scrollTo(x, y)` calls rather than
 * the `{ behavior: 'smooth' }` options-object form — some environments swallow
 * that form silently (no scroll at all), while the plain call plus the CSS
 * property is the same effect through a more widely-supported path.
 *
 * Header clearance still comes from `scroll-padding-top` on <html>, applied
 * manually here since scrollTo(x, y) doesn't read it the way scrollIntoView
 * would have.
 */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  const scrollPaddingTop = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const targetY = target.getBoundingClientRect().top + window.scrollY - scrollPaddingTop;
  window.scrollTo(0, Math.max(0, targetY));
}

export function scrollToTop(): void {
  window.scrollTo(0, 0);
}
