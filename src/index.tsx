import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n/config';
import { LocaleRedirect, LocaleValidator } from './components/LocaleRouter';
import { RootThemeWrapper } from './components/RootThemeWrapper';
import { ThemeProvider } from './utils/theme';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RootThemeWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/:locale" element={<LocaleValidator />} />
            <Route path="/" element={<LocaleRedirect />} />
            <Route path="*" element={<LocaleRedirect />} />
          </Routes>
        </BrowserRouter>
      </RootThemeWrapper>
    </ThemeProvider>
  </React.StrictMode>,
);
