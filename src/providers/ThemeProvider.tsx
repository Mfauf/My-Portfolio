import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import {
  applyTheme,
  readThemeChoice,
  resolveTheme,
  storeThemeChoice,
  watchSystemTheme,
  type ResolvedTheme,
  type ThemeChoice,
} from '@/lib/preferences';

interface ThemeContextValue {
  /** What the user picked: an explicit theme, or "follow the system". */
  choice: ThemeChoice;
  /** What's actually rendered right now. */
  theme: ResolvedTheme;
  setChoice: (choice: ThemeChoice) => void;
  /** Light ⇄ dark, leaving "system" behind. */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(() => readThemeChoice());
  const [theme, setTheme] = useState<ResolvedTheme>(() => resolveTheme(readThemeChoice()));

  // Push the resolved theme onto <html> whenever the choice changes.
  useEffect(() => {
    const resolved = resolveTheme(choice);
    setTheme(resolved);
    applyTheme(resolved);
  }, [choice]);

  // While on "system", follow the OS as it changes (e.g. at sunset).
  useEffect(() => {
    if (choice !== 'system') return;
    return watchSystemTheme((isDark) => {
      const resolved: ResolvedTheme = isDark ? 'dark' : 'light';
      setTheme(resolved);
      applyTheme(resolved);
    });
  }, [choice]);

  const setChoice = useCallback((next: ThemeChoice) => {
    setChoiceState(next);
    storeThemeChoice(next);
  }, []);

  const toggle = useCallback(() => {
    setChoiceState((current) => {
      const next: ThemeChoice = resolveTheme(current) === 'dark' ? 'light' : 'dark';
      storeThemeChoice(next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ choice, theme, setChoice, toggle }),
    [choice, theme, setChoice, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>');
  return context;
}
