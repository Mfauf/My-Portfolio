/**
 * Theme + language persistence.
 *
 * The same storage keys and logic are duplicated in the inline bootstrap
 * script in `index.html`, which runs before React so the first paint is
 * already correct. If you change a key here, change it there too.
 */

import type { Locale } from '@/types/content';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_KEY = 'mmfauf:theme';
export const LANG_KEY = 'mmfauf:lang';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function safeRead(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Private browsing or blocked storage — fall back to defaults.
    return null;
  }
}

function safeWrite(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(DARK_QUERY).matches;
}

export function readThemeChoice(): ThemeChoice {
  const stored = safeRead(THEME_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

export function storeThemeChoice(choice: ThemeChoice): void {
  safeWrite(THEME_KEY, choice);
}

export function resolveTheme(choice: ThemeChoice): ResolvedTheme {
  if (choice === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return choice;
}

/** Applies the resolved theme to <html>; keeps the meta theme-color in sync. */
export function applyTheme(theme: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
}

export function readLocale(): Locale {
  const stored = safeRead(LANG_KEY);
  if (stored === 'en' || stored === 'ar') return stored;

  const navigatorLang = typeof navigator !== 'undefined' ? navigator.language : 'en';
  return navigatorLang.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

export function storeLocale(locale: Locale): void {
  safeWrite(LANG_KEY, locale);
}

/** Applies language + text direction to <html>. */
export function applyLocale(locale: Locale): void {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === 'ar' ? 'rtl' : 'ltr';
}

export function watchSystemTheme(onChange: (isDark: boolean) => void): () => void {
  const media = window.matchMedia(DARK_QUERY);
  const handler = (event: MediaQueryListEvent) => onChange(event.matches);
  media.addEventListener('change', handler);
  return () => media.removeEventListener('change', handler);
}
