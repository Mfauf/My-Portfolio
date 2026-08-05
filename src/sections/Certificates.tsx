import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/cn';
import { certificates } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { useI18n } from '@/providers/I18nProvider';
import type { Certificate, CertificateCategory } from '@/types/content';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { Section, SectionHeading } from '@/components/ui/Section';

/** Icon per credential type — keeps the grid readable at a glance. */
const CATEGORY_ICONS: Record<CertificateCategory, string> = {
  ai: 'sparkles',
  engineering: 'code',
  academic: 'graduation-cap',
  leadership: 'target',
  volunteer: 'heart',
  quran: 'book',
};

export function Certificates() {
  const { t, pick, formatNumber } = useI18n();
  const [filter, setFilter] = useState<CertificateCategory | 'all'>('all');
  const [selected, setSelected] = useState<Certificate | null>(null);

  // Only offer filters that actually have entries behind them.
  const categories = useMemo(() => {
    const present = new Set(certificates.map((certificate) => certificate.category));
    return (Object.keys(CATEGORY_ICONS) as CertificateCategory[]).filter((key) => present.has(key));
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? certificates : certificates.filter((c) => c.category === filter)),
    [filter],
  );

  return (
    <Section id="certificates">
      <SectionHeading
        eyebrow={t('certificates.eyebrow')}
        title={t('certificates.title')}
        subtitle={t('certificates.subtitle')}
      />

      {/* Filters --------------------------------------------------------- */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {(['all', ...categories] as const).map((key) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={active}
              className={cn(
                'relative rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300',
                active
                  ? 'border-gold/40 text-gold'
                  : 'border-line text-muted hover:border-gold/30 hover:text-ink-strong',
              )}
            >
              {active && (
                <motion.span
                  layoutId="certificate-filter"
                  className="absolute inset-0 rounded-full bg-gold/10"
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative">
                {key === 'all' ? t('certificates.all') : t(`certificates.categories.${key}`)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid ------------------------------------------------------------ */}
      {/* `layout` lives on the items, not the list: animating the container's
          height as well scales its children and visibly squashes the cards
          mid-filter. */}
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((certificate) => (
            <motion.li
              key={certificate.id}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.45, ease: EASE_EXPO }}
            >
              <Card className="h-full">
                <button
                  type="button"
                  onClick={() => setSelected(certificate)}
                  className="flex h-full w-full flex-col p-6 text-start"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-gold/12 text-gold transition-transform duration-500 group-hover:scale-110">
                      <Icon name={CATEGORY_ICONS[certificate.category]} className="size-5" />
                    </span>
                    <span className="text-xs text-faint tabular-nums">
                      {formatNumber(certificate.year, { useGrouping: false })}
                    </span>
                  </div>

                  <h3 className="text-[0.95rem] leading-snug font-semibold text-ink-strong">
                    {pick(certificate.title)}
                  </h3>
                  <p className="mt-1.5 text-xs text-gold">{pick(certificate.issuer)}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {pick(certificate.description)}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs font-medium text-faint transition-colors group-hover:text-gold">
                    {t('certificates.viewCertificate')}
                    <Icon name="arrow-up-right" className="size-3.5 rtl:-scale-x-100" />
                  </span>
                </button>
              </Card>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {/* Detail dialog --------------------------------------------------- */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? pick(selected.title) : ''}
        closeLabel={t('certificates.close')}
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 pe-12">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gold/12 text-gold">
                <Icon name={CATEGORY_ICONS[selected.category]} className="size-6" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg leading-snug font-semibold text-ink-strong">
                  {pick(selected.title)}
                </h3>
                <p className="text-sm text-gold">{pick(selected.issuer)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="gold">{t(`certificates.categories.${selected.category}`)}</Badge>
              <Badge>{formatNumber(selected.year, { useGrouping: false })}</Badge>
            </div>

            <p className="leading-relaxed text-muted">{pick(selected.description)}</p>

            {selected.image ? (
              <img
                src={selected.image}
                alt={pick(selected.title)}
                className="w-full rounded-2xl border border-line"
              />
            ) : (
              <p className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2/60 px-4 py-3 text-xs text-faint">
                <Icon name="file-text" className="size-4 shrink-0" />
                {t('certificates.onRequest')}
              </p>
            )}

            {selected.url && (
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:opacity-70"
              >
                <Icon name="external-link" className="size-4" />
                {t('certificates.viewCertificate')}
              </a>
            )}
          </div>
        )}
      </Modal>
    </Section>
  );
}
