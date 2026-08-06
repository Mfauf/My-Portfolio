import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/cn';
import { certificates } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { useI18n } from '@/providers/I18nProvider';
import type { CertificateCategory } from '@/types/content';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';
import { Section, SectionHeading } from '@/components/ui/Section';

/** Icon per credential type — shown in the detail panel. */
const CATEGORY_ICONS: Record<CertificateCategory, string> = {
  ai: 'sparkles',
  engineering: 'code',
  academic: 'graduation-cap',
  leadership: 'target',
  volunteer: 'heart',
  quran: 'book',
};

/** How far a neighbouring card sits from the centre, in px, per breakpoint. */
function useCardGeometry() {
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isSm = useMediaQuery('(min-width: 640px)');
  const width = isLg ? 260 : isSm ? 220 : 168;
  return { width, spacing: width * 0.64 };
}

export function Certificates() {
  const { t, pick, formatNumber, isRTL } = useI18n();
  const reducedMotion = usePrefersReducedMotion();
  const { width: cardWidth, spacing } = useCardGeometry();

  // A picture gallery only makes sense for certificates that actually have a
  // scan — entries still waiting on one (image: null) sit out until they do.
  const gallery = useMemo(() => certificates.filter((certificate) => certificate.image), []);

  const [centerIndex, setCenterIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex !== null ? gallery[selectedIndex] : null;

  if (gallery.length === 0) return null;

  const dirMul = isRTL ? -1 : 1;

  function selectCard(index: number) {
    setCenterIndex(index);
    setSelectedIndex(index);
  }

  function step(delta: number) {
    const nextIndex = (centerIndex + delta + gallery.length) % gallery.length;
    setCenterIndex(nextIndex);
    setSelectedIndex((current) => (current !== null ? nextIndex : current));
  }

  return (
    <Section id="certificates">
      <SectionHeading
        eyebrow={t('certificates.eyebrow')}
        title={t('certificates.title')}
        subtitle={t('certificates.subtitle')}
      />

      <div className="relative mt-14 lg:mt-20">
        {/* Gallery ----------------------------------------------------- */}
        <div
          className="relative mx-auto h-[220px] sm:h-[280px] lg:h-[340px] max-w-full"
          style={{ perspective: reducedMotion ? undefined : 1600 }}
        >
          {gallery.map((certificate, index) => {
            const offset = (index - centerIndex) * dirMul;
            const abs = Math.abs(offset);
            const isActive = index === centerIndex;
            const hidden = abs > 4;

            const transform = reducedMotion
              ? `translate(-50%, -50%) translateX(${offset * spacing}px)`
              : `translate(-50%, -50%) translateX(${offset * spacing}px) translateZ(${-abs * 70}px) rotateY(${offset * -30}deg) scale(${Math.max(0.62, 1 - abs * 0.15)})`;

            return (
              <button
                key={certificate.id}
                type="button"
                onClick={() => selectCard(index)}
                aria-label={pick(certificate.title)}
                aria-current={isActive ? 'true' : undefined}
                className="absolute top-1/2 left-1/2 overflow-hidden rounded-2xl shadow-2xl outline-none [transform-style:preserve-3d]"
                style={{
                  width: cardWidth,
                  transform,
                  zIndex: 50 - abs,
                  opacity: hidden ? 0 : 1,
                  pointerEvents: hidden ? 'none' : 'auto',
                  transitionProperty: 'transform, opacity',
                  transitionDuration: reducedMotion ? '0.15s' : '0.6s',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img
                  src={certificate.image ?? undefined}
                  alt={pick(certificate.title)}
                  loading="lazy"
                  className="aspect-[22/17] w-full object-cover"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-0 rounded-2xl ring-2 transition-opacity duration-300',
                    isActive ? 'ring-gold opacity-100' : 'ring-transparent opacity-0',
                  )}
                />
              </button>
            );
          })}

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t('certificates.previous')}
                className="glass absolute start-0 top-1/2 z-60 -translate-y-1/2 grid size-10 place-items-center rounded-full text-ink transition-colors hover:border-gold/45 hover:text-gold sm:size-12"
              >
                <Icon name="arrow-right" className="size-4 rotate-180 rtl:-scale-x-100 sm:size-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t('certificates.next')}
                className="glass absolute end-0 top-1/2 z-60 -translate-y-1/2 grid size-10 place-items-center rounded-full text-ink transition-colors hover:border-gold/45 hover:text-gold sm:size-12"
              >
                <Icon name="arrow-right" className="size-4 rtl:-scale-x-100 sm:size-5" />
              </button>
            </>
          )}
        </div>

        {/* Detail panel -------------------------------------------------- */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 16, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.4, ease: EASE_EXPO }}
              className="mx-auto mt-8 max-w-xl overflow-hidden"
            >
              <div className="glass relative rounded-[var(--radius-card)] p-6 sm:p-8">
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  aria-label={t('certificates.close')}
                  className="absolute end-4 top-4 grid size-9 place-items-center rounded-full border border-line bg-surface-2/70 text-muted transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <Icon name="close" className="size-4" />
                </button>

                <div className="flex items-start gap-4 pe-12">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold">
                    <Icon name={CATEGORY_ICONS[selected.category]} className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg leading-snug font-semibold text-ink-strong">
                      {pick(selected.title)}
                    </h3>
                    <p className="text-sm text-gold">{pick(selected.issuer)}</p>
                  </div>
                </div>

                <p className="mt-4 leading-relaxed text-muted">{pick(selected.description)}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge tone="gold">{t(`certificates.categories.${selected.category}`)}</Badge>
                  <Badge>{formatNumber(selected.year, { useGrouping: false })}</Badge>
                  {selected.url && (
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ms-auto inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:opacity-70"
                    >
                      <Icon name="external-link" className="size-4" />
                      {t('certificates.viewCertificate')}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
