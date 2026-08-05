import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import ar from '@/i18n/ar.json';
import en from '@/i18n/en.json';
import { applyLocale, readLocale, storeLocale } from '@/lib/preferences';
import type { Locale, Localized } from '@/types/content';

const dictionaries = { en, ar } as const;

/** Walks a dotted path like `nav.projects` through a nested dictionary. */
function lookup(dictionary: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined,
      dictionary,
    );
}

interface I18nContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** UI string by dotted key, e.g. `t('nav.projects')`. */
  t: (key: string) => string;
  /** UI string list by dotted key, e.g. `tList('about.focus')`. */
  tList: (key: string) => string[];
  /** Picks the right half of a bilingual value from the content JSON. */
  pick: (value: Localized) => string;
  /** Locale-aware number formatting (Arabic gets Arabic-Indic digits). */
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readLocale());

  useEffect(() => {
    applyLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    storeLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => {
      const next: Locale = current === 'en' ? 'ar' : 'en';
      storeLocale(next);
      return next;
    });
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dictionary = dictionaries[locale];

    const t = (key: string): string => {
      const found = lookup(dictionary, key);
      if (typeof found === 'string') return found;
      // Fall back to English so a missing Arabic key never renders blank.
      const fallback = lookup(dictionaries.en, key);
      return typeof fallback === 'string' ? fallback : key;
    };

    const tList = (key: string): string[] => {
      const found = lookup(dictionary, key);
      if (Array.isArray(found)) return found.filter((item): item is string => typeof item === 'string');
      const fallback = lookup(dictionaries.en, key);
      return Array.isArray(fallback)
        ? fallback.filter((item): item is string => typeof item === 'string')
        : [];
    };

    const numberLocale = locale === 'ar' ? 'ar-QA' : 'en-US';

    return {
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      isRTL: locale === 'ar',
      setLocale,
      toggleLocale,
      t,
      tList,
      pick: (localized: Localized) => localized?.[locale] ?? localized?.en ?? '',
      formatNumber: (num, options) => new Intl.NumberFormat(numberLocale, options).format(num),
    };
  }, [locale, setLocale, toggleLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}
