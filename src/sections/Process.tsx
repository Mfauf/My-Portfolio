import { processSteps } from '@/lib/content';
import { useI18n } from '@/providers/I18nProvider';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';

export function Process() {
  const { t, pick, formatNumber } = useI18n();

  return (
    <Section id="process">
      <SectionHeading
        eyebrow={t('process.eyebrow')}
        title={t('process.title')}
        subtitle={t('process.subtitle')}
      />

      <div className="relative mt-14 lg:mt-20">
        {/* Connector line behind the cards on wide screens. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-[3.25rem] hidden h-px bg-linear-to-r from-transparent via-gold/25 to-transparent lg:block"
        />

        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <Reveal key={step.id} from="up" delay={index * 0.1} as="li">
              <Card className="h-full p-6 text-center sm:text-start">
                <div className="mb-5 flex items-center justify-center gap-3 sm:justify-start">
                  <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl border border-gold/25 bg-surface text-gold">
                    <Icon name={step.icon} className="size-6" />
                    <span className="absolute -end-1.5 -top-1.5 grid size-6 place-items-center rounded-full bg-gold text-[0.65rem] font-bold text-on-gold tabular-nums">
                      {formatNumber(index + 1)}
                    </span>
                  </span>
                </div>

                <h3 className="text-base font-semibold text-ink-strong">{pick(step.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{pick(step.body)}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
