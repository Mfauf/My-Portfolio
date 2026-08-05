import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { allSkills, profile, socials } from '@/lib/content';
import { EASE_EXPO, staggerParent } from '@/lib/motion';
import { scrollToSection } from '@/hooks/useSmoothScroll';
import { useI18n } from '@/providers/I18nProvider';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Magnetic } from '@/components/ui/Magnetic';
import { Marquee } from '@/components/ui/Marquee';
import { TiltCard } from '@/components/ui/TiltCard';

const ROTATE_MS = 2600;

/** Vertically flips through the roles listed in profile.json. */
function RotatingRole() {
  const { pick } = useI18n();
  const roles = profile.rotatingRoles;
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [roles.length, reduced]);

  return (
    <span className="relative inline-grid h-[1.35em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_EXPO }}
          className="col-start-1 row-start-1 whitespace-nowrap text-gold"
        >
          {pick(roles[index])}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const { t, pick } = useI18n();

  return (
    <section id="home" className="relative flex min-h-svh flex-col justify-center pt-28 pb-10 sm:pt-32">
      <div className="container-page">
        <motion.div
          variants={staggerParent(0.1, 0.15)}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16"
        >
          {/* ---------------------------------------------------------------- */}
          {/* Copy                                                             */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex flex-col items-start gap-6 text-start">
            {profile.availability.open && (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6, ease: EASE_EXPO }}
              >
                <Badge tone="live" pulse>
                  {pick(profile.availability.label)}
                </Badge>
              </motion.div>
            )}

            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
              className="text-base text-muted sm:text-lg"
            >
              {pick(profile.greeting)}
            </motion.p>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.85, ease: EASE_EXPO }}
              className="text-gradient-gold-animated text-5xl leading-[1.02] font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.25rem]"
            >
              {pick(profile.name)}
            </motion.h1>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
              className="flex flex-wrap items-baseline gap-x-3 text-xl font-medium text-ink sm:text-2xl lg:text-3xl"
            >
              <span className="text-muted">&lt;</span>
              <RotatingRole />
              <span className="text-muted">/&gt;</span>
            </motion.div>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
              className="max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              {pick(profile.tagline)}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
              className="mt-2 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <Button size="lg" onClick={() => scrollToSection('contact')} trailingIcon="arrow-right">
                  {t('hero.cta')}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button size="lg" variant="outline" onClick={() => scrollToSection('projects')}>
                  {t('hero.secondary')}
                </Button>
              </Magnetic>
              <Magnetic>
                <Button
                  as="a"
                  href={profile.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  variant="ghost"
                  leadingIcon="download"
                >
                  {pick(profile.resume.label)}
                </Button>
              </Magnetic>
            </motion.div>

            {/* Meta row */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease: EASE_EXPO }}
              className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-faint"
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="map-pin" className="size-4 text-gold" />
                {pick(profile.location)}
              </span>

              <span aria-hidden="true" className="hidden h-4 w-px bg-line sm:block" />

              <div className="flex items-center gap-2">
                {socials
                  .filter((social) => social.primary)
                  .map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target={social.url.startsWith('mailto') ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="grid size-9 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/45 hover:text-gold"
                    >
                      <Icon name={social.icon} className="size-4" />
                    </a>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Portrait                                                         */}
          {/* ---------------------------------------------------------------- */}
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <TiltCard max={6}>
              <div className="ring-gradient relative overflow-hidden rounded-[2.5rem] bg-surface-2/40 p-2 backdrop-blur-sm">
                <div className="relative overflow-hidden rounded-[2rem]">
                  <img
                    src={profile.avatar}
                    alt={pick(profile.name)}
                    width={720}
                    height={880}
                    fetchPriority="high"
                    className="aspect-[4/5] w-full object-cover object-top"
                  />
                  {/* Warm gradient so the portrait sits in the palette. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-transparent to-transparent"
                  />
                </div>
              </div>
            </TiltCard>

            {/* Floating credential chips */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass absolute -start-3 top-8 rounded-2xl px-4 py-3 shadow-lg sm:-start-6"
            >
              <p className="text-[0.65rem] font-medium tracking-widest text-faint uppercase">GPA</p>
              <p className="text-lg font-bold text-gold">3.73</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              className="glass absolute -end-3 bottom-16 max-w-[10.5rem] rounded-2xl px-4 py-3 shadow-lg sm:-end-6"
            >
              <p className="text-[0.65rem] font-medium tracking-widest text-faint uppercase">
                Qatar University
              </p>
              <p className="text-sm font-semibold text-ink-strong">
                {pick({ en: 'Computer Engineering', ar: 'هندسة الحاسوب' })}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Tech belt                                                            */}
      {/* -------------------------------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.9 }}
        className="mt-16"
      >
        {/* Decorative only — the same technologies are listed, with context,
            in the Skills section. */}
        <Marquee speed={42} className="py-2" aria-hidden="true">
          {allSkills.map((skill, index) => (
            <span
              key={`${skill.name}-${index}`}
              className="flex items-center gap-2.5 rounded-full border border-line bg-surface-2/40 px-4 py-2 text-sm whitespace-nowrap text-muted backdrop-blur-sm"
            >
              <img src={skill.icon} alt="" width={18} height={18} className="size-[18px] object-contain" />
              {skill.name}
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
