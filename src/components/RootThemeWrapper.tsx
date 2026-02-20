import React from 'react';
import { FluentProvider } from '@fluentui/react-components';
import { useThemeMode } from '../utils/theme';

export const RootThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useThemeMode();

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.body.style.backgroundColor = theme.colorNeutralBackground1;
    document.body.style.color = theme.colorNeutralForeground1;
  }, [theme]);

  return <FluentProvider theme={theme}>{children}</FluentProvider>;
};
