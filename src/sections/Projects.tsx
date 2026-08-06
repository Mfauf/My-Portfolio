import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { cn } from '@/lib/cn';
import { projects } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { useI18n } from '@/providers/I18nProvider';
import type { Project } from '@/types/content';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { TiltCard } from '@/components/ui/TiltCard';

/** How many projects show before the visitor has to ask for more. */
const DEFAULT_VISIBLE = 3;

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const { t, pick } = useI18n();
  const flipped = index % 2 === 1;

  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      {/* Screenshot ---------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        className={cn('relative', flipped && 'lg:order-2')}
      >
        <TiltCard max={5}>
          <a
            href={project.url ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={project.url ? 0 : -1}
            aria-label={`${pick(project.title)} — ${t('projects.visit')}`}
            className="group ring-gradient relative block overflow-hidden rounded-[2rem] bg-surface-2/50 p-2 backdrop-blur-sm"
          >
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <img
                src={project.image}
                alt={pick(project.title)}
                loading="lazy"
                width={1200}
                height={750}
                className="aspect-16/10 w-full object-cover object-top transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
              />

              {/* Hover veil + visit affordance */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95"
              />
              <span className="absolute end-4 top-4 grid size-11 translate-y-3 place-items-center rounded-full bg-gold text-on-gold opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100">
                <Icon name="arrow-up-right" className="size-5 rtl:-scale-x-100" />
              </span>

              <span className="absolute start-4 bottom-4 text-xs font-medium tracking-wider text-white/85 uppercase">
                {pick(project.category)}
              </span>
            </div>
          </a>
        </TiltCard>
      </motion.div>

      {/* Copy ---------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE_EXPO }}
        className={cn('flex flex-col items-start gap-4', flipped && 'lg:order-1')}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-display text-5xl font-bold text-gold/18 tabular-nums select-none">
            {String(index + 1).padStart(2, '0')}
          </span>
          {project.featured && <Badge tone="gold">{t('projects.featured')}</Badge>}
          <Badge>{project.year}</Badge>
        </div>

        <h3 className="text-2xl font-bold text-ink-strong sm:text-3xl">{pick(project.title)}</h3>
        <p className="text-sm font-medium text-gold">{pick(project.tagline)}</p>
        <p className="max-w-xl leading-relaxed text-muted">{pick(project.description)}</p>

        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-2 flex flex-wrap gap-3">
          {project.url && (
            <Button
              as="a"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              trailingIcon="arrow-up-right"
            >
              {t('projects.visit')}
            </Button>
          )}
          {project.repo && (
            <Button
              as="a"
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              variant="outline"
              leadingIcon="github"
            >
              {t('projects.code')}
            </Button>
          )}
        </div>
      </motion.div>
    </article>
  );
}

export function Projects() {
  const { t, formatNumber } = useI18n();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? projects : projects.slice(0, DEFAULT_VISIBLE);
  const remaining = projects.length - visible.length;

  return (
    <Section id="projects" grid>
      <SectionHeading
        eyebrow={t('projects.eyebrow')}
        title={t('projects.title')}
        subtitle={t('projects.subtitle')}
      />

      <div className="mt-14 flex flex-col gap-16 lg:mt-24 lg:gap-28">
        <AnimatePresence>
          {visible.map((project, index) => (
            <motion.div
              key={project.id}
              initial={false}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
              style={{ overflow: 'hidden' }}
            >
              <ProjectRow project={project} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View more --------------------------------------------------------- */}
      {remaining > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
          className="mt-16 flex justify-center"
        >
          <Button variant="outline" onClick={() => setExpanded(true)} trailingIcon="chevron-down">
            {t('projects.viewMore')} ({formatNumber(remaining)})
          </Button>
        </motion.div>
      )}

      <Reveal from="up" className="mt-16">
        <div className="hairline" />
      </Reveal>
    </Section>
  );
}
