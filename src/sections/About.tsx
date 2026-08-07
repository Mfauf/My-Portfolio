import { motion } from 'framer-motion';

import { education, profile } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { useCountUp } from '@/hooks/useCountUp';
import { useI18n } from '@/providers/I18nProvider';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';

/** One animated number in the stats strip. */
function Stat({ stat }: { stat: (typeof profile.stats)[number] }) {
  const { pick, formatNumber } = useI18n();
  const decimals = stat.decimals ?? 0;
  const { ref, value } = useCountUp<HTMLDivElement>(stat.value, { decimals });

  return (
    <div ref={ref} className="flex flex-col gap-1 px-2 py-4 text-center sm:px-4">
      <span className="text-3xl font-bold text-gold tabular-nums sm:text-4xl">
        {formatNumber(value, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {stat.suffix}
      </span>
      <span className="text-xs leading-snug text-muted sm:text-sm">{pick(stat.label)}</span>
    </div>
  );
}

/** Language proficiency bar. */
function LanguageBar({ item }: { item: (typeof profile.languages)[number] }) {
  const { pick } = useI18n();

  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink-strong">{pick(item.name)}</span>
        <span className="text-xs text-faint">{pick(item.level)}</span>
      </div>
      {/* whileInView lives on this always-full-width track, not the bar
          itself: a scaleX:0 element collapses to zero width, so an
          IntersectionObserver watching it directly never sees enough of it
          to fire and the fill would never animate in. */}
      <motion.div
        className="h-1.5 w-full overflow-hidden rounded-full bg-line"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
      >
        <motion.div
          className="h-full origin-left rounded-full bg-linear-to-r from-gold-600 to-gold-300 rtl:origin-right"
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: item.value / 100 } }}
          transition={{ duration: 1.1, ease: EASE_EXPO }}
        />
      </motion.div>
    </li>
  );
}

export function About() {
  const { t, tList, pick } = useI18n();
  const focus = tList('about.focus');

  return (
    <Section id="about" grid>
      <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.title')} />

      <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12">
        {/* Bio ---------------------------------------------------------- */}
        <Reveal from="up" className="lg:col-span-7">
          <Card className="h-full p-7 sm:p-9" gradientRing>
            <Icon name="quote" className="mb-5 size-8 text-gold/40" />

            <p className="text-base leading-relaxed text-ink sm:text-lg">{pick(profile.bio)}</p>
            <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
              {pick(profile.bioSecondary)}
            </p>

            <hr className="my-7 border-line" />

            <h3 className="mb-4 text-sm font-semibold tracking-wide text-ink-strong">
              {t('about.focusTitle')}
            </h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {focus.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-muted">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-gold" weight={2.4} />
                  <span className="leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>

        {/* Side column -------------------------------------------------- */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Education */}
          <Reveal from="up" delay={0.1}>
            <Card className="p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gold/12 text-gold">
                  <Icon name="graduation-cap" className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-ink-strong">{t('journey.education')}</h3>
              </div>

              <ul className="flex flex-col gap-5">
                {education.map((entry) => (
                  <li key={entry.id} className="border-s-2 border-gold/25 ps-4">
                    <p className="text-sm font-semibold text-ink-strong">{pick(entry.degree)}</p>
                    <p className="mt-0.5 text-xs text-muted">{pick(entry.institution)}</p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-faint">
                      <span>
                        {entry.start} — {entry.end || t('journey.present')}
                      </span>
                      <span aria-hidden="true">•</span>
                      <span className="font-medium text-gold">
                        {pick(entry.score.label)} {entry.score.value}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          {/* Languages */}
          <Reveal from="up" delay={0.16}>
            <Card className="p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gold/12 text-gold">
                  <Icon name="languages" className="size-5" />
                </span>
                <h3 className="text-base font-semibold text-ink-strong">{t('about.languagesTitle')}</h3>
              </div>

              <ul className="flex flex-col gap-4">
                {profile.languages.map((language) => (
                  <LanguageBar key={language.name.en} item={language} />
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </div>

      {/* Stats strip ---------------------------------------------------- */}
      <Reveal from="up" delay={0.1} className="mt-6">
        <Card className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x rtl:sm:divide-x-reverse">
          {profile.stats.map((stat) => (
            <Stat key={stat.label.en} stat={stat} />
          ))}
        </Card>
      </Reveal>
    </Section>
  );
}
