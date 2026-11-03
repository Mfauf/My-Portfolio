/**
 * Page-wide ambient background.
 *
 * Soft glows are painted with plain radial gradients (no CSS blur filters, no
 * animation, no blend modes) so the fixed layer is rasterised once and never
 * repainted while scrolling — important on phones, where large blurred and
 * animated layers were the main cause of scroll jank.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,var(--glow-2),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_32rem_at_0%_0%,var(--glow-1),transparent_70%),radial-gradient(circle_30rem_at_100%_45%,var(--glow-2),transparent_70%),radial-gradient(circle_28rem_at_30%_100%,var(--glow-1),transparent_70%)]" />

      {/* Blueprint grid, faded out toward the edges (desktop only). */}
      <div className="grid-backdrop absolute inset-0 hidden [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)] lg:block" />
    </div>
  );
}
