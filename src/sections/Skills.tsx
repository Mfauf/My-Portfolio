import { motion } from 'framer-motion';

import { skillGroups } from '@/lib/content';
import { EASE_EXPO, staggerParent } from '@/lib/motion';
import { useI18n } from '@/providers/I18nProvider';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';

const item = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE_EXPO } },
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
                variants={staggerParent(0.05)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-wrap gap-2.5"
              >
                {group.items.map((skill) => (
                  <motion.li
                    key={`${group.id}-${skill.name}`}
                    variants={item}
                    className="group/skill flex items-center gap-2.5 rounded-full border border-line bg-surface-2/50 py-2.5 ps-3 pe-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/35 hover:bg-gold/8"
                  >
                    <span className="grid size-7 shrink-0 place-items-center">
                      <img
                        src={skill.icon}
                        alt=""
                        width={20}
                        height={20}
                        loading="lazy"
                        className="size-5 object-contain transition-transform duration-400 group-hover/skill:scale-110"
                      />
                    </span>
                    <span className="text-sm font-medium whitespace-nowrap text-ink">{skill.name}</span>
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
