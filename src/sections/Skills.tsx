import { motion } from 'framer-motion';

import { skillGroups } from '@/lib/content';
import { EASE_EXPO, staggerParent } from '@/lib/motion';
import { useI18n } from '@/providers/I18nProvider';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_EXPO } },
};

export function Skills() {
  const { t, pick, formatNumber } = useI18n();

  return (
    <Section id="skills" grid>
      <SectionHeading
        eyebrow={t('skills.eyebrow')}
        title={t('skills.title')}
        subtitle={t('skills.subtitle')}
      />

      <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2">
        {skillGroups.map((group, groupIndex) => (
          <Reveal
            key={group.id}
            from={groupIndex % 2 === 0 ? 'right' : 'left'}
            delay={(groupIndex % 2) * 0.08}
            className={groupIndex === skillGroups.length - 1 && skillGroups.length % 2 === 1 ? 'lg:col-span-2' : ''}
          >
            <Card className="h-full p-6 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-ink-strong">{pick(group.title)}</h3>
                <span className="text-xs text-faint tabular-nums">
                  {formatNumber(group.items.length)}
                </span>
              </div>

              <motion.ul
                variants={staggerParent(0.07)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {group.items.map((skill) => (
                  <motion.li key={`${group.id}-${skill.name}`} variants={item} className="group/skill">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line bg-surface-2/60 transition-transform duration-400 group-hover/skill:scale-110">
                        <img
                          src={skill.icon}
                          alt=""
                          width={20}
                          height={20}
                          loading="lazy"
                          className="size-5 object-contain"
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
                        {skill.name}
                      </span>
                      <span className="text-xs text-faint tabular-nums">
                        {formatNumber(skill.level)}%
                      </span>
                    </div>

                    {/* whileInView lives on this track, not the bar: a
                        scaleX:0 element collapses to zero width, so an
                        observer watching it directly never fires. */}
                    <motion.div
                      className="h-1 w-full overflow-hidden rounded-full bg-line"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.8 }}
                    >
                      <motion.div
                        className="h-full origin-left rounded-full bg-linear-to-r from-gold-600 via-gold-400 to-gold-200 rtl:origin-right"
                        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: skill.level / 100 } }}
                        transition={{ duration: 1.2, ease: EASE_EXPO }}
                      />
                    </motion.div>
                  </motion.li>
                ))}
              </motion.ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
