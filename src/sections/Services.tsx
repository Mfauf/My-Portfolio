import { motion } from 'framer-motion';

import { addons, profile, services } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { scrollToSection } from '@/lib/scroll';
import { useI18n } from '@/providers/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { cn } from '@/lib/cn';

export function Services() {
  const { t, pick, formatNumber } = useI18n();

  const price = (amount: number) => formatNumber(amount, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <Section id="services">
      <SectionHeading
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      {/* Packages -------------------------------------------------------- */}
      <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.id} from="up" delay={index * 0.09} className="h-full">
            <Card
              gradientRing={service.featured}
              className={cn(
                'flex h-full flex-col p-7 sm:p-8',
                service.featured && 'lg:-mt-4 lg:mb-4 lg:shadow-[0_30px_70px_-45px_var(--accent)]',
              )}
            >
              {service.featured && (
                <Badge tone="gold" className="mb-5 self-start">
                  <Icon name="star" className="size-3" />
                  {t('services.popular')}
                </Badge>
              )}

              <span className="mb-5 grid size-12 place-items-center rounded-2xl bg-gold/12 text-gold">
                <Icon name={service.icon} className="size-6" />
              </span>

              <h3 className="text-xl font-semibold text-ink-strong">{pick(service.title)}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{pick(service.summary)}</p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-2">
                {service.price.from && (
                  <span className="text-xs font-medium tracking-wide text-faint uppercase">
                    {t('services.startingFrom')}
                  </span>
                )}
                <span className="text-4xl font-bold text-gold tabular-nums">
                  {price(service.price.amount)}
                </span>
              </div>

              <p className="mt-2 flex items-center gap-2 text-xs text-faint">
                <Icon name="clock" className="size-3.5" />
                {t('services.delivery')}: {pick(service.duration)}
              </p>

              {/* Features */}
              <p className="mt-7 mb-3 text-xs font-semibold tracking-[0.18em] text-faint uppercase">
                {t('services.includes')}
              </p>
              <ul className="flex flex-col gap-2.5">
                {service.features.map((feature) => (
                  <li key={feature.en} className="flex items-start gap-2.5 text-sm text-muted">
                    <Icon name="check" className="mt-0.5 size-4 shrink-0 text-gold" weight={2.4} />
                    <span className="leading-snug">{pick(feature)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-7">
                {service.example && (
                  <a
                    href={service.example.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-gold transition-opacity hover:opacity-70"
                  >
                    <Icon name="external-link" className="size-3.5" />
                    {t('services.liveExample')}: {service.example.label}
                  </a>
                )}

                <Button
                  variant={service.featured ? 'primary' : 'outline'}
                  className="w-full"
                  onClick={() => scrollToSection('contact')}
                >
                  {t('services.requestCta')}
                </Button>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal from="up" className="mt-6">
        <p className="text-center text-xs leading-relaxed text-faint">{t('services.priceNote')}</p>
      </Reveal>

      {/* Add-ons --------------------------------------------------------- */}
      <div className="mt-20 grid gap-6 lg:grid-cols-2">
        <Reveal from="right">
          <Card className="h-full p-7 sm:p-8">
            <h3 className="text-lg font-semibold text-ink-strong">{t('services.addonsTitle')}</h3>
            <p className="mt-1.5 text-sm text-muted">{t('services.addonsSubtitle')}</p>

            <ul className="mt-6 flex flex-col divide-y divide-line">
              {addons.paid.map((addon) => (
                <li key={addon.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                    <Icon name={addon.icon} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-strong">{pick(addon.title)}</p>
                    <p className="mt-0.5 text-xs leading-snug text-faint">{pick(addon.note)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-gold tabular-nums">
                    +{price(addon.price)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        <Reveal from="left" delay={0.08}>
          <Card className="h-full p-7 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-ink-strong">{t('services.freeTitle')}</h3>
              <Badge tone="gold">{formatNumber(0, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}</Badge>
            </div>
            <p className="mt-1.5 text-sm text-muted">{t('services.freeSubtitle')}</p>

            <ul className="mt-6 grid gap-3">
              {addons.free.map((addon) => (
                <li key={addon.id} className="flex items-start gap-3">
                  <Icon name="check-circle" className="mt-0.5 size-4 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-medium text-ink-strong">{pick(addon.title)}</p>
                    <p className="text-xs leading-snug text-faint">{pick(addon.note)}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Terms */}
            <hr className="my-6 border-line" />
            <h4 className="mb-4 text-xs font-semibold tracking-[0.18em] text-faint uppercase">
              {t('services.termsTitle')}
            </h4>
            <dl className="grid gap-3.5">
              {addons.terms.map((term) => (
                <div key={term.id}>
                  <dt className="text-sm font-medium text-ink-strong">{pick(term.title)}</dt>
                  <dd className="text-xs leading-snug text-muted">{pick(term.body)}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
        className="mt-10 flex justify-center"
      >
        <Button
          as="a"
          href={profile.servicesDeck.url}
          target="_blank"
          rel="noopener noreferrer"
          variant="solid"
          leadingIcon="file-text"
          trailingIcon="arrow-up-right"
        >
          {t('services.deckCta')}
        </Button>
      </motion.div>
    </Section>
  );
}
