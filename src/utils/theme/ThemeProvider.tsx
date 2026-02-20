import React, { useCallback, useEffect, useState } from 'react';
import { Theme, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { ThemeContext, ThemeMode } from './ThemeContext';

const customFontFamilyBase = '"Google Sans Flex", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
const customFontFamilyMonospace = 'Consolas, "Courier New", Courier, monospace';
const customFontFamilyNumeric = '"Google Sans Flex", Bahnschrift, "Segoe UI", "Segoe UI Web (West European)", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif';

const customLightTheme: Theme = {
  ...webLightTheme,
  fontFamilyBase: customFontFamilyBase,
  fontFamilyMonospace: customFontFamilyMonospace,
  fontFamilyNumeric: customFontFamilyNumeric,
};

const customDarkTheme: Theme = {
  ...webDarkTheme,
  fontFamilyBase: customFontFamilyBase,
  fontFamilyMonospace: customFontFamilyMonospace,
  fontFamilyNumeric: customFontFamilyNumeric,
};

const STORAGE_KEY = 'ui.themeMode';
const isBrowser = typeof window !== 'undefined';

const readStoredMode = (): ThemeMode => {
  if (!isBrowser) {
    return 'auto';
  }
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  return saved === 'auto' || saved === 'light' || saved === 'dark' ? saved : 'auto';
};

const readSystemPrefersDark = (): boolean => {
  if (!isBrowser) {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode());
  const [systemDark, setSystemDark] = useState<boolean>(() => readSystemPrefersDark());

  useEffect(() => {
    if (!isBrowser) {
      return undefined;
    }

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const persist = useCallback((next: ThemeMode) => {
    if (isBrowser) {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const cycleMode = useCallback(() => {
    setMode(prev => {
      const order: ThemeMode[] = ['auto', 'light', 'dark'];
      const idx = order.indexOf(prev);
      const next = order[(idx + 1) % order.length];
      persist(next);
      return next;
    });
  }, [persist]);

  const handleSetMode = useCallback((next: ThemeMode) => {
    setMode(next);
    persist(next);
  }, [persist]);

  const effectiveMode: ThemeMode = mode === 'auto' ? (systemDark ? 'dark' : 'light') : mode;
  const theme = effectiveMode === 'dark' ? customDarkTheme : customLightTheme;

  return (
    <ThemeContext.Provider value={{ mode, theme, cycleMode, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
