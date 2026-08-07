/**
 * Page-wide ambient background.
 *
 * Three slow-drifting blurred orbs over a faint blueprint grid and a noise
 * layer. Everything is fixed and `pointer-events-none`, so it never interferes
 * with scrolling or hit-testing, and it repaints on theme change because all
 * colours come from CSS variables.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-bg transition-colors duration-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,var(--glow-2),transparent_70%)]" />

      {/* Drifting gold and navy orbs */}
      <div
        className="absolute -start-40 -top-40 size-[38rem] rounded-full blur-[110px] animate-drift"
        style={{ background: 'var(--glow-1)' }}
      />
      <div
        className="absolute -end-52 top-[38%] size-[34rem] rounded-full blur-[120px] animate-float-slower"
        style={{ background: 'var(--glow-2)' }}
      />
      <div
        className="absolute bottom-[-14rem] start-[28%] size-[30rem] rounded-full blur-[130px] animate-float-slow"
        style={{ background: 'var(--glow-1)' }}
      />

      {/* Blueprint grid, faded out toward the edges */}
      <div className="grid-backdrop absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]" />

      {/* Fine grain so the large flat areas don't band on wide gamut screens */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 'var(--noise-opacity)',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
