import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { volunteerExperience, workExperience } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { useI18n } from '@/providers/I18nProvider';
import type { ExperienceEntry } from '@/types/content';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';

/** One entry on the timeline, with a gold node on the rail. */
function TimelineItem({ entry }: { entry: ExperienceEntry }) {
  const { t, pick } = useI18n();

  return (
    <li className="relative ps-10 sm:ps-14">
      {/* Node */}
      <span className="absolute start-0 top-1.5 grid size-8 place-items-center rounded-full border border-gold/30 bg-surface sm:size-10">
        {entry.current && (
          <span className="absolute inset-0 rounded-full border border-gold/40 animate-ping-ring" aria-hidden="true" />
        )}
        <Icon
          name={entry.type === 'work' ? 'briefcase' : 'heart'}
          className="size-3.5 text-gold sm:size-4"
        />
      </span>

      <Card className="p-6" spotlight={false}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-ink-strong">{pick(entry.role)}</h4>
            <p className="mt-0.5 text-sm text-gold">{pick(entry.organisation)}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span className="text-xs text-faint tabular-nums">
              {entry.start} — {entry.end || t('journey.present')}
            </span>
            {entry.current && <Badge tone="live">{t('journey.current')}</Badge>}
          </div>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-faint">
          <Icon name="map-pin" className="size-3.5" />
          {pick(entry.location)}
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {entry.highlights.map((highlight) => (
            <li key={highlight.en} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
              <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-gold/60" />
              {pick(highlight)}
            </li>
          ))}
        </ul>
      </Card>
    </li>
  );
}

/** A vertical rail whose gold fill tracks scroll progress through the list. */
function Timeline({ title, icon, entries }: { title: string; icon: string; entries: ExperienceEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 55%'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div ref={ref}>
      <Reveal from="up">
        <h3 className="mb-7 flex items-center gap-3 text-lg font-semibold text-ink-strong">
          <span className="grid size-10 place-items-center rounded-xl bg-gold/12 text-gold">
            <Icon name={icon} className="size-5" />
          </span>
          {title}
        </h3>
      </Reveal>

      <div className="relative">
        {/* Rail */}
        <span
          aria-hidden="true"
          className="absolute start-4 top-2 bottom-2 w-px bg-line sm:start-5"
        />
        <motion.span
          aria-hidden="true"
          className="absolute start-4 top-2 bottom-2 w-px origin-top bg-linear-to-b from-gold via-gold-400 to-transparent sm:start-5"
          style={{ scaleY, opacity }}
        />

        <ul className="flex flex-col gap-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.65, delay: index * 0.06, ease: EASE_EXPO }}
            >
              <TimelineItem entry={entry} />
            </motion.div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Journey() {
  const { t } = useI18n();

  return (
    <Section id="journey">
      <SectionHeading
        eyebrow={t('journey.eyebrow')}
        title={t('journey.title')}
        subtitle={t('journey.subtitle')}
      />

      <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-10">
        <Timeline title={t('journey.work')} icon="briefcase" entries={workExperience} />
        <Timeline title={t('journey.volunteer')} icon="heart" entries={volunteerExperience} />
      </div>
    </Section>
  );
}
