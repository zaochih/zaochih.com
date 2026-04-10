import React from 'react';
import { FluentProvider } from '@fluentui/react-components';
import { useThemeMode } from '../utils/theme';

export const RootThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, effectiveMode } = useThemeMode();

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const canvas = document.createElement('canvas');
    const supportsAvif = canvas.toDataURL('image/avif').startsWith('data:image/avif');
    document.documentElement.dataset.avif = supportsAvif ? 'supported' : 'unsupported';
  }, []);

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.theme = effectiveMode;
    document.body.style.color = theme.colorNeutralForeground1;
  }, [effectiveMode, theme]);

  return (
    <FluentProvider theme={theme} style={{ backgroundColor: 'transparent' }}>
      {children}
    </FluentProvider>
  );
};
