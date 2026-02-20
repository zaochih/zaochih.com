import { createContext, useContext } from 'react';
import { Theme } from '@fluentui/react-components';

export type ThemeMode = 'auto' | 'light' | 'dark';

export interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  cycleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useThemeMode(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return ctx;
}
