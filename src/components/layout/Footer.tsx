import { profile, socials } from '@/lib/content';
import { SECTIONS } from '@/lib/sections';
import { scrollToSection } from '@/lib/scroll';
import { useI18n } from '@/providers/I18nProvider';
import { NameParticles } from '@/components/effects/NameParticles';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';

export function Footer() {
  const { t, pick, locale, formatNumber } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line pt-16 pb-10">
      <div className="container-page">
        {/* ------------------------------------------------------------------ */}
        {/* Particle signature                                                 */}
        {/* ------------------------------------------------------------------ */}
        <Reveal from="up" amount={0.15}>
          <div className="flex flex-col items-center gap-3">
            <NameParticles
              text={pick(profile.shortName)}
              // Arabic needs the Arabic face for the sampled letterforms.
              fontFamily={
                locale === 'ar'
                  ? "'IBM Plex Sans Arabic', system-ui, sans-serif"
                  : "'Sora', system-ui, sans-serif"
              }
              label={t('footer.nameCanvas')}
              className="max-w-4xl"
            />
            <p className="flex items-center gap-2 text-xs text-faint">
              <Icon name="sparkles" className="size-3.5 text-gold" />
              {t('footer.hint')}
            </p>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------ */}
        {/* Link columns                                                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <img src={profile.logo} alt="" width={44} height={44} className="size-11 object-contain" />
              <div>
                <p className="font-display text-base font-semibold text-ink-strong">
                  {pick(profile.name)}
                </p>
                <p className="text-xs text-gold">{pick(profile.role)}</p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{t('footer.tagline')}</p>

            <div className="mt-6 flex gap-2.5">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target={social.url.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="grid size-10 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-1 hover:border-gold/45 hover:text-gold"
                >
                  <Icon name={social.icon} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t('footer.sitemap')}>
            <h3 className="text-sm font-semibold text-ink-strong">{t('footer.sitemap')}</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {t(section.labelKey)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-ink-strong">{t('footer.connect')}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-gold"
                >
                  <Icon name="mail" className="size-4 shrink-0 text-gold" />
                  <span dir="ltr">{profile.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.contact.phoneHref}`}
                  className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-gold"
                >
                  <Icon name="phone" className="size-4 shrink-0 text-gold" />
                  <span dir="ltr">{profile.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={profile.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-gold"
                >
                  <Icon name="download" className="size-4 shrink-0 text-gold" />
                  {pick(profile.resume.label)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Colophon                                                           */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-7 text-xs text-faint sm:flex-row">
          <p>
            © {formatNumber(year, { useGrouping: false })} {pick(profile.name)}. {t('footer.rights')}
          </p>
          <p>{t('footer.builtWith')}</p>
        </div>
      </div>
    </footer>
  );
}
