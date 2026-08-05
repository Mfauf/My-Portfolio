import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { cn } from '@/lib/cn';
import { profile, services, socials } from '@/lib/content';
import { EASE_EXPO } from '@/lib/motion';
import { useI18n } from '@/providers/I18nProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';

/** Web3Forms endpoint — the access key is public by design. */
const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = 'ffdf188d-04b9-4eef-be5d-1e04b66631d9';

const BUDGETS = ['< $500', '$500 – $1,000', '$1,000 – $2,500', '$2,500+'];

type Status = 'idle' | 'sending' | 'success' | 'error';

const fieldClasses =
  'w-full rounded-2xl border border-line bg-surface-2/50 px-4 py-3 text-sm text-ink ' +
  'placeholder:text-faint transition-colors duration-300 outline-none ' +
  'focus:border-gold/60 focus:bg-surface-2';

export function Contact() {
  const { t, pick } = useI18n();
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, access_key: ACCESS_KEY }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <Section id="contact" grid>
      <SectionHeading
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />

      <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Direct channels ------------------------------------------------ */}
        <Reveal from="right" className="flex flex-col gap-6">
          <Card className="p-7">
            <h3 className="text-base font-semibold text-ink-strong">{t('contact.orReachMe')}</h3>

            <ul className="mt-5 flex flex-col gap-3">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target={social.url.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-3.5 rounded-2xl border border-line bg-surface-2/40 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/35"
                  >
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-xl text-white transition-transform duration-300 group-hover/link:scale-110"
                      style={{ backgroundColor: social.brandColor }}
                    >
                      <Icon name={social.icon} className="size-[1.1rem]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink-strong">{social.label}</span>
                      <span className="block truncate text-xs text-faint" dir="ltr">
                        {social.handle}
                      </span>
                    </span>
                    <Icon
                      name="arrow-up-right"
                      className="size-4 shrink-0 text-faint transition-colors group-hover/link:text-gold rtl:-scale-x-100"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-5 flex items-center gap-2 text-xs text-faint">
              <Icon name="clock" className="size-3.5 text-gold" />
              {t('contact.responseTime')}
            </p>
          </Card>

          <Card className="p-7" spotlight={false}>
            <span className="grid size-11 place-items-center rounded-2xl bg-gold/12 text-gold">
              <Icon name="map-pin" className="size-5" />
            </span>
            <p className="mt-4 text-sm font-medium text-ink-strong">{pick(profile.location)}</p>
            <p className="mt-1 text-xs text-faint">{pick(profile.role)}</p>
          </Card>
        </Reveal>

        {/* Form ------------------------------------------------------------ */}
        <Reveal from="left" delay={0.08}>
          <Card className="p-7 sm:p-9" gradientRing spotlight={false}>
            <h3 className="text-lg font-semibold text-ink-strong">{t('contact.formTitle')}</h3>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              {/* Honeypot: bots fill it, humans never see it. */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="sr-only"
                aria-hidden="true"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-ink">{t('contact.name')}</span>
                  <input
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={t('contact.namePlaceholder')}
                    className={fieldClasses}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-ink">{t('contact.email')}</span>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    dir="ltr"
                    placeholder={t('contact.emailPlaceholder')}
                    className={cn(fieldClasses, 'text-start')}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-ink">{t('contact.phone')}</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    dir="ltr"
                    placeholder={t('contact.phonePlaceholder')}
                    className={cn(fieldClasses, 'text-start')}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-ink">{t('contact.service')}</span>
                  <select name="service" required defaultValue="" className={cn(fieldClasses, 'cursor-pointer')}>
                    <option value="" disabled>
                      {t('contact.servicePlaceholder')}
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title.en}>
                        {pick(service.title)}
                      </option>
                    ))}
                    <option value="Other">{t('contact.serviceOther')}</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">{t('contact.budget')}</span>
                <select name="budget" defaultValue="" className={cn(fieldClasses, 'cursor-pointer')}>
                  <option value="">{t('contact.budgetPlaceholder')}</option>
                  {BUDGETS.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-ink">{t('contact.details')}</span>
                <textarea
                  name="details"
                  required
                  rows={5}
                  placeholder={t('contact.detailsPlaceholder')}
                  className={cn(fieldClasses, 'resize-y')}
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  disabled={status === 'sending'}
                  trailingIcon={status === 'sending' ? undefined : 'send'}
                >
                  {status === 'sending' ? t('contact.submitting') : t('contact.submit')}
                </Button>

                <Button
                  as="a"
                  href={`https://wa.me/${profile.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  leadingIcon="whatsapp"
                >
                  {t('contact.whatsappCta')}
                </Button>
              </div>

              {/* Result banner */}
              <AnimatePresence>
                {(status === 'success' || status === 'error') && (
                  <motion.p
                    role="status"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE_EXPO }}
                    className={cn(
                      'flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm',
                      status === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
                    )}
                  >
                    <Icon
                      name={status === 'success' ? 'check-circle' : 'close'}
                      className="size-4 shrink-0"
                    />
                    {status === 'success' ? t('contact.success') : t('contact.error')}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
